import { Router } from 'express';
import { query } from '../../db/pool';
import { asyncHandler, ok } from '../../utils/http';

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

export default router;
