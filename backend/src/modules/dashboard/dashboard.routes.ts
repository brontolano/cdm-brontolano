import { Router } from 'express';
import { query } from '../../db/pool';
import { asyncHandler, ok } from '../../utils/http';
import { authenticate } from '../../middleware/auth';

const router = Router();
router.use(authenticate);

// GET /dashboard/summary — top cards
router.get(
  '/summary',
  asyncHandler(async (_req, res) => {
    const [konsumen, orders, omsetBulan, lowStock, piutang] = await Promise.all([
      query<{ count: string }>(`SELECT COUNT(*) FROM konsumen WHERE status='aktif'`),
      query<{ count: string }>(`SELECT COUNT(*) FROM orders WHERE status NOT IN ('dibatalkan')`),
      query<{ sum: string }>(
        `SELECT COALESCE(SUM(total),0) AS sum FROM invoices WHERE status_pembayaran='lunas'
         AND date_trunc('month', tanggal_invoice) = date_trunc('month', CURRENT_DATE)`
      ),
      query<{ count: string }>(`SELECT COUNT(*) FROM barang WHERE stok_saat_ini < stok_minimum`),
      query<{ sum: string }>(`SELECT COALESCE(SUM(total - jumlah_dibayar),0) AS sum FROM invoices WHERE status_pembayaran != 'lunas'`),
    ]);
    ok(res, {
      total_konsumen: Number(konsumen.rows[0].count),
      total_orders: Number(orders.rows[0].count),
      omset_bulan_ini: Number(omsetBulan.rows[0].sum),
      barang_stok_rendah: Number(lowStock.rows[0].count),
      total_piutang: Number(piutang.rows[0].sum),
    });
  })
);

// GET /dashboard/omset — omset time series (by period: harian/mingguan/bulanan)
router.get(
  '/omset',
  asyncHandler(async (req, res) => {
    const period = (req.query.period as string) || 'harian';
    const trunc = period === 'bulanan' ? 'month' : period === 'mingguan' ? 'week' : 'day';
    const r = await query(
      `SELECT to_char(date_trunc($1, tanggal_invoice), 'YYYY-MM-DD') AS periode,
              SUM(total) AS omset
       FROM invoices WHERE status_pembayaran='lunas'
       GROUP BY 1 ORDER BY 1 DESC LIMIT 30`,
      [trunc]
    );
    ok(res, r.rows.reverse());
  })
);

// GET /dashboard/report — recent orders + top barang
router.get(
  '/report',
  asyncHandler(async (_req, res) => {
    const recentOrders = await query(
      `SELECT o.nomor_order, o.total_harga, o.status, o.tanggal_order, k.nama_toko
       FROM orders o JOIN konsumen k ON k.id=o.konsumen_id ORDER BY o.created_at DESC LIMIT 10`
    );
    const topBarang = await query(
      `SELECT b.nama_barang, SUM(oi.jumlah) AS total_terjual, SUM(oi.subtotal) AS total_omset
       FROM order_items oi JOIN barang b ON b.id=oi.barang_id
       JOIN orders o ON o.id=oi.order_id WHERE o.status NOT IN ('dibatalkan','draft')
       GROUP BY b.nama_barang ORDER BY total_terjual DESC LIMIT 5`
    );
    ok(res, { recent_orders: recentOrders.rows, top_barang: topBarang.rows });
  })
);

export default router;
