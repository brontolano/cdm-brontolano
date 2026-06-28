import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api, apiError } from '../api/client';
import { useAuth } from '../store/auth';
import { useToast } from '../store/toast';
import { Modal, Badge, Spinner, EmptyState } from '../components/ui';
import { MapView } from '../components/MapView';
import { gmapsRoute } from '../utils/maps';

export default function Pengiriman() {
  const { user } = useAuth();
  const { notify } = useToast();
  const isAdmin = user?.role === 'admin';
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [confirmedOrders, setConfirmedOrders] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [driver, setDriver] = useState('');
  const [detail, setDetail] = useState<any>(null);

  async function load() {
    setLoading(true);
    try { setList((await api.get('/pengiriman')).data.data); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function openForm() {
    const orders = (await api.get('/orders', { params: { status: 'confirmed', limit: 100 } })).data.data;
    setConfirmedOrders(orders);
    setSelected([]); setDriver('');
    setShowForm(true);
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    try {
      const r = await api.post('/pengiriman', { order_ids: selected, driver });
      notify('success', `Rute dibuat — jarak ${r.data.data.total_jarak_km} km`);
      setShowForm(false); load();
    } catch (err) { notify('error', apiError(err)); }
  }

  async function updateStatus(id: string, status: string) {
    try { await api.put(`/pengiriman/${id}/status`, { status }); notify('success', `Status: ${status}`); load(); }
    catch (err) { notify('error', apiError(err)); }
  }

  return (
    <div>
      <div className="toolbar">
        <h2>Pengiriman &amp; Rute</h2>
        {isAdmin && <button className="btn" onClick={openForm}><Plus size={16} aria-hidden /> Buat Rute</button>}
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? <Spinner /> : list.length === 0 ? <EmptyState message="Belum ada pengiriman." /> : (
          <table>
            <thead><tr><th>Driver</th><th>Stops</th><th>Jarak</th><th>Status</th><th>Tanggal</th><th></th></tr></thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td>{p.driver_assignment || '-'}</td>
                  <td>{Array.isArray(p.rute) ? p.rute.length : 0}</td>
                  <td>{p.total_jarak_km} km</td>
                  <td><Badge value={p.status} /></td>
                  <td>{new Date(p.tanggal_pengiriman).toLocaleDateString('id-ID')}</td>
                  <td className="right">
                    <button className="btn secondary small" onClick={() => setDetail(p)}>Peta</button>
                    {(isAdmin || user?.role === 'lapangan') && p.status !== 'completed' && (
                      <select className="btn secondary small" style={{ marginLeft: 6 }} value={p.status} onChange={(e) => updateStatus(p.id, e.target.value)}>
                        <option value="planning">planning</option>
                        <option value="in_transit">in_transit</option>
                        <option value="completed">completed</option>
                        <option value="delayed">delayed</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <Modal title="Buat Rute Pengiriman" onClose={() => setShowForm(false)}>
          <form onSubmit={create}>
            <div className="field"><label>Driver</label><input value={driver} onChange={(e) => setDriver(e.target.value)} placeholder="Nama driver" /></div>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Pilih Order (status: confirmed)</label>
            {confirmedOrders.length === 0 ? <p className="muted">Tidak ada order confirmed. Konfirmasi order dulu di menu Orders.</p> : (
              <div style={{ maxHeight: 200, overflow: 'auto', border: '1px solid var(--border)', borderRadius: 8, padding: 8, margin: '8px 0' }}>
                {confirmedOrders.map((o) => (
                  <label key={o.id} style={{ display: 'block', padding: '4px 0' }}>
                    <input type="checkbox" checked={selected.includes(o.id)} onChange={(e) => setSelected(e.target.checked ? [...selected, o.id] : selected.filter((x) => x !== o.id))} />
                    {' '}{o.nomor_order} — {o.nama_toko}
                  </label>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn secondary" onClick={() => setShowForm(false)}>Batal</button>
              <button className="btn" disabled={selected.length === 0}>Optimalkan Rute</button>
            </div>
          </form>
        </Modal>
      )}

      {detail && (
        <Modal title={`Rute — ${detail.driver_assignment || 'Driver'} (${detail.total_jarak_km} km)`} onClose={() => setDetail(null)}>
          <MapView
            showRoute
            markers={(detail.rute || []).map((r: any, i: number) => ({ lat: Number(r.latitude), lng: Number(r.longitude), label: r.nama_toko, order: i + 1 }))}
          />
          <div style={{ margin: '10px 0' }}>
            <a className="btn" href={gmapsRoute(detail.rute || [])} target="_blank" rel="noreferrer">🧭 Buka arah rute di Google Maps</a>
          </div>
          <ol>
            {(detail.rute || []).map((r: any) => <li key={r.konsumen_id}>{r.nama_toko}</li>)}
          </ol>
        </Modal>
      )}
    </div>
  );
}
