import { Router } from 'express';
import { z } from 'zod';
import { query, withTransaction } from '../../db/pool';
import { asyncHandler, ok, created, errors, parsePagination } from '../../utils/http';
import { authenticate, rbac } from '../../middleware/auth';
import { parseRupiah, detectTierAnomalies } from '../../utils/pricing';

const router = Router();
router.use(authenticate);

// Kolom CSV standar untuk import / export / template.
const CSV_HEADERS = [
  'URL Image', 'SKU', 'Kategori', 'Nama Barang', 'Ukuran', 'Type', 'Karton', 'Pcs', 'Stock',
  'HET 1-5', 'S1 6-9', 'S2 10-24', 'S3 25-150', 'S4 >150',
];

/** Escape satu nilai untuk baris CSV. */
function csvCell(v: unknown): string {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function toCsv(rows: (string | number | null)[][]): string {
  return rows.map((r) => r.map(csvCell).join(',')).join('\r\n');
}

/** Parser CSV minimal yang menghormati tanda kutip. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c === '\r') { /* skip */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const tier = z.number().nonnegative().nullable().optional();
const barangSchema = z.object({
  nama_barang: z.string().min(1),
  kategori: z.string().optional(),
  hpp: z.number().nonnegative(),
  harga_jual: z.number().nonnegative(),
  stok_saat_ini: z.number().int().nonnegative().optional(),
  stok_minimum: z.number().int().nonnegative().optional(),
  unit: z.string().optional(),
  gambar: z.string().nullable().optional(),
  // Model grosir Brontolano
  sku: z.string().nullable().optional(),
  ukuran: z.string().nullable().optional(),
  type_kemasan: z.string().nullable().optional(),
  isi_karton: z.number().int().nonnegative().nullable().optional(),
  isi_pcs: z.number().int().nonnegative().nullable().optional(),
  harga_het: tier,
  harga_s1: tier,
  harga_s2: tier,
  harga_s3: tier,
  harga_s4: tier,
  batas_het: tier,
});

// GET /inventory — list barang
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { limit, offset, page } = parsePagination(req);
    const search = (req.query.search as string) || '';
    const params: any[] = [];
    let whereSql = '';
    if (search) {
      params.push(`%${search}%`);
      whereSql = `WHERE nama_barang ILIKE $1 OR kategori ILIKE $1`;
    }
    const total = await query<{ count: string }>(`SELECT COUNT(*) FROM barang ${whereSql}`, params);
    params.push(limit, offset);
    const rows = await query(
      `SELECT * FROM barang ${whereSql} ORDER BY nama_barang LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    ok(res, rows.rows, { page, limit, total: Number(total.rows[0].count) });
  })
);

// GET /inventory/export-csv — unduh semua produk sebagai CSV (sebelum /:id)
router.get(
  '/export-csv',
  asyncHandler(async (_req, res) => {
    const r = await query('SELECT * FROM barang ORDER BY kategori, nama_barang');
    const body: (string | number | null)[][] = [CSV_HEADERS];
    for (const b of r.rows) {
      const img = typeof b.gambar === 'string' && b.gambar.startsWith('http') ? b.gambar : '';
      body.push([
        img, b.sku, b.kategori, b.nama_barang, b.ukuran, b.type_kemasan, b.isi_karton, b.isi_pcs,
        b.stok_saat_ini, b.harga_het, b.harga_s1, b.harga_s2, b.harga_s3, b.harga_s4,
      ]);
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="produk-cdm.csv"');
    res.send('﻿' + toCsv(body)); // BOM agar Excel baca UTF-8
  })
);

// GET /inventory/template-csv — unduh template CSV kosong + 1 contoh (sebelum /:id)
router.get(
  '/template-csv',
  asyncHandler(async (_req, res) => {
    const example = [
      'https://contoh.com/gambar.jpg', 'MKG-0001', 'Minyak Goreng', 'Contoh Minyak 1L', 'Karton', 'Pouch',
      '12', '12', '100', '244757', '242361', '239940', '237495', '235000',
    ];
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="template-produk.csv"');
    res.send('﻿' + toCsv([CSV_HEADERS, example]));
  })
);

// GET /inventory/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const r = await query('SELECT * FROM barang WHERE id=$1', [req.params.id]);
    if (!r.rowCount) throw errors.notFound('Barang tidak ditemukan');
    ok(res, r.rows[0]);
  })
);

// POST /inventory — create barang (admin)
router.post(
  '/',
  rbac('admin'),
  asyncHandler(async (req, res) => {
    const d = barangSchema.parse(req.body);
    if (d.harga_jual < d.hpp) throw errors.unprocessable('Harga jual harus >= HPP (margin negatif)');
    const r = await query(
      `INSERT INTO barang
        (nama_barang, kategori, hpp, harga_jual, stok_saat_ini, stok_minimum, unit, gambar,
         sku, ukuran, type_kemasan, isi_karton, isi_pcs, harga_het, harga_s1, harga_s2, harga_s3, harga_s4, batas_het)
       VALUES ($1,$2,$3,$4,COALESCE($5,0),COALESCE($6,5),COALESCE($7,'pcs'),$8,
               $9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING *`,
      [d.nama_barang, d.kategori ?? null, d.hpp, d.harga_jual, d.stok_saat_ini ?? null, d.stok_minimum ?? null, d.unit ?? null, d.gambar ?? null,
       d.sku ?? null, d.ukuran ?? null, d.type_kemasan ?? null, d.isi_karton ?? null, d.isi_pcs ?? null,
       d.harga_het ?? d.harga_jual ?? null, d.harga_s1 ?? null, d.harga_s2 ?? null, d.harga_s3 ?? null, d.harga_s4 ?? null, d.batas_het ?? null]
    );
    created(res, r.rows[0]);
  })
);

// PUT /inventory/:id — update harga / detail (admin)
router.put(
  '/:id',
  rbac('admin'),
  asyncHandler(async (req, res) => {
    const d = barangSchema.partial().parse(req.body);
    const fields = Object.keys(d);
    if (!fields.length) throw errors.badRequest('Tidak ada field untuk diupdate');

    const existing = await query('SELECT * FROM barang WHERE id=$1', [req.params.id]);
    if (!existing.rowCount) throw errors.notFound('Barang tidak ditemukan');

    // Margin check juga saat update: gabungkan nilai baru dengan nilai lama
    const hpp = d.hpp ?? Number(existing.rows[0].hpp);
    const hargaJual = d.harga_jual ?? Number(existing.rows[0].harga_jual);
    if (hargaJual < hpp) throw errors.unprocessable('Harga jual harus >= HPP (margin negatif)');

    const sets = fields.map((f, i) => `${f}=$${i + 1}`);
    const params = fields.map((f) => (d as any)[f]);
    params.push(req.params.id);
    const r = await query(
      `UPDATE barang SET ${sets.join(', ')}, updated_at=now() WHERE id=$${params.length} RETURNING *`,
      params
    );
    ok(res, r.rows[0]);
  })
);

// DELETE /inventory/:id — hapus barang (admin)
router.delete(
  '/:id',
  rbac('admin'),
  asyncHandler(async (req, res) => {
    // Cegah hapus jika barang masih dipakai di order
    const used = await query('SELECT 1 FROM order_items WHERE barang_id=$1 LIMIT 1', [req.params.id]);
    if (used.rowCount) throw errors.conflict('Barang tidak bisa dihapus karena sudah dipakai di order. Nonaktifkan/ubah saja.');
    const result = await withTransaction(async (client) => {
      await client.query('DELETE FROM stok_history WHERE barang_id=$1', [req.params.id]);
      const del = await client.query('DELETE FROM barang WHERE id=$1 RETURNING id', [req.params.id]);
      if (!del.rowCount) throw errors.notFound('Barang tidak ditemukan');
      return del.rows[0];
    });
    ok(res, { message: 'Barang dihapus', id: result.id });
  })
);

// POST /inventory/:id/masuk — stok masuk (gudang & admin)
router.post(
  '/:id/masuk',
  rbac('gudang', 'admin'),
  asyncHandler(async (req, res) => {
    const { jumlah, keterangan, foto, hpp_baru } = z
      .object({
        jumlah: z.number().int().positive(),
        keterangan: z.string().optional(),
        foto: z.string().nullable().optional(),       // bukti nota base64
        hpp_baru: z.number().nonnegative().nullable().optional(),
      })
      .parse(req.body);
    const result = await withTransaction(async (client) => {
      const upd = await client.query(
        `UPDATE barang SET stok_saat_ini = stok_saat_ini + $1,
           hpp = COALESCE($2, hpp), updated_at=now() WHERE id=$3 RETURNING *`,
        [jumlah, hpp_baru ?? null, req.params.id]
      );
      if (!upd.rowCount) throw errors.notFound('Barang tidak ditemukan');
      await client.query(
        `INSERT INTO stok_history (barang_id, tipe, jumlah, keterangan, foto, created_by) VALUES ($1,'masuk',$2,$3,$4,$5)`,
        [req.params.id, jumlah, keterangan ?? 'Restock', foto ?? null, req.user!.id]
      );
      return upd.rows[0];
    });
    ok(res, result);
  })
);

// POST /inventory/:id/keluar — barang keluar manual (gudang & admin)
router.post(
  '/:id/keluar',
  rbac('gudang', 'admin'),
  asyncHandler(async (req, res) => {
    const { jumlah, keterangan } = z
      .object({ jumlah: z.number().int().positive(), keterangan: z.string().min(1) })
      .parse(req.body);
    const result = await withTransaction(async (client) => {
      const cur = await client.query('SELECT stok_saat_ini, nama_barang FROM barang WHERE id=$1 FOR UPDATE', [req.params.id]);
      if (!cur.rowCount) throw errors.notFound('Barang tidak ditemukan');
      if (jumlah > cur.rows[0].stok_saat_ini) {
        throw errors.unprocessable(`Stok tidak cukup untuk ${cur.rows[0].nama_barang} (tersedia ${cur.rows[0].stok_saat_ini})`);
      }
      const upd = await client.query(
        'UPDATE barang SET stok_saat_ini = stok_saat_ini - $1, updated_at=now() WHERE id=$2 RETURNING *',
        [jumlah, req.params.id]
      );
      await client.query(
        `INSERT INTO stok_history (barang_id, tipe, jumlah, keterangan, created_by) VALUES ($1,'keluar',$2,$3,$4)`,
        [req.params.id, jumlah, `Keluar manual: ${keterangan}`, req.user!.id]
      );
      return upd.rows[0];
    });
    ok(res, result);
  })
);

// POST /inventory/:id/opname — penyesuaian stok manual (gudang & admin)
router.post(
  '/:id/opname',
  rbac('gudang', 'admin'),
  asyncHandler(async (req, res) => {
    const { stok_baru, keterangan } = z
      .object({ stok_baru: z.number().int().nonnegative(), keterangan: z.string().min(1) })
      .parse(req.body);
    const result = await withTransaction(async (client) => {
      const cur = await client.query('SELECT stok_saat_ini FROM barang WHERE id=$1 FOR UPDATE', [req.params.id]);
      if (!cur.rowCount) throw errors.notFound('Barang tidak ditemukan');
      const delta = stok_baru - cur.rows[0].stok_saat_ini;
      const upd = await client.query(
        'UPDATE barang SET stok_saat_ini=$1, updated_at=now() WHERE id=$2 RETURNING *',
        [stok_baru, req.params.id]
      );
      await client.query(
        `INSERT INTO stok_history (barang_id, tipe, jumlah, keterangan, created_by)
         VALUES ($1,'penyesuaian',$2,$3,$4)`,
        [req.params.id, delta, `Opname: ${keterangan} (${delta >= 0 ? '+' : ''}${delta})`, req.user!.id]
      );
      return upd.rows[0];
    });
    ok(res, result);
  })
);

// GET /inventory/:id/history — stok history
router.get(
  '/:id/history',
  asyncHandler(async (req, res) => {
    const r = await query(
      `SELECT sh.*, u.nama_lengkap AS oleh FROM stok_history sh
       LEFT JOIN users u ON u.id = sh.created_by
       WHERE barang_id=$1 ORDER BY sh.created_at DESC LIMIT 100`,
      [req.params.id]
    );
    ok(res, r.rows);
  })
);

/** Upsert baris CSV (format kolom CSV_HEADERS) ke tabel barang. */
async function importRows(rows: string[][]) {
  let imported = 0;
  let skipped = 0;
  const warnings: { nama: string; issues: string[] }[] = [];
  const failed: { nama: string; error: string }[] = [];
  await withTransaction(async (client) => {
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      const nama = (r[3] || '').trim();
      if (!nama) { skipped++; continue; }
      const sku = (r[1] || '').trim() || null;
      const data = {
        gambar: (r[0] || '').trim() || null,
        kategori: (r[2] || '').trim() || null,
        ukuran: (r[4] || '').trim() || null,
        type_kemasan: (r[5] || '').trim() || null,
        isi_karton: parseInt(r[6]) || null,
        isi_pcs: parseInt(r[7]) || null,
        stok: parseInt(r[8]) || 0,
        het: parseRupiah(r[9]),
        s1: parseRupiah(r[10]),
        s2: parseRupiah(r[11]),
        s3: parseRupiah(r[12]),
        s4: parseRupiah(r[13]),
      };
      const hargaJual = data.het ?? data.s1 ?? data.s2 ?? 0;
      // Deteksi anomali harga (mode peringatan — tetap diimpor)
      const issues = detectTierAnomalies({
        harga_het: data.het, harga_s1: data.s1, harga_s2: data.s2, harga_s3: data.s3, harga_s4: data.s4,
      });
      if (issues.length) warnings.push({ nama, issues });
      // Per-baris savepoint: jika 1 baris gagal, baris lain tetap terimpor.
      await client.query('SAVEPOINT row_sp');
      try {
        // Cocokkan berdasar SKU ATAU nama_barang (hindari bentrok unique nama).
        const existing = await client.query(
          'SELECT id FROM barang WHERE (sku IS NOT NULL AND sku=$1) OR nama_barang=$2 LIMIT 1',
          [sku, nama]
        );
        if (existing.rowCount) {
          await client.query(
            `UPDATE barang SET nama_barang=$2, kategori=$3, gambar=$4, ukuran=$5, type_kemasan=$6,
               isi_karton=$7, isi_pcs=$8, stok_saat_ini=$9, harga_het=$10, harga_s1=$11, harga_s2=$12,
               harga_s3=$13, harga_s4=$14, harga_jual=$15, sku=COALESCE($16,sku), updated_at=now() WHERE id=$1`,
            [existing.rows[0].id, nama, data.kategori, data.gambar, data.ukuran, data.type_kemasan,
             data.isi_karton, data.isi_pcs, data.stok, data.het, data.s1, data.s2, data.s3, data.s4, hargaJual, sku]
          );
        } else {
          await client.query(
            `INSERT INTO barang (nama_barang, kategori, gambar, ukuran, type_kemasan, isi_karton, isi_pcs,
               stok_saat_ini, harga_het, harga_s1, harga_s2, harga_s3, harga_s4, harga_jual, hpp, unit, sku)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,0,COALESCE($15,'pcs'),$16)`,
            [nama, data.kategori, data.gambar, data.ukuran, data.type_kemasan, data.isi_karton, data.isi_pcs,
             data.stok, data.het, data.s1, data.s2, data.s3, data.s4, hargaJual, data.ukuran, sku]
          );
        }
        await client.query('RELEASE SAVEPOINT row_sp');
        imported++;
      } catch (e: any) {
        await client.query('ROLLBACK TO SAVEPOINT row_sp');
        failed.push({ nama, error: e?.code === '23505' ? 'duplikat (SKU/nama bentrok)' : (e?.message || 'gagal') });
      }
    }
  });
  return { imported, skipped, warnings, failed };
}

// POST /inventory/import-csv — impor/sinkron produk dari file CSV (admin)
router.post(
  '/import-csv',
  rbac('admin'),
  asyncHandler(async (req, res) => {
    const csv = String(req.body?.csv || '');
    if (!csv.trim()) throw errors.badRequest('File CSV kosong.');
    if (csv.trim().startsWith('<')) throw errors.badRequest('File bukan CSV yang valid.');
    const rows = parseCsv(csv);
    if (rows.length < 2) throw errors.badRequest('CSV harus punya baris header + minimal 1 data.');
    const result = await importRows(rows);
    ok(res, { ...result, total_baris: rows.length - 1 });
  })
);

export default router;
