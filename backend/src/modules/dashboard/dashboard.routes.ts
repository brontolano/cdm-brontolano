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
    const [konsumen, orders, omsetBulan, lowStock, piutang, labaBulan, pengeluaranBulan, omsetBulanLalu, labaBulanLalu] = await Promise.all([
      query<{ count: string }>(`SELECT COUNT(*) FROM konsumen WHERE status='aktif'`),
      query<{ count: string }>(`SELECT COUNT(*) FROM orders WHERE status NOT IN ('dibatalkan')`),
      query<{ sum: string }>(
        `SELECT COALESCE(SUM(total),0) AS sum FROM invoices WHERE status_pembayaran='lunas'
         AND date_trunc('month', tanggal_invoice) = date_trunc('month', CURRENT_DATE)`
      ),
      query<{ count: string }>(`SELECT COUNT(*) FROM barang WHERE stok_saat_ini < stok_minimum`),
      query<{ sum: string }>(`SELECT COALESCE(SUM(total - jumlah_dibayar),0) AS sum FROM invoices WHERE status_pembayaran != 'lunas'`),
      // Laba kotor bulan ini = subtotal - (hpp * jumlah) untuk order non-batal/non-draft
      query<{ sum: string }>(
        `SELECT COALESCE(SUM(oi.subtotal - b.hpp * oi.jumlah),0) AS sum
         FROM order_items oi JOIN barang b ON b.id=oi.barang_id JOIN orders o ON o.id=oi.order_id
         WHERE o.status NOT IN ('dibatalkan','draft')
         AND date_trunc('month', o.tanggal_order) = date_trunc('month', CURRENT_DATE)`
      ),
      // Total pengeluaran bulan ini (catatan biaya operasional)
      query<{ sum: string }>(
        `SELECT COALESCE(SUM(jumlah),0) AS sum FROM pengeluaran
         WHERE date_trunc('month', tanggal) = date_trunc('month', CURRENT_DATE)`
      ),
      // Bulan lalu — untuk delta naik/turun (MoM) pada StatCard
      query<{ sum: string }>(
        `SELECT COALESCE(SUM(total),0) AS sum FROM invoices WHERE status_pembayaran='lunas'
         AND date_trunc('month', tanggal_invoice) = date_trunc('month', CURRENT_DATE - INTERVAL '1 month')`
      ),
      query<{ sum: string }>(
        `SELECT COALESCE(SUM(oi.subtotal - b.hpp * oi.jumlah),0) AS sum
         FROM order_items oi JOIN barang b ON b.id=oi.barang_id JOIN orders o ON o.id=oi.order_id
         WHERE o.status NOT IN ('dibatalkan','draft')
         AND date_trunc('month', o.tanggal_order) = date_trunc('month', CURRENT_DATE - INTERVAL '1 month')`
      ),
    ]);
    const laba = Number(labaBulan.rows[0].sum);
    const pengeluaran = Number(pengeluaranBulan.rows[0].sum);
    const omset = Number(omsetBulan.rows[0].sum);
    const omsetLalu = Number(omsetBulanLalu.rows[0].sum);
    const labaLalu = Number(labaBulanLalu.rows[0].sum);
    // delta% MoM (null bila tak ada pembanding agar UI bisa menyembunyikan)
    const pct = (kini: number, lalu: number): number | null =>
      lalu > 0 ? Math.round(((kini - lalu) / lalu) * 100) : (kini > 0 ? 100 : null);
    ok(res, {
      total_konsumen: Number(konsumen.rows[0].count),
      total_orders: Number(orders.rows[0].count),
      omset_bulan_ini: omset,
      laba_bulan_ini: laba,
      pengeluaran_bulan_ini: pengeluaran,
      laba_bersih_bulan_ini: laba - pengeluaran,
      barang_stok_rendah: Number(lowStock.rows[0].count),
      total_piutang: Number(piutang.rows[0].sum),
      omset_delta_pct: pct(omset, omsetLalu),
      laba_delta_pct: pct(laba, labaLalu),
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

// GET /dashboard/omset-kategori — omset per kategori (order non-batal)
router.get(
  '/omset-kategori',
  asyncHandler(async (_req, res) => {
    const r = await query(
      `SELECT COALESCE(b.kategori,'(tanpa kategori)') AS kategori,
              SUM(oi.subtotal) AS omset, SUM(oi.jumlah) AS qty
       FROM order_items oi JOIN barang b ON b.id=oi.barang_id JOIN orders o ON o.id=oi.order_id
       WHERE o.status NOT IN ('dibatalkan','draft')
       GROUP BY 1 ORDER BY omset DESC`
    );
    ok(res, r.rows);
  })
);

// GET /dashboard/piutang — invoice belum lunas + aging (umur jatuh tempo)
router.get(
  '/piutang',
  asyncHandler(async (_req, res) => {
    const rows = await query(
      `SELECT i.nomor_invoice, k.nama_toko, i.total, i.jumlah_dibayar,
              (i.total - i.jumlah_dibayar) AS sisa, i.status_pembayaran,
              i.tanggal_jatuh_tempo,
              GREATEST(0, (CURRENT_DATE - i.tanggal_jatuh_tempo)) AS hari_telat
       FROM invoices i JOIN orders o ON o.id=i.order_id JOIN konsumen k ON k.id=o.konsumen_id
       WHERE i.status_pembayaran <> 'lunas'
       ORDER BY i.tanggal_jatuh_tempo NULLS LAST`
    );
    // Ringkasan aging
    const agg = await query<{ bucket: string; sum: string }>(
      `SELECT CASE
                WHEN tanggal_jatuh_tempo IS NULL OR CURRENT_DATE <= tanggal_jatuh_tempo THEN 'belum_jatuh_tempo'
                WHEN CURRENT_DATE - tanggal_jatuh_tempo <= 7 THEN '1-7_hari'
                WHEN CURRENT_DATE - tanggal_jatuh_tempo <= 30 THEN '8-30_hari'
                ELSE '>30_hari' END AS bucket,
              COALESCE(SUM(total - jumlah_dibayar),0) AS sum
       FROM invoices WHERE status_pembayaran <> 'lunas' GROUP BY 1`
    );
    const aging: Record<string, number> = {};
    agg.rows.forEach((a) => (aging[a.bucket] = Number(a.sum)));
    ok(res, { daftar: rows.rows, aging });
  })
);

export default router;
