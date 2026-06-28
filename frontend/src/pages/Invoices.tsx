import { useEffect, useState } from 'react';
import { Printer, ReceiptText } from 'lucide-react';
import { api, apiError } from '../api/client';
import { useAuth } from '../store/auth';
import { useToast } from '../store/toast';
import { Modal, Badge, Spinner, EmptyState, rupiah } from '../components/ui';
import { printThermalReceipt } from '../utils/receipt';

export default function Invoices() {
  const { user } = useAuth();
  const { notify } = useToast();
  const isAdmin = user?.role === 'admin';
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<any>(null);
  const [bayar, setBayar] = useState<number>(0);

  async function load() {
    setLoading(true);
    try { setList((await api.get('/invoices', { params: { limit: 100 } })).data.data); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function open(id: string) {
    const inv = (await api.get(`/invoices/${id}`)).data.data;
    setDetail(inv);
    setBayar(Number(inv.total) - Number(inv.jumlah_dibayar));
  }

  async function pay() {
    try {
      await api.post(`/invoices/${detail.id}/payment`, { jumlah: Number(bayar) });
      notify('success', 'Pembayaran dicatat');
      const inv = (await api.get(`/invoices/${detail.id}`)).data.data;
      setDetail(inv); load();
    } catch (err) { notify('error', apiError(err)); }
  }

  return (
    <div>
      <h2>Invoices</h2>
      <div className="card" style={{ padding: 0 }}>
        {loading ? <Spinner /> : list.length === 0 ? <EmptyState message="Belum ada invoice." /> : (
          <table>
            <thead><tr><th>No. Invoice</th><th>Order</th><th>Toko</th><th>Total</th><th>Dibayar</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {list.map((i) => (
                <tr key={i.id}>
                  <td>{i.nomor_invoice}</td><td>{i.nomor_order}</td><td>{i.nama_toko}</td>
                  <td>{rupiah(i.total)}</td><td>{rupiah(i.jumlah_dibayar)}</td>
                  <td><Badge value={i.status_pembayaran} /></td>
                  <td className="right"><button className="btn secondary small" onClick={() => open(i.id)}>Lihat</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {detail && (
        <Modal title={`Invoice ${detail.nomor_invoice}`} onClose={() => setDetail(null)}>
          <div id="invoice-print">
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <h2 style={{ margin: 0 }}>INVOICE</h2>
              <div className="muted">{detail.nomor_invoice} · {detail.nomor_order}</div>
            </div>
            <p><b>Kepada:</b> {detail.nama_toko} ({detail.nama_pemilik})<br />
              <span className="muted">{detail.alamat_lengkap} · {detail.kontak_wa}</span></p>
            <p>Tanggal: {new Date(detail.tanggal_invoice).toLocaleDateString('id-ID')} · Jatuh tempo: {detail.tanggal_jatuh_tempo ? new Date(detail.tanggal_jatuh_tempo).toLocaleDateString('id-ID') : '-'}</p>
            <table>
              <thead><tr><th>Barang</th><th>Qty</th><th>Harga</th><th>Subtotal</th></tr></thead>
              <tbody>
                {detail.items.map((it: any) => <tr key={it.id}><td>{it.nama_barang}</td><td>{it.jumlah} {it.unit}</td><td>{rupiah(it.harga_satuan)}</td><td>{rupiah(it.subtotal)}</td></tr>)}
              </tbody>
            </table>
            <p className="right" style={{ fontSize: 18 }}><b>Total: {rupiah(detail.total)}</b></p>
            <p className="right">Dibayar: {rupiah(detail.jumlah_dibayar)} · Status: <Badge value={detail.status_pembayaran} /></p>
          </div>

          <div className="no-print" style={{ marginTop: 12 }}>
            <button className="btn secondary" onClick={() => window.print()}><Printer size={15} aria-hidden /> Print A4</button>
            <button className="btn secondary" style={{ marginLeft: 8 }} onClick={() => printThermalReceipt({
              nomor: detail.nomor_invoice,
              tanggal: new Date(detail.tanggal_invoice).toLocaleDateString('id-ID'),
              kepada: detail.nama_toko,
              items: (detail.items || []).map((it: any) => ({ nama: it.nama_barang, jumlah: it.jumlah, harga: Number(it.harga_satuan), subtotal: Number(it.subtotal) })),
              total: Number(detail.total),
              dibayar: Number(detail.jumlah_dibayar),
              statusBayar: detail.status_pembayaran,
            })}><ReceiptText size={15} aria-hidden /> Struk Thermal</button>
            {isAdmin && detail.status_pembayaran !== 'lunas' && (
              <span style={{ marginLeft: 12, display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                <input type="number" value={bayar} onChange={(e) => setBayar(Number(e.target.value))} style={{ padding: 8, borderRadius: 8, border: '1px solid var(--border)', width: 140 }} />
                <button className="btn" onClick={pay}>Catat Pembayaran</button>
              </span>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
