import { Router } from 'express';
import { z } from 'zod';
import { query } from '../../db/pool';
import { asyncHandler, ok, created, errors, parsePagination } from '../../utils/http';
import { authenticate, rbac } from '../../middleware/auth';
import * as service from './orders.service';

const router = Router();
router.use(authenticate);

// GET /orders — list
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { limit, offset, page } = parsePagination(req);
    const status = req.query.status as string | undefined;
    const params: any[] = [];
    let whereSql = '';
    if (status) {
      params.push(status);
      whereSql = 'WHERE o.status = $1';
    }
    const total = await query<{ count: string }>(`SELECT COUNT(*) FROM orders o ${whereSql}`, params);
    params.push(limit, offset);
    const rows = await query(
      `SELECT o.*, k.nama_toko FROM orders o JOIN konsumen k ON k.id=o.konsumen_id
       ${whereSql} ORDER BY o.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    ok(res, rows.rows, { page, limit, total: Number(total.rows[0].count) });
  })
);

// GET /orders/:id — detail with items + invoice
router.get('/:id', asyncHandler(async (req, res) => ok(res, await service.getOrderDetail(req.params.id))));

// POST /orders — create (admin)
router.post(
  '/',
  rbac('admin'),
  asyncHandler(async (req, res) => {
    const d = z
      .object({
        konsumen_id: z.string().uuid(),
        items: z.array(z.object({ barang_id: z.string().uuid(), jumlah: z.number().int().positive() })).min(1),
        catatan: z.string().optional(),
      })
      .parse(req.body);
    created(res, await service.createOrder({ ...d, created_by: req.user!.id }));
  })
);

// POST /orders/:id/confirm — admin
router.post('/:id/confirm', rbac('admin'), asyncHandler(async (req, res) => ok(res, await service.confirmOrder(req.params.id, req.user!.id))));

// POST /orders/:id/cancel — admin
router.post('/:id/cancel', rbac('admin'), asyncHandler(async (req, res) => ok(res, await service.cancelOrder(req.params.id))));

// PUT /orders/:id/status — admin (proses/dikirim/selesai)
router.put(
  '/:id/status',
  rbac('admin'),
  asyncHandler(async (req, res) => {
    const { status } = z.object({ status: z.enum(['proses', 'dikirim', 'selesai']) }).parse(req.body);
    const r = await query(`UPDATE orders SET status=$1, updated_at=now() WHERE id=$2 RETURNING *`, [status, req.params.id]);
    ok(res, r.rows[0]);
  })
);

// DELETE /orders/:id — hapus order beserta item & invoice terkait (super_admin)
router.delete(
  '/:id',
  rbac('super_admin'),
  asyncHandler(async (req, res) => {
    // order_items & invoices ON DELETE CASCADE → ikut terhapus
    const r = await query('DELETE FROM orders WHERE id=$1 RETURNING id', [req.params.id]);
    if (!r.rowCount) throw errors.notFound('Order tidak ditemukan');
    ok(res, { message: 'Order dihapus' });
  })
);

export default router;
