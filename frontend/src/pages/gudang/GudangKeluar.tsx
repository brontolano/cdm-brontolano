import { useEffect, useState } from 'react';
import { MobilePage } from '../lapangan/shell';
import { api, apiError } from '../../api/client';
import { useToast } from '../../store/toast';

export default function GudangKeluar() {
  const { notify } = useToast();
  const [barang, setBarang] = useState<any[]>([]);
  const [barangId, setBarangId] = useState('');
  const [jumlah, setJumlah] = useState(0);
  const [keterangan, setKeterangan] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() { setBarang((await api.get('/inventory', { params: { limit: 200 } })).data.data); }
  useEffect(() => { load(); }, []);
  const sel = barang.find((b) => b.id === barangId);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!barangId || jumlah <= 0) return notify('error', 'Pilih barang & jumlah');
    if (!keterangan.trim()) return notify('error', 'Isi alasan keluar');
    setSaving(true);
    try {
      await api.post(`/inventory/${barangId}/keluar`, { jumlah: Number(jumlah), keterangan });
      notify('success', `Stok ${sel?.nama_barang} −${jumlah}`);
      setBarangId(''); setJumlah(0); setKeterangan(''); load();
    } catch (err) { notify('error', apiError(err)); }
    finally { setSaving(false); }
  }

  return (
    <MobilePage title="Barang Keluar" back="/gudang" color="#c2410c">
      <form onSubmit={submit} className="card">
        <div className="field">
          <label>Barang</label>
          <select value={barangId} onChange={(e) => setBarangId(e.target.value)} required>
            <option value="">— pilih barang —</option>
            {barang.map((b) => <option key={b.id} value={b.id}>{b.nama_barang} (stok {b.stok_saat_ini})</option>)}
          </select>
        </div>
        {sel && <p className="muted" style={{ marginTop: -4 }}>Stok sekarang: <b>{sel.stok_saat_ini}</b> {sel.unit}</p>}
        <div className="field"><label>Jumlah Keluar</label><input type="number" min={1} max={sel?.stok_saat_ini} value={jumlah} onChange={(e) => setJumlah(Number(e.target.value))} required /></div>
        <div className="field"><label>Alasan</label><input value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="mis. rusak / sampel / retur" required /></div>
        {sel && jumlah > 0 && <p className="muted" style={{ fontSize: 13 }}>Stok setelah keluar: <b>{sel.stok_saat_ini - jumlah}</b></p>}
        <button className="btn danger" style={{ width: '100%', padding: 14 }} disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan Barang Keluar'}</button>
      </form>
    </MobilePage>
  );
}
