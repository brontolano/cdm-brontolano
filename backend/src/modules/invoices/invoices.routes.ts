import { Router } from 'express';
import { z } from 'zod';
import { query, withTransaction } from '../../db/pool';
import { asyncHandler, ok, errors, parsePagination } from '../../utils/http';
import { authenticate, rbac } from '../../middleware/auth';

const router = Router();
router.use(authenticate);

// GET /invoices — list
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { limit, offset, page } = parsePagination(req);
    const status = req.query.status as string | undefined;
    const params: any[] = [];
    let whereSql = '';
    if (status) {
      params.push(status);
      whereSql = 'WHERE i.status_pembayaran = $1';
    }
    const total = await query<{ count: string }>(`SELECT COUNT(*) FROM invoices i ${whereSql}`, params);
    params.push(limit, offset);
    const rows = await query(
      `SELECT i.*, o.nomor_order, k.nama_toko FROM invoices i
       JOIN orders o ON o.id=i.order_id JOIN konsumen k ON k.id=o.konsumen_id
       ${whereSql} ORDER BY i.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    ok(res, rows.rows, { page, limit, total: Number(total.rows[0].count) });
  })
);

// GET /invoices/:id — detail (print-ready data)
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const inv = await query(
      `SELECT i.*, o.nomor_order, o.tanggal_order, k.nama_toko, k.nama_pemilik, k.kontak_wa, k.alamat_lengkap
       FROM invoices i JOIN orders o ON o.id=i.order_id JOIN konsumen k ON k.id=o.konsumen_id WHERE i.id=$1`,
      [req.params.id]
    );
    if (!inv.rowCount) throw errors.notFound('Invoice tidak ditemukan');
    const items = await query(
      `SELECT oi.*, b.nama_barang, b.unit FROM order_items oi JOIN barang b ON b.id=oi.barang_id WHERE oi.order_id=$1`,
      [inv.rows[0].order_id]
    );
    ok(res, { ...inv.rows[0], items: items.rows });
  })
);

// POST /invoices/:id/payment — record payment (admin)
router.post(
  '/:id/payment',
  rbac('admin'),
  asyncHandler(async (req, res) => {
    const { jumlah } = z.object({ jumlah: z.number().positive() }).parse(req.body);
    const result = await withTransaction(async (client) => {
      const r = await client.query('SELECT * FROM invoices WHERE id=$1 FOR UPDATE', [req.params.id]);
      if (!r.rowCount) throw errors.notFound('Invoice tidak ditemukan');
      const inv = r.rows[0];
      const dibayar = Number(inv.jumlah_dibayar) + jumlah;
      const total = Number(inv.total);
      if (dibayar > total) throw errors.unprocessable('Pembayaran melebihi total invoice');
      const status = dibayar >= total ? 'lunas' : dibayar > 0 ? 'sebagian' : 'belum';
      const upd = await client.query(
        `UPDATE invoices SET jumlah_dibayar=$1, status_pembayaran=$2 WHERE id=$3 RETURNING *`,
        [dibayar, status, req.params.id]
      );
      // When fully paid, mark related order selesai
      if (status === 'lunas') {
        await client.query(`UPDATE orders SET status='selesai', updated_at=now() WHERE id=$1 AND status NOT IN ('dibatalkan')`, [inv.order_id]);
      }
      return upd.rows[0];
    });
    ok(res, result);
  })
);

export default router;
