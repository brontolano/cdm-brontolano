import { useEffect, useState } from 'react';
import { Plus, ReceiptText, X } from 'lucide-react';
import { api, apiError } from '../api/client';
import { useAuth, isAdminLike, isSuperAdmin } from '../store/auth';
import { useToast } from '../store/toast';
import { Modal, Badge, Spinner, EmptyState, rupiah } from '../components/ui';
import { priceForQty, tierInfo } from '../utils/pricing';
import { printThermalReceipt } from '../utils/receipt';

export default function Orders() {
  const { user } = useAuth();
  const { notify } = useToast();
  const isAdmin = isAdminLike(user?.role);
  const isSuper = isSuperAdmin(user?.role);
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [konsumen, setKonsumen] = useState<any[]>([]);
  const [barang, setBarang] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  const [konsumenId, setKonsumenId] = useState('');
  const [catatan, setCatatan] = useState('');
  const [items, setItems] = useState<{ barang_id: string; jumlah: number }[]>([{ barang_id: '', jumlah: 1 }]);
  const [statusFilter, setStatusFilter] = useState('');

  const STATUSES = ['draft', 'confirmed', 'proses', 'dikirim', 'selesai', 'dibatalkan'];
  const countByStatus = (s: string) => list.filter((o) => o.status === s).length;
  const filtered = statusFilter ? list.filter((o) => o.status === statusFilter) : list;

  async function load() {
    setLoading(true);
    try { setList((await api.get('/orders', { params: { limit: 100 } })).data.data); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function openForm() {
    const [k, b] = await Promise.all([api.get('/konsumen', { params: { limit: 100 } }), api.get('/inventory', { params: { limit: 100 } })]);
    setKonsumen(k.data.data);
    setBarang(b.data.data);
    setKonsumenId(''); setCatatan(''); setItems([{ barang_id: '', jumlah: 1 }]);
    setShowForm(true);
  }

  const total = items.reduce((sum, it) => {
    const b = barang.find((x) => x.id === it.barang_id);
    return sum + (b ? priceForQty(b, it.jumlah) * it.jumlah : 0);
  }, 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = { konsumen_id: konsumenId, catatan, items: items.filter((i) => i.barang_id && i.jumlah > 0) };
      const r = await api.post('/orders', payload);
      notify('success', `Order ${r.data.data.order.nomor_order} dibuat — invoice ${r.data.data.invoice.nomor_invoice}`);
      setShowForm(false);
      load();
    } catch (err) { notify('error', apiError(err)); }
  }

  async function openDetail(id: string) { setDetail((await api.get(`/orders/${id}`)).data.data); }
  async function confirmOrder(id: string) {
    try {
      const r = await api.post(`/orders/${id}/confirm`);
      const low = r.data.data.low_stock_alert;
      notify('success', `Order dikonfirmasi, stok dikurangi.${low?.length ? ' ⚠️ Stok rendah: ' + low.join(', ') : ''}`);
      setDetail(null); load();
    } catch (err) { notify('error', apiError(err)); }
  }
  async function cancelOrder(id: string) {
    if (!confirm('Batalkan order ini?')) return;
    try { await api.post(`/orders/${id}/cancel`); notify('info', 'Order dibatalkan'); setDetail(null); load(); }
    catch (err) { notify('error', apiError(err)); }
  }
  async function deleteOrder(id: string) {
    if (!confirm('Hapus order ini permanen beserta item & invoice terkait? Tindakan tidak bisa dibatalkan.')) return;
    try { await api.delete(`/orders/${id}`); notify('success', 'Order dihapus'); setDetail(null); load(); }
    catch (err) { notify('error', apiError(err)); }
  }

  return (
    <div>
      <div className="toolbar">
        <h2>Orders</h2>
        {isAdmin && <button className="btn" onClick={openForm}><Plus size={16} aria-hidden /> Buat Order</button>}
      </div>

      {list.length > 0 && (
        <div className="chips-row" style={{ marginBottom: 16 }}>
          <button className={'chip' + (statusFilter === '' ? ' is-active' : '')} onClick={() => setStatusFilter('')}>Semua ({list.length})</button>
          {STATUSES.filter((s) => countByStatus(s) > 0).map((s) => (
            <button key={s} className={'chip' + (statusFilter === s ? ' is-active' : '')} onClick={() => setStatusFilter(statusFilter === s ? '' : s)}>{s} ({countByStatus(s)})</button>
          ))}
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        {loading ? <Spinner /> : list.length === 0 ? <EmptyState message="Belum ada order." /> : filtered.length === 0 ? <EmptyState message="Tidak ada order pada status ini." /> : (
          <table>
            <thead><tr><th>No. Order</th><th>Toko</th><th>Total</th><th>Status</th><th>Tanggal</th><th></th></tr></thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td>{o.nomor_order}</td><td>{o.nama_toko}</td><td>{rupiah(o.total_harga)}</td>
                  <td><Badge value={o.status} /></td>
                  <td>{new Date(o.tanggal_order).toLocaleDateString('id-ID')}</td>
                  <td className="right"><button className="btn secondary small" onClick={() => openDetail(o.id)}>Detail</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <Modal title="Buat Order Baru" onClose={() => setShowForm(false)}>
          <form onSubmit={submit}>
            <div className="field">
              <label>Konsumen</label>
              <select value={konsumenId} onChange={(e) => setKonsumenId(e.target.value)} required>
                <option value="">— pilih konsumen —</option>
                {konsumen.map((k) => <option key={k.id} value={k.id}>{k.nama_toko} ({k.nama_pemilik})</option>)}
              </select>
            </div>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Barang</label>
            {items.map((it, idx) => {
              const b = barang.find((x) => x.id === it.barang_id);
              const harga = b ? priceForQty(b, it.jumlah) : 0;
              return (
                <div key={idx} style={{ marginBottom: 8 }}>
                  <div className="row" style={{ alignItems: 'flex-end' }}>
                    <div className="field" style={{ marginBottom: 0, flex: 2 }}>
                      <select value={it.barang_id} onChange={(e) => setItems(items.map((x, i) => i === idx ? { ...x, barang_id: e.target.value } : x))} required>
                        <option value="">— barang —</option>
                        {barang.map((b2) => <option key={b2.id} value={b2.id}>{b2.nama_barang} (stok {b2.stok_saat_ini})</option>)}
                      </select>
                    </div>
                    <div className="field" style={{ marginBottom: 0 }}>
                      <input type="number" min={1} value={it.jumlah} onChange={(e) => setItems(items.map((x, i) => i === idx ? { ...x, jumlah: Number(e.target.value) } : x))} />
                    </div>
                    <button type="button" className="btn secondary small" onClick={() => setItems(items.filter((_, i) => i !== idx))} disabled={items.length === 1} aria-label="Hapus baris"><X size={14} aria-hidden /></button>
                  </div>
                  {b && it.jumlah > 0 && (
                    <div style={{ fontSize: 12, color: '#16a34a', marginTop: 3 }}>
                      Tier {tierInfo(it.jumlah).key}: {rupiah(harga)} × {it.jumlah} = <b>{rupiah(harga * it.jumlah)}</b>
                    </div>
                  )}
                </div>
              );
            })}
            <button type="button" className="btn secondary small" onClick={() => setItems([...items, { barang_id: '', jumlah: 1 }])}><Plus size={14} aria-hidden /> Tambah barang</button>
            <div className="field" style={{ marginTop: 12 }}><label>Catatan</label><input value={catatan} onChange={(e) => setCatatan(e.target.value)} /></div>
            <p className="right"><b>Total: {rupiah(total)}</b></p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn secondary" onClick={() => setShowForm(false)}>Batal</button>
              <button className="btn">Buat Order + Invoice</button>
            </div>
          </form>
        </Modal>
      )}

      {detail && (
        <Modal title={`Order ${detail.nomor_order}`} onClose={() => setDetail(null)}>
          <p><b>{detail.nama_toko}</b> · {detail.kontak_wa}<br /><span className="muted">{detail.alamat_lengkap}</span></p>
          <p>Status: <Badge value={detail.status} /> · Invoice: {detail.invoice?.nomor_invoice} (<Badge value={detail.invoice?.status_pembayaran || 'belum'} />)</p>
          <table>
            <thead><tr><th>Barang</th><th>Qty</th><th>Harga</th><th>Subtotal</th></tr></thead>
            <tbody>
              {detail.items.map((it: any) => <tr key={it.id}><td>{it.nama_barang}</td><td>{it.jumlah} {it.unit}</td><td>{rupiah(it.harga_satuan)}</td><td>{rupiah(it.subtotal)}</td></tr>)}
            </tbody>
          </table>
          <p className="right"><b>Total: {rupiah(detail.total_harga)}</b></p>
          <div style={{ marginBottom: 10 }}>
            <button className="btn secondary small" onClick={() => printThermalReceipt({
              nomor: detail.nomor_order,
              tanggal: new Date(detail.tanggal_order).toLocaleDateString('id-ID'),
              kepada: detail.nama_toko,
              catatan: detail.catatan,
              items: (detail.items || []).map((it: any) => ({ nama: it.nama_barang, jumlah: it.jumlah, harga: Number(it.harga_satuan), subtotal: Number(it.subtotal) })),
              total: Number(detail.total_harga),
            })}><ReceiptText size={15} aria-hidden /> Cetak Struk Thermal</button>
          </div>
          {isAdmin && detail.status === 'draft' && (
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn danger" onClick={() => cancelOrder(detail.id)}>Batalkan</button>
              <button className="btn" onClick={() => confirmOrder(detail.id)}>Konfirmasi (kurangi stok)</button>
            </div>
          )}
          {isSuper && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, borderTop: '1px solid #eee', paddingTop: 10 }}>
              <button className="btn danger" onClick={() => deleteOrder(detail.id)}>Hapus Order Permanen</button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
