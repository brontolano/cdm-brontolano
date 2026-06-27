import { query, withTransaction } from '../../db/pool';
import { errors } from '../../utils/http';
import { nextDocNumber } from '../../utils/sequence';

export interface OrderItemInput {
  barang_id: string;
  jumlah: number;
}

/** Create order + order_items + auto-generated invoice, all in one transaction. */
export async function createOrder(input: {
  konsumen_id: string;
  items: OrderItemInput[];
  catatan?: string;
  created_by: string;
}) {
  if (!input.items.length) throw errors.badRequest('Order harus punya minimal 1 barang');

  return withTransaction(async (client) => {
    const kon = await client.query('SELECT id FROM konsumen WHERE id=$1', [input.konsumen_id]);
    if (!kon.rowCount) throw errors.notFound('Konsumen tidak ditemukan');

    // Fetch barang, validate stock, compute totals
    let total = 0;
    const lineItems: { barang_id: string; jumlah: number; harga_satuan: number; subtotal: number }[] = [];
    for (const item of input.items) {
      const b = await client.query('SELECT id, nama_barang, harga_jual, stok_saat_ini FROM barang WHERE id=$1', [item.barang_id]);
      if (!b.rowCount) throw errors.notFound(`Barang ${item.barang_id} tidak ditemukan`);
      const barang = b.rows[0];
      if (item.jumlah > barang.stok_saat_ini) {
        throw errors.unprocessable(`Stok tidak cukup untuk ${barang.nama_barang} (tersedia ${barang.stok_saat_ini})`);
      }
      const harga = Number(barang.harga_jual);
      const subtotal = harga * item.jumlah;
      total += subtotal;
      lineItems.push({ barang_id: barang.id, jumlah: item.jumlah, harga_satuan: harga, subtotal });
    }

    const nomorOrder = await nextDocNumber(client, 'orders', 'nomor_order', 'ORD');
    const orderRes = await client.query(
      `INSERT INTO orders (nomor_order, konsumen_id, total_harga, status, catatan, created_by)
       VALUES ($1,$2,$3,'draft',$4,$5) RETURNING *`,
      [nomorOrder, input.konsumen_id, total, input.catatan ?? null, input.created_by]
    );
    const order = orderRes.rows[0];

    for (const li of lineItems) {
      await client.query(
        `INSERT INTO order_items (order_id, barang_id, jumlah, harga_satuan, subtotal) VALUES ($1,$2,$3,$4,$5)`,
        [order.id, li.barang_id, li.jumlah, li.harga_satuan, li.subtotal]
      );
    }

    // Auto-generate invoice (due in 7 days)
    const nomorInvoice = await nextDocNumber(client, 'invoices', 'nomor_invoice', 'INV');
    const invRes = await client.query(
      `INSERT INTO invoices (nomor_invoice, order_id, total, status_pembayaran, tanggal_jatuh_tempo)
       VALUES ($1,$2,$3,'belum', CURRENT_DATE + INTERVAL '7 days') RETURNING *`,
      [nomorInvoice, order.id, total]
    );

    return { order, items: lineItems, invoice: invRes.rows[0] };
  });
}

/** Confirm order: status->confirmed, deduct stok, write stok_history. */
export async function confirmOrder(orderId: string, userId: string) {
  return withTransaction(async (client) => {
    const o = await client.query('SELECT * FROM orders WHERE id=$1 FOR UPDATE', [orderId]);
    if (!o.rowCount) throw errors.notFound('Order tidak ditemukan');
    const order = o.rows[0];
    if (order.status !== 'draft') throw errors.conflict(`Order tidak bisa dikonfirmasi (status: ${order.status})`);

    const items = await client.query('SELECT * FROM order_items WHERE order_id=$1', [orderId]);
    const lowStock: string[] = [];
    for (const it of items.rows) {
      const b = await client.query('SELECT nama_barang, stok_saat_ini, stok_minimum FROM barang WHERE id=$1 FOR UPDATE', [it.barang_id]);
      const barang = b.rows[0];
      if (it.jumlah > barang.stok_saat_ini) {
        throw errors.unprocessable(`Stok tidak cukup untuk ${barang.nama_barang}`);
      }
      await client.query('UPDATE barang SET stok_saat_ini = stok_saat_ini - $1, updated_at=now() WHERE id=$2', [it.jumlah, it.barang_id]);
      await client.query(
        `INSERT INTO stok_history (barang_id, tipe, jumlah, keterangan, created_by) VALUES ($1,'keluar',$2,$3,$4)`,
        [it.barang_id, it.jumlah, `Order ${order.nomor_order}`, userId]
      );
      if (barang.stok_saat_ini - it.jumlah < barang.stok_minimum) lowStock.push(barang.nama_barang);
    }

    const upd = await client.query(`UPDATE orders SET status='confirmed', updated_at=now() WHERE id=$1 RETURNING *`, [orderId]);
    return { order: upd.rows[0], low_stock_alert: lowStock };
  });
}

export async function cancelOrder(orderId: string) {
  const o = await query('SELECT status FROM orders WHERE id=$1', [orderId]);
  if (!o.rowCount) throw errors.notFound('Order tidak ditemukan');
  if (['selesai', 'dikirim'].includes(o.rows[0].status)) throw errors.conflict('Order yang sudah dikirim/selesai tidak bisa dibatalkan');
  const r = await query(`UPDATE orders SET status='dibatalkan', updated_at=now() WHERE id=$1 RETURNING *`, [orderId]);
  return r.rows[0];
}

export async function getOrderDetail(orderId: string) {
  const o = await query(
    `SELECT o.*, k.nama_toko, k.kontak_wa, k.alamat_lengkap FROM orders o
     JOIN konsumen k ON k.id = o.konsumen_id WHERE o.id=$1`,
    [orderId]
  );
  if (!o.rowCount) throw errors.notFound('Order tidak ditemukan');
  const items = await query(
    `SELECT oi.*, b.nama_barang, b.unit FROM order_items oi JOIN barang b ON b.id = oi.barang_id WHERE order_id=$1`,
    [orderId]
  );
  const invoice = await query('SELECT * FROM invoices WHERE order_id=$1', [orderId]);
  return { ...o.rows[0], items: items.rows, invoice: invoice.rows[0] ?? null };
}
