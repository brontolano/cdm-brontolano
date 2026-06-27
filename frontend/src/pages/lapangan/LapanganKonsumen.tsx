import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobilePage } from './shell';
import { api, apiError } from '../../api/client';
import { useToast } from '../../store/toast';
import { fileToCompressedDataUrl } from '../../utils/image';
import { MapView } from '../../components/MapView';

const empty = { nama_toko: '', nama_pemilik: '', kontak_wa: '', alamat_lengkap: '', kota: '', latitude: null as number | null, longitude: null as number | null, foto_toko: null as string | null, foto_ktp: null as string | null };

export default function LapanganKonsumen() {
  const { notify } = useToast();
  const nav = useNavigate();
  const [form, setForm] = useState<any>(empty);
  const [saving, setSaving] = useState(false);

  async function pickFoto(e: React.ChangeEvent<HTMLInputElement>, field: 'foto_toko' | 'foto_ktp', maxSize: number) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await fileToCompressedDataUrl(file, maxSize, 0.7);
      setForm((f: any) => ({ ...f, [field]: dataUrl }));
    } catch (err: any) { notify('error', err?.message || 'Gagal memproses foto'); }
  }

  function useMyLocation() {
    if (!navigator.geolocation) return notify('error', 'Geolocation tidak didukung');
    navigator.geolocation.getCurrentPosition(
      (pos) => setForm((f: any) => ({ ...f, latitude: pos.coords.latitude, longitude: pos.coords.longitude })),
      () => notify('error', 'Gagal ambil lokasi (izin/GPS)')
    );
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/konsumen', {
        ...form,
        latitude: form.latitude != null ? Number(form.latitude) : null,
        longitude: form.longitude != null ? Number(form.longitude) : null,
      });
      notify('success', 'Konsumen tersimpan');
      nav('/lapangan');
    } catch (err) { notify('error', apiError(err)); }
    finally { setSaving(false); }
  }

  const fotoBox = (label: string, field: 'foto_toko' | 'foto_ktp', maxSize: number) => (
    <div className="field">
      <label>{label}</label>
      {form[field] ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={form[field]} alt={label} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} />
          <button type="button" className="btn secondary small" onClick={() => setForm({ ...form, [field]: null })}>Hapus</button>
        </div>
      ) : (
        <label className="btn secondary" style={{ display: 'inline-block', cursor: 'pointer' }}>
          📷 Ambil Foto
          <input type="file" accept="image/*" capture="environment" onChange={(e) => pickFoto(e, field, maxSize)} style={{ display: 'none' }} />
        </label>
      )}
    </div>
  );

  return (
    <MobilePage title="Tambah Konsumen">
      <form onSubmit={save} className="card">
        <div className="field"><label>Nama Toko</label><input value={form.nama_toko} onChange={(e) => setForm({ ...form, nama_toko: e.target.value })} required /></div>
        <div className="field"><label>Nama Pemilik</label><input value={form.nama_pemilik} onChange={(e) => setForm({ ...form, nama_pemilik: e.target.value })} required /></div>
        <div className="field"><label>Kontak WA</label><input value={form.kontak_wa} onChange={(e) => setForm({ ...form, kontak_wa: e.target.value })} placeholder="08…" required /></div>
        <div className="field"><label>Kota</label><input value={form.kota} onChange={(e) => setForm({ ...form, kota: e.target.value })} /></div>
        <div className="field"><label>Alamat Lengkap</label><textarea value={form.alamat_lengkap} onChange={(e) => setForm({ ...form, alamat_lengkap: e.target.value })} required /></div>
        {fotoBox('Foto Toko', 'foto_toko', 600)}
        {fotoBox('Foto KTP', 'foto_ktp', 800)}
        <div className="field">
          <label>Lokasi GPS</label>
          <button type="button" className="btn secondary small" onClick={useMyLocation} style={{ marginBottom: 8 }}>📍 Gunakan lokasi saya</button>
          <MapView onPick={(lat, lng) => setForm({ ...form, latitude: lat, longitude: lng })} markers={form.latitude != null ? [{ lat: Number(form.latitude), lng: Number(form.longitude), label: 'Konsumen' }] : []} />
          <small className="muted">{form.latitude != null ? `${Number(form.latitude).toFixed(5)}, ${Number(form.longitude).toFixed(5)}` : 'Ketuk peta atau pakai lokasi saya'}</small>
        </div>
        <button className="btn" style={{ width: '100%', padding: 14 }} disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan Konsumen'}</button>
      </form>
    </MobilePage>
  );
}
