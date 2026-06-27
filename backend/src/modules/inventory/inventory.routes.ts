import { Router } from 'express';
import { z } from 'zod';
import { query, withTransaction } from '../../db/pool';
import { asyncHandler, ok, created, errors, parsePagination } from '../../utils/http';
import { authenticate, rbac } from '../../middleware/auth';

const router = Router();
router.use(authenticate);

const barangSchema = z.object({
  nama_barang: z.string().min(1),
  kategori: z.string().optional(),
  hpp: z.number().nonnegative(),
  harga_jual: z.number().nonnegative(),
  stok_saat_ini: z.number().int().nonnegative().optional(),
  stok_minimum: z.number().int().nonnegative().optional(),
  unit: z.string().optional(),
  gambar: z.string().nullable().optional(),
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
      `INSERT INTO barang (nama_barang, kategori, hpp, harga_jual, stok_saat_ini, stok_minimum, unit, gambar)
       VALUES ($1,$2,$3,$4,COALESCE($5,0),COALESCE($6,5),COALESCE($7,'pcs'),$8) RETURNING *`,
      [d.nama_barang, d.kategori ?? null, d.hpp, d.harga_jual, d.stok_saat_ini ?? null, d.stok_minimum ?? null, d.unit ?? null, d.gambar ?? null]
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

export default router;
