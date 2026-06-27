import { useEffect, useState } from 'react';
import { api, apiError } from '../api/client';
import { useAuth } from '../store/auth';
import { useToast } from '../store/toast';
import { Modal, Badge, Spinner, EmptyState, rupiah } from '../components/ui';

export default function PesananMasuk() {
  const { user } = useAuth();
  const { notify } = useToast();
  const isAdmin = user?.role === 'admin';
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<any>(null);

  async function load() {
    setLoading(true);
    try { setList((await api.get('/pesanan', { params: { limit: 100 } })).data.data); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: string) {
    try { await api.put(`/pesanan/${id}/status`, { status }); notify('success', `Status: ${status}`); load(); }
    catch (err) { notify('error', apiError(err)); }
  }
  async function convert(id: string) {
    if (!confirm('Konversi pesanan ini menjadi Order resmi? Konsumen akan dibuat otomatis dari nomor WA bila belum ada.')) return;
    try {
      const r = await api.post(`/pesanan/${id}/convert`);
      notify('success', `Order ${r.data.data.order.nomor_order} dibuat dari pesanan`);
      setDetail(null); load();
    } catch (err) { notify('error', apiError(err)); }
  }

  return (
    <div>
      <h2>Pesanan Masuk (Katalog)</h2>
      <div className="card" style={{ padding: 0 }}>
        {loading ? <Spinner /> : list.length === 0 ? <EmptyState message="Belum ada pesanan dari katalog." /> : (
          <table>
            <thead><tr><th>Tanggal</th><th>Pemesan</th><th>WA</th><th>Total</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td>{new Date(p.created_at).toLocaleString('id-ID')}</td>
                  <td>{p.nama_pemesan}</td>
                  <td>{p.kontak_wa}</td>
                  <td>{rupiah(p.total)}</td>
                  <td><Badge value={p.status} /></td>
                  <td className="right"><button className="btn secondary small" onClick={() => setDetail(p)}>Detail</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {detail && (
        <Modal title={`Pesanan — ${detail.nama_pemesan}`} onClose={() => setDetail(null)}>
          <p>WA: <a href={`https://wa.me/${String(detail.kontak_wa).replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer">{detail.kontak_wa}</a><br />
            {detail.alamat && <span className="muted">{detail.alamat}</span>}</p>
          <p>Status: <Badge value={detail.status} /> {detail.order_id && '· sudah jadi Order'}</p>
          <table>
            <thead><tr><th>Barang</th><th>Qty</th><th>Harga</th><th>Subtotal</th></tr></thead>
            <tbody>
              {(detail.items || []).map((it: any, i: number) => (
                <tr key={i}><td>{it.nama_barang}</td><td>{it.jumlah}</td><td>{rupiah(it.harga_satuan)}</td><td>{rupiah(it.subtotal)}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="right"><b>Total: {rupiah(detail.total)}</b></p>
          {isAdmin && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              {detail.status !== 'batal' && <button className="btn secondary" onClick={() => setStatus(detail.id, 'batal')}>Batalkan</button>}
              {detail.status !== 'selesai' && <button className="btn secondary" onClick={() => setStatus(detail.id, 'selesai')}>Tandai Selesai</button>}
              {!detail.order_id && <button className="btn" onClick={() => convert(detail.id)}>Jadikan Order</button>}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
