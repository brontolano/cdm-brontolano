import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { api, apiError } from '../api/client';
import { useToast } from '../store/toast';
import { Modal, Spinner, EmptyState } from '../components/ui';
import { rupiah } from '../components/ds';

const KATEGORI = [
  { v: 'perawatan_kendaraan', l: 'Perawatan Kendaraan' },
  { v: 'bbm', l: 'BBM / Bahan Bakar' },
  { v: 'operasional', l: 'Operasional' },
  { v: 'upah_bongkar_muat', l: 'Upah Bongkar Muat' },
  { v: 'gaji', l: 'Gaji / Upah' },
  { v: 'sewa', l: 'Sewa' },
  { v: 'lain', l: 'Lain-lain' },
];
const labelKat = (v: string) => KATEGORI.find((k) => k.v === v)?.l || v;
const lastDay = (bulan: string) => { const [y, m] = bulan.split('-').map(Number); return `${bulan}-${String(new Date(y, m, 0).getDate()).padStart(2, '0')}`; };
const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = () => ({ tanggal: today(), kategori: 'operasional', deskripsi: '', jumlah: '', catatan: '' });

interface Row { id: string; tanggal: string; kategori: string; deskripsi: string; jumlah: string; catatan: string | null; }

export default function Pengeluaran() {
  const { notify } = useToast();
  const [bulan, setBulan] = useState(new Date().toISOString().slice(0, 7));
  const [kategori, setKategori] = useState('');
  const [data, setData] = useState<{ items: Row[]; total: number; count: number } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyForm());
  const [del, setDel] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);

  const params = useMemo(() => ({ from: `${bulan}-01`, to: lastDay(bulan), kategori: kategori || undefined }), [bulan, kategori]);

  async function load() {
    setData(null);
    try { setData((await api.get('/pengeluaran', { params })).data.data); }
    catch (e) { notify('error', apiError(e)); setData({ items: [], total: 0, count: 0 }); }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [bulan, kategori]);

  function openCreate() { setForm(emptyForm()); setEditId(null); setShowForm(true); }
  function openEdit(r: Row) { setForm({ tanggal: r.tanggal.slice(0, 10), kategori: r.kategori, deskripsi: r.deskripsi, jumlah: String(r.jumlah), catatan: r.catatan || '' }); setEditId(r.id); setShowForm(true); }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const body = { tanggal: form.tanggal, kategori: form.kategori, deskripsi: form.deskripsi, jumlah: Number(form.jumlah) || 0, catatan: form.catatan || undefined };
    try {
      if (editId) await api.put(`/pengeluaran/${editId}`, body);
      else await api.post('/pengeluaran', body);
      notify('success', editId ? 'Pengeluaran diperbarui' : 'Pengeluaran dicatat');
      setShowForm(false); load();
    } catch (err) { notify('error', apiError(err)); }
    finally { setBusy(false); }
  }
  async function doDelete() {
    if (!del) return;
    setBusy(true);
    try { await api.delete(`/pengeluaran/${del.id}`); notify('success', 'Pengeluaran dihapus'); setDel(null); load(); }
    catch (err) { notify('error', apiError(err)); }
    finally { setBusy(false); }
  }

  return (
    <div className="view">
      <div className="view__head">
        <h2>Pengeluaran</h2>
        <span className="view__sub">Catat biaya operasional — BBM, perawatan kendaraan, upah bongkar muat, dll</span>
      </div>

      <div className="toolbar">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input type="month" value={bulan} onChange={(e) => setBulan(e.target.value)} style={{ padding: '8px 11px', borderRadius: 8, border: '1px solid var(--border)' }} />
          <select value={kategori} onChange={(e) => setKategori(e.target.value)} style={{ padding: '8px 11px', borderRadius: 8, border: '1px solid var(--border)' }}>
            <option value="">Semua kategori</option>
            {KATEGORI.map((k) => <option key={k.v} value={k.v}>{k.l}</option>)}
          </select>
        </div>
        <button className="btn" onClick={openCreate}><Plus size={16} aria-hidden /> Pengeluaran</button>
      </div>

      {data && (
        <div className="card stat is-accent" style={{ marginBottom: 16, maxWidth: 320 }}>
          <div className="label">Total Pengeluaran · {bulan}</div>
          <div className="value" style={{ color: 'var(--danger)' }}>{rupiah(data.total)}</div>
          <div className="muted" style={{ fontSize: 12 }}>{data.count} transaksi</div>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        {!data ? <Spinner /> : data.items.length === 0 ? <EmptyState message="Belum ada pengeluaran pada periode ini." /> : (
          <table>
            <thead><tr><th>Tanggal</th><th>Kategori</th><th>Deskripsi</th><th className="right">Jumlah</th><th></th></tr></thead>
            <tbody>
              {data.items.map((r) => (
                <tr key={r.id}>
                  <td className="nowrap">{new Date(r.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td><span className="badge proses">{labelKat(r.kategori)}</span></td>
                  <td>{r.deskripsi}{r.catatan && <span className="muted" style={{ display: 'block', fontSize: 12 }}>{r.catatan}</span>}</td>
                  <td className="right mono">{rupiah(r.jumlah)}</td>
                  <td className="right">
                    <button className="btn secondary small" onClick={() => openEdit(r)}>Edit</button>
                    <button className="btn danger small" style={{ marginLeft: 6 }} onClick={() => setDel(r)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <Modal title={editId ? 'Edit Pengeluaran' : 'Catat Pengeluaran'} onClose={() => setShowForm(false)}>
          <form onSubmit={save}>
            <div className="row">
              <div className="field"><label>Tanggal</label><input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} required /></div>
              <div className="field"><label>Kategori</label>
                <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}>
                  {KATEGORI.map((k) => <option key={k.v} value={k.v}>{k.l}</option>)}
                </select>
              </div>
            </div>
            <div className="field"><label>Deskripsi</label><input value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} placeholder="mis. Ganti oli truk, BBM ke Sumedang…" required /></div>
            <div className="field"><label>Jumlah (Rp)</label><input type="number" min={0} value={form.jumlah} onChange={(e) => setForm({ ...form, jumlah: e.target.value })} required /></div>
            <div className="field"><label>Catatan (opsional)</label><textarea value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} /></div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn secondary" onClick={() => setShowForm(false)}>Batal</button>
              <button className="btn" disabled={busy}>{busy ? 'Menyimpan…' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      )}

      {del && (
        <Modal title="Hapus Pengeluaran" onClose={() => setDel(null)}>
          <p>Hapus catatan <b>{del.deskripsi}</b> sebesar <b>{rupiah(del.jumlah)}</b>?</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn secondary" onClick={() => setDel(null)}>Batal</button>
            <button type="button" className="btn danger" disabled={busy} onClick={doDelete}>{busy ? 'Menghapus…' : 'Hapus'}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
