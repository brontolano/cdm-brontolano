import { Router } from 'express';
import { z } from 'zod';
import { query } from '../../db/pool';
import { asyncHandler, ok, errors, parsePagination } from '../../utils/http';
import { authenticate, rbac } from '../../middleware/auth';
import { createOrder } from '../orders/orders.service';

const router = Router();
router.use(authenticate);

// GET /api/pesanan — daftar pesanan masuk
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { limit, offset, page } = parsePagination(req);
    const status = req.query.status as string | undefined;
    const params: any[] = [];
    let whereSql = '';
    if (status) { params.push(status); whereSql = 'WHERE status=$1'; }
    const total = await query<{ count: string }>(`SELECT COUNT(*) FROM pesanan_masuk ${whereSql}`, params);
    params.push(limit, offset);
    const r = await query(
      `SELECT * FROM pesanan_masuk ${whereSql} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    ok(res, r.rows, { page, limit, total: Number(total.rows[0].count) });
  })
);

// GET /api/pesanan/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const r = await query('SELECT * FROM pesanan_masuk WHERE id=$1', [req.params.id]);
    if (!r.rowCount) throw errors.notFound('Pesanan tidak ditemukan');
    ok(res, r.rows[0]);
  })
);

// PUT /api/pesanan/:id/status — admin
router.put(
  '/:id/status',
  rbac('admin'),
  asyncHandler(async (req, res) => {
    const { status } = z.object({ status: z.enum(['baru', 'diproses', 'selesai', 'batal']) }).parse(req.body);
    const r = await query('UPDATE pesanan_masuk SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id]);
    if (!r.rowCount) throw errors.notFound('Pesanan tidak ditemukan');
    ok(res, r.rows[0]);
  })
);

// POST /api/pesanan/:id/convert — jadikan Order resmi (admin)
router.post(
  '/:id/convert',
  rbac('admin'),
  asyncHandler(async (req, res) => {
    const p = await query('SELECT * FROM pesanan_masuk WHERE id=$1', [req.params.id]);
    if (!p.rowCount) throw errors.notFound('Pesanan tidak ditemukan');
    const pes = p.rows[0];
    if (pes.order_id) throw errors.conflict('Pesanan sudah dikonversi jadi Order');

    // Cari/ buat konsumen berdasar kontak_wa
    const wa = String(pes.kontak_wa).replace(/[\s\-().]/g, '');
    let kon = await query('SELECT id FROM konsumen WHERE kontak_wa=$1', [wa]);
    if (!kon.rowCount) {
      kon = await query(
        `INSERT INTO konsumen (nama_toko, nama_pemilik, kontak_wa, alamat_lengkap, status, created_by)
         VALUES ($1,$2,$3,$4,'aktif',$5) RETURNING id`,
        [pes.nama_pemesan, pes.nama_pemesan, wa, pes.alamat || 'Alamat dari katalog', req.user!.id]
      );
    }
    const konsumenId = kon.rows[0].id;
    const items = (pes.items as any[]).map((i) => ({ barang_id: i.barang_id, jumlah: i.jumlah }));
    const result = await createOrder({ konsumen_id: konsumenId, items, catatan: `Dari katalog: ${pes.catatan || '-'}`, created_by: req.user!.id });
    await query('UPDATE pesanan_masuk SET status=$1, order_id=$2 WHERE id=$3', ['diproses', result.order.id, pes.id]);
    ok(res, { pesanan_id: pes.id, order: result.order, invoice: result.invoice });
  })
);

// DELETE /api/pesanan/:id — hapus pesanan masuk dari katalog (super_admin)
router.delete(
  '/:id',
  rbac('super_admin'),
  asyncHandler(async (req, res) => {
    const r = await query('DELETE FROM pesanan_masuk WHERE id=$1 RETURNING id', [req.params.id]);
    if (!r.rowCount) throw errors.notFound('Pesanan tidak ditemukan');
    ok(res, { message: 'Pesanan dihapus' });
  })
);

export default router;
