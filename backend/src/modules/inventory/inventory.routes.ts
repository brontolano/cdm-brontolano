import { Router } from 'express';
import { z } from 'zod';
import { query, withTransaction } from '../../db/pool';
import { asyncHandler, ok, created, errors, parsePagination } from '../../utils/http';
import { authenticate, rbac } from '../../middleware/auth';
import { parseRupiah } from '../../utils/pricing';

const router = Router();
router.use(authenticate);

const DEFAULT_SHEET_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ51Ksal92REpUDTH96kcFcN2cwgJXHlFRFu8z0cBbiuHoOHZLkb9uE_RgplxVPtCdIQoUD0on5Z7om/pub?output=csv';

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
         sku, ukuran, type_kemasan, isi_karton, isi_pcs, harga_het, harga_s1, harga_s2, harga_s3, harga_s4)
       VALUES ($1,$2,$3,$4,COALESCE($5,0),COALESCE($6,5),COALESCE($7,'pcs'),$8,
               $9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING *`,
      [d.nama_barang, d.kategori ?? null, d.hpp, d.harga_jual, d.stok_saat_ini ?? null, d.stok_minimum ?? null, d.unit ?? null, d.gambar ?? null,
       d.sku ?? null, d.ukuran ?? null, d.type_kemasan ?? null, d.isi_karton ?? null, d.isi_pcs ?? null,
       d.harga_het ?? d.harga_jual ?? null, d.harga_s1 ?? null, d.harga_s2 ?? null, d.harga_s3 ?? null, d.harga_s4 ?? null]
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
    const { jumlah, keterangan } = z
      .object({ jumlah: z.number().int().positive(), keterangan: z.string().optional() })
      .parse(req.body);
    const result = await withTransaction(async (client) => {
      const upd = await client.query(
        `UPDATE barang SET stok_saat_ini = stok_saat_ini + $1, updated_at=now() WHERE id=$2 RETURNING *`,
        [jumlah, req.params.id]
      );
      if (!upd.rowCount) throw errors.notFound('Barang tidak ditemukan');
      await client.query(
        `INSERT INTO stok_history (barang_id, tipe, jumlah, keterangan, created_by) VALUES ($1,'masuk',$2,$3,$4)`,
        [req.params.id, jumlah, keterangan ?? 'Restock', req.user!.id]
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

// POST /inventory/import-sheet — impor produk dari Google Sheet Brontolano (admin)
router.post(
  '/import-sheet',
  rbac('admin'),
  asyncHandler(async (req, res) => {
    const url = (req.body?.url as string) || DEFAULT_SHEET_CSV;
    let csv: string;
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      csv = await resp.text();
    } catch (e: any) {
      throw errors.badRequest(`Gagal mengambil Google Sheet: ${e.message}. Pastikan sheet di-publish ke web (CSV).`);
    }
    if (csv.trim().startsWith('<')) throw errors.badRequest('Sheet belum di-publish publik (mendapat HTML, bukan CSV).');

    const rows = parseCsv(csv);
    if (rows.length < 2) throw errors.badRequest('Sheet kosong / format tidak sesuai.');

    // header: URL Image, SKU, Kategori, Nama Barang, Ukuran, Type, Karton, Pcs, Stock, HET, S1, S2, S3, S4
    let imported = 0;
    let skipped = 0;
    const result = await withTransaction(async (client) => {
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        const nama = (r[3] || '').trim();
        if (!nama) { skipped++; continue; }
        const sku = (r[1] || '').trim() || null;
        const data = {
          gambar: (r[0] || '').trim() || null,
          sku,
          kategori: (r[2] || '').trim() || null,
          nama_barang: nama,
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
        // Upsert: berdasar SKU jika ada, jika tidak berdasar nama_barang.
        const existing = await client.query(
          sku ? 'SELECT id FROM barang WHERE sku=$1' : 'SELECT id FROM barang WHERE nama_barang=$1',
          [sku || nama]
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
        imported++;
      }
      return { imported, skipped };
    });
    ok(res, { ...result, total_baris: rows.length - 1 });
  })
);

export default router;
