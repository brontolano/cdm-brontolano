import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { query } from '../../db/pool';
import { config } from '../../config';
import { asyncHandler, ok, created, errors } from '../../utils/http';
import { priceForQty } from '../../utils/pricing';

/** Best-effort: ambil konsumen_auth.id dari token konsumen bila dikirim (login opsional). */
function konsumenIdFrom(req: any): string | null {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return null;
  try {
    const p = jwt.verify(h.slice(7), config.jwt.konsumenSecret) as any;
    return p?.kind === 'konsumen' ? p.kid : null;
  } catch { return null; }
}

// Endpoint PUBLIK (tanpa login) untuk halaman katalog konsumen.
const router = Router();

// GET /api/public/catalog/products — daftar produk untuk katalog
router.get(
  '/products',
  asyncHandler(async (req, res) => {
    const search = ((req.query.search as string) || '').trim();
    const kategori = (req.query.kategori as string) || '';
    const where: string[] = [];
    const params: any[] = [];
    if (search) {
      params.push(`%${search}%`);
      where.push(`(nama_barang ILIKE $${params.length} OR sku ILIKE $${params.length})`);
    }
    if (kategori) {
      params.push(kategori);
      where.push(`kategori = $${params.length}`);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const r = await query(
      `SELECT id, sku, nama_barang, kategori, gambar, ukuran, type_kemasan, isi_karton, isi_pcs,
              stok_saat_ini, harga_het, harga_s1, harga_s2, harga_s3, harga_s4, harga_jual
       FROM barang ${whereSql} ORDER BY kategori, nama_barang`,
      params
    );
    ok(res, r.rows);
  })
);

// GET /api/public/catalog/categories — daftar kategori unik
router.get(
  '/categories',
  asyncHandler(async (_req, res) => {
    const r = await query(
      `SELECT DISTINCT kategori FROM barang WHERE kategori IS NOT NULL AND kategori <> '' ORDER BY kategori`
    );
    ok(res, r.rows.map((x) => x.kategori));
  })
);

// POST /api/public/catalog/order — buat pesanan masuk dari katalog (publik)
router.post(
  '/order',
  asyncHandler(async (req, res) => {
    const d = z
      .object({
        nama: z.string().min(1).max(150),
        kontak_wa: z.string().min(6),
        alamat: z.string().optional(),
        catatan: z.string().optional(),
        metode_bayar: z.enum(['cod', 'qris', 'transfer', 'va']).default('cod'),
        items: z.array(z.object({ barang_id: z.string().uuid(), jumlah: z.number().int().positive() })).min(1),
      })
      .parse(req.body);
    const konsumenAuthId = konsumenIdFrom(req);

    // Hitung harga di server (anti-tamper) memakai tier grosir.
    let total = 0;
    const items: any[] = [];
    for (const it of d.items) {
      const b = await query('SELECT * FROM barang WHERE id=$1', [it.barang_id]);
      if (!b.rowCount) throw errors.notFound(`Barang tidak ditemukan`);
      const barang = b.rows[0];
      const harga = priceForQty(barang, it.jumlah);
      const subtotal = harga * it.jumlah;
      total += subtotal;
      items.push({ barang_id: barang.id, nama_barang: barang.nama_barang, jumlah: it.jumlah, harga_satuan: harga, subtotal });
    }
    const r = await query(
      `INSERT INTO pesanan_masuk (nama_pemesan, kontak_wa, alamat, catatan, items, total, metode_bayar, konsumen_auth_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, total, status, metode_bayar, created_at`,
      [d.nama, d.kontak_wa, d.alamat ?? null, d.catatan ?? null, JSON.stringify(items), total, d.metode_bayar, konsumenAuthId]
    );
    created(res, { ...r.rows[0], items });
  })
);

export default router;
