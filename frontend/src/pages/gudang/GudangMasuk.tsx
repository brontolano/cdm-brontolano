import { useEffect, useState } from 'react';
import { MobilePage } from '../lapangan/shell';
import { api, apiError } from '../../api/client';
import { useToast } from '../../store/toast';
import { rupiah } from '../../components/ui';
import { fileToCompressedDataUrl } from '../../utils/image';

export default function GudangMasuk() {
  const { notify } = useToast();
  const [barang, setBarang] = useState<any[]>([]);
  const [barangId, setBarangId] = useState('');
  const [jumlah, setJumlah] = useState(0);
  const [keterangan, setKeterangan] = useState('');
  const [hppBaru, setHppBaru] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() { setBarang((await api.get('/inventory', { params: { limit: 200 } })).data.data); }
  useEffect(() => { load(); }, []);

  const sel = barang.find((b) => b.id === barangId);

  async function pickFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file) return;
    try { setFoto(await fileToCompressedDataUrl(file, 800, 0.7)); }
    catch (err: any) { notify('error', err?.message || 'Gagal proses foto'); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!barangId || jumlah <= 0) return notify('error', 'Pilih barang & jumlah');
    setSaving(true);
    try {
      await api.post(`/inventory/${barangId}/masuk`, {
        jumlah: Number(jumlah), keterangan: keterangan || 'Restock',
        foto: foto || undefined, hpp_baru: hppBaru === '' ? undefined : Number(hppBaru),
      });
      notify('success', `Stok ${sel?.nama_barang} +${jumlah}`);
      setBarangId(''); setJumlah(0); setKeterangan(''); setHppBaru(''); setFoto(null);
      load();
    } catch (err) { notify('error', apiError(err)); }
    finally { setSaving(false); }
  }

  return (
    <MobilePage title="Barang Masuk" back="/gudang" color="#c2410c">
      <form onSubmit={submit} className="card">
        <div className="field">
          <label>Barang</label>
          <select value={barangId} onChange={(e) => { setBarangId(e.target.value); const b = barang.find((x) => x.id === e.target.value); setHppBaru(b ? String(Number(b.hpp)) : ''); }} required>
            <option value="">— pilih barang —</option>
            {barang.map((b) => <option key={b.id} value={b.id}>{b.nama_barang} (stok {b.stok_saat_ini})</option>)}
          </select>
        </div>
        {sel && <p className="muted" style={{ marginTop: -4 }}>Stok sekarang: <b>{sel.stok_saat_ini}</b> {sel.unit} · HPP: {rupiah(sel.hpp)}</p>}
        <div className="row">
          <div className="field"><label>Jumlah Masuk</label><input type="number" min={1} value={jumlah} onChange={(e) => setJumlah(Number(e.target.value))} required /></div>
          <div className="field"><label>HPP (update)</label><input type="number" min={0} value={hppBaru} onChange={(e) => setHppBaru(e.target.value)} placeholder="opsional" /></div>
        </div>
        <div className="field"><label>Keterangan</label><input value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="mis. nota #123 / supplier" /></div>
        <div className="field">
          <label>Foto Bukti Nota</label>
          {foto ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={foto} alt="nota" style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} />
              <button type="button" className="btn secondary small" onClick={() => setFoto(null)}>Hapus</button>
            </div>
          ) : (
            <label className="btn secondary" style={{ display: 'inline-block', cursor: 'pointer' }}>
              📷 Foto Nota
              <input type="file" accept="image/*" capture="environment" onChange={pickFoto} style={{ display: 'none' }} />
            </label>
          )}
        </div>
        <button className="btn" style={{ width: '100%', padding: 14, background: '#c2410c' }} disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan Barang Masuk'}</button>
      </form>
    </MobilePage>
  );
}
