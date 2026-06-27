import { Router } from 'express';
import { z } from 'zod';
import { query } from '../../db/pool';
import { asyncHandler, ok, created, errors } from '../../utils/http';
import { authenticate, rbac } from '../../middleware/auth';
import { optimizeRoute, RoutePoint } from '../../utils/routeOptimizer';

const router = Router();
router.use(authenticate);

// GET /pengiriman — list
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const r = await query('SELECT * FROM pengiriman ORDER BY created_at DESC LIMIT 100');
    ok(res, r.rows);
  })
);

// GET /pengiriman/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const r = await query('SELECT * FROM pengiriman WHERE id=$1', [req.params.id]);
    if (!r.rowCount) throw errors.notFound('Pengiriman tidak ditemukan');
    ok(res, r.rows[0]);
  })
);

// POST /pengiriman — create route from orders, optimized via nearest-neighbour TSP (admin)
router.post(
  '/',
  rbac('admin'),
  asyncHandler(async (req, res) => {
    const d = z
      .object({
        order_ids: z.array(z.string().uuid()).min(1),
        driver: z.string().optional(),
        start: z.object({ lat: z.number(), lng: z.number() }).optional(),
      })
      .parse(req.body);

    // Resolve konsumen GPS from the orders
    const rows = await query<RoutePoint>(
      `SELECT DISTINCT k.id AS konsumen_id, k.nama_toko, k.latitude, k.longitude
       FROM orders o JOIN konsumen k ON k.id=o.konsumen_id WHERE o.id = ANY($1::uuid[])`,
      [d.order_ids]
    );
    if (!rows.rowCount) throw errors.notFound('Order/konsumen tidak ditemukan');

    const { ordered, totalKm } = optimizeRoute(rows.rows, d.start);
    const r = await query(
      `INSERT INTO pengiriman (rute, order_ids, driver_assignment, status, total_jarak_km, estimated_completion)
       VALUES ($1,$2,$3,'planning',$4, now() + INTERVAL '4 hours') RETURNING *`,
      [JSON.stringify(ordered), JSON.stringify(d.order_ids), d.driver ?? null, totalKm]
    );
    // Move related orders to 'dikirim'
    await query(`UPDATE orders SET status='dikirim', updated_at=now() WHERE id = ANY($1::uuid[]) AND status='confirmed'`, [d.order_ids]);
    created(res, r.rows[0]);
  })
);

// PUT /pengiriman/:id/status — update status (admin & lapangan)
router.put(
  '/:id/status',
  rbac('admin', 'lapangan'),
  asyncHandler(async (req, res) => {
    const { status } = z.object({ status: z.enum(['planning', 'in_transit', 'completed', 'delayed']) }).parse(req.body);
    const completedAt = status === 'completed' ? 'now()' : 'NULL';
    const r = await query(
      `UPDATE pengiriman SET status=$1, actual_completion=${completedAt} WHERE id=$2 RETURNING *`,
      [status, req.params.id]
    );
    if (!r.rowCount) throw errors.notFound('Pengiriman tidak ditemukan');
    // On completion, mark related orders selesai
    if (status === 'completed') {
      const orderIds = r.rows[0].order_ids;
      if (Array.isArray(orderIds) && orderIds.length) {
        await query(`UPDATE orders SET status='selesai', updated_at=now() WHERE id = ANY($1::uuid[]) AND status='dikirim'`, [orderIds]);
      }
    }
    ok(res, r.rows[0]);
  })
);

export default router;
