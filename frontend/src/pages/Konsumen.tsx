import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api, apiError } from '../api/client';
import { useAuth } from '../store/auth';
import { useToast } from '../store/toast';
import { Modal, Badge, Spinner, EmptyState } from '../components/ui';
import { MapView } from '../components/MapView';
import { gmapsDir } from '../utils/maps';
import { fileToCompressedDataUrl } from '../utils/image';

interface Konsumen {
  id: string;
  nama_toko: string;
  nama_pemilik: string;
  kontak_wa: string;
  alamat_lengkap: string;
  latitude: number | null;
  longitude: number | null;
  kota: string | null;
  status: string;
}

const empty = { nama_toko: '', nama_pemilik: '', kontak_wa: '', alamat_lengkap: '', kota: '', latitude: null as number | null, longitude: null as number | null };

export default function KonsumenPage() {
  const { user } = useAuth();
  const { notify } = useToast();
  const canEdit = user?.role === 'lapangan' || user?.role === 'admin';
  const [list, setList] = useState<Konsumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await api.get('/konsumen', { params: { search, limit: 100 } });
      setList(r.data.data);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const t = setTimeout(load, 300); // debounce search
    return () => clearTimeout(t);
  }, [search]);

  function openCreate() {
    setForm(empty);
    setEditId(null);
    setShowForm(true);
  }
  function openEdit(k: Konsumen) {
    setForm({ ...k });
    setEditId(k.id);
    setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // Normalisasi nomor WA: buang spasi, strip, kurung, titik
      const kontak = String(form.kontak_wa || '').replace(/[\s\-().]/g, '');
      const payload = {
        ...form,
        kontak_wa: kontak,
        latitude: form.latitude != null && form.latitude !== '' ? Number(form.latitude) : null,
        longitude: form.longitude != null && form.longitude !== '' ? Number(form.longitude) : null,
      };
      if (editId) await api.put(`/konsumen/${editId}`, payload);
      else await api.post('/konsumen', payload);
      notify('success', editId ? 'Konsumen diperbarui' : 'Konsumen ditambahkan');
      setShowForm(false);
      load();
    } catch (err) {
      notify('error', apiError(err));
    } finally {
      setSaving(false);
    }
  }

  async function pickFoto(e: React.ChangeEvent<HTMLInputElement>, key: 'foto_toko' | 'foto_ktp') {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await fileToCompressedDataUrl(file, 800, 0.7);
      setForm((f: any) => ({ ...f, [key]: dataUrl }));
    } catch (err: any) {
      notify('error', err?.message || 'Gagal memproses foto');
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      notify('error', 'Browser tidak mendukung geolocation');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setForm((f: any) => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude })),
      () => notify('error', 'Gagal mengambil lokasi (izin ditolak / GPS mati)')
    );
  }

  async function remove(k: Konsumen) {
    if (!confirm(`Hapus ${k.nama_toko}?`)) return;
    try {
      await api.delete(`/konsumen/${k.id}`);
      notify('success', 'Konsumen dihapus');
      load();
    } catch (err) {
      notify('error', apiError(err));
    }
  }

  return (
    <div>
      <div className="toolbar">
        <h2>Data Konsumen</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <input placeholder="Cari toko / pemilik / WA…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: 9, borderRadius: 8, border: '1px solid var(--border)' }} />
          {canEdit && <button className="btn" onClick={openCreate}><Plus size={16} aria-hidden /> Konsumen</button>}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? <Spinner /> : list.length === 0 ? <EmptyState message="Belum ada konsumen." /> : (
          <table>
            <thead><tr><th>Toko</th><th>Pemilik</th><th>WA</th><th>Kota</th><th>GPS</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {list.map((k) => (
                <tr key={k.id}>
                  <td>{k.nama_toko}</td>
                  <td>{k.nama_pemilik}</td>
                  <td>{k.kontak_wa}</td>
                  <td>{k.kota || '-'}</td>
                  <td>
                    {k.latitude != null && k.longitude != null ? (
                      <a href={gmapsDir(k.latitude, k.longitude)} target="_blank" rel="noreferrer" title="Buka arah di Google Maps">📍 Arah</a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td><Badge value={k.status} /></td>
                  <td className="right">
                    {canEdit && <button className="btn secondary small" onClick={() => openEdit(k)}>Edit</button>}
                    {user?.role === 'admin' && <button className="btn danger small" style={{ marginLeft: 6 }} onClick={() => remove(k)}>Hapus</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <Modal title={editId ? 'Edit Konsumen' : 'Tambah Konsumen'} onClose={() => setShowForm(false)}>
          <form onSubmit={save}>
            <div className="field"><label>Nama Toko</label><input value={form.nama_toko} onChange={(e) => setForm({ ...form, nama_toko: e.target.value })} required /></div>
            <div className="field"><label>Nama Pemilik</label><input value={form.nama_pemilik} onChange={(e) => setForm({ ...form, nama_pemilik: e.target.value })} required /></div>
            <div className="row">
              <div className="field"><label>Kontak WA (+62…)</label><input value={form.kontak_wa} onChange={(e) => setForm({ ...form, kontak_wa: e.target.value })} placeholder="+6281…" required /></div>
              <div className="field"><label>Kota</label><input value={form.kota || ''} onChange={(e) => setForm({ ...form, kota: e.target.value })} /></div>
            </div>
            <div className="field"><label>Alamat Lengkap (min 5 karakter)</label><textarea value={form.alamat_lengkap} onChange={(e) => setForm({ ...form, alamat_lengkap: e.target.value })} required /></div>
            <div className="row">
              {(['foto_toko', 'foto_ktp'] as const).map((key) => {
                const labelText = key === 'foto_toko' ? 'Foto Toko' : 'Foto KTP';
                return (
                  <div className="field" key={key}>
                    <label>{labelText} (opsional)</label>
                    {form[key] ? (
                      <div style={{ position: 'relative', width: 110 }}>
                        <a href={form[key]} target="_blank" rel="noreferrer">
                          <img src={form[key]} alt={labelText} style={{ width: 110, height: 110, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} />
                        </a>
                        <button type="button" aria-label={`Hapus ${labelText}`} onClick={() => setForm((f: any) => ({ ...f, [key]: null }))}
                          style={{ position: 'absolute', top: -8, right: -8, width: 24, height: 24, borderRadius: '50%', border: 'none', background: 'var(--danger)', color: '#fff', cursor: 'pointer', lineHeight: 1 }}>×</button>
                      </div>
                    ) : (
                      <label className="btn secondary small" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                        📷 Pilih / Foto
                        <input type="file" accept="image/*" capture="environment" hidden onChange={(e) => pickFoto(e, key)} />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="field">
              <label>Lokasi GPS (opsional)</label>
              <div className="row" style={{ marginBottom: 8 }}>
                <input
                  type="number" step="any" placeholder="Latitude"
                  value={form.latitude ?? ''}
                  onChange={(e) => setForm({ ...form, latitude: e.target.value === '' ? null : Number(e.target.value) })}
                />
                <input
                  type="number" step="any" placeholder="Longitude"
                  value={form.longitude ?? ''}
                  onChange={(e) => setForm({ ...form, longitude: e.target.value === '' ? null : Number(e.target.value) })}
                />
                <button type="button" className="btn secondary small" onClick={useMyLocation}>📍 Lokasi saya</button>
              </div>
              <small className="muted">Ketik manual, klik <b>Lokasi saya</b>, atau klik langsung di peta:</small>
              {form.latitude != null && form.latitude !== '' && form.longitude != null && form.longitude !== '' && (
                <div style={{ margin: '4px 0' }}>
                  <a href={gmapsDir(form.latitude, form.longitude)} target="_blank" rel="noreferrer">📍 Buka arah di Google Maps</a>
                </div>
              )}
              <MapView
                onPick={(lat, lng) => setForm({ ...form, latitude: lat, longitude: lng })}
                markers={form.latitude != null && form.latitude !== '' ? [{ lat: Number(form.latitude), lng: Number(form.longitude), label: 'Lokasi konsumen' }] : []}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn secondary" onClick={() => setShowForm(false)}>Batal</button>
              <button className="btn" disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
