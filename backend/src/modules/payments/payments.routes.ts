import { Router } from 'express';
import { z } from 'zod';
import { query } from '../../db/pool';
import { asyncHandler, ok, errors } from '../../utils/http';
import { authenticate, rbac } from '../../middleware/auth';

const router = Router();

// GET /api/payments — semua metode (admin/management).
router.get('/', authenticate, rbac('admin', 'management'), asyncHandler(async (_req, res) => {
  const r = await query('SELECT kode, label, deskripsi, enabled, is_primary, butuh_gateway, urutan FROM payment_methods ORDER BY urutan');
  ok(res, r.rows);
}));

// PATCH /api/payments/:kode — toggle aktif/nonaktif (admin).
router.patch('/:kode', authenticate, rbac('admin'), asyncHandler(async (req, res) => {
  const { enabled } = z.object({ enabled: z.boolean() }).parse(req.body);
  const r = await query(
    'UPDATE payment_methods SET enabled=$1, updated_at=now() WHERE kode=$2 RETURNING kode, label, enabled, is_primary, butuh_gateway',
    [enabled, req.params.kode]
  );
  if (!r.rowCount) throw errors.notFound('Metode pembayaran tidak ditemukan');
  ok(res, r.rows[0]);
}));

export default router;
