import { useEffect, useState } from 'react';
import { api, apiError } from '../api/client';
import { useToast } from '../store/toast';
import { Spinner, EmptyState } from '../components/ui';

export default function Broadcasting() {
  const { notify } = useToast();
  const [konsumen, setKonsumen] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pesan, setPesan] = useState('');
  const [target, setTarget] = useState<string[]>([]);
  const [all, setAll] = useState(true);
  const [result, setResult] = useState<any[]>([]);

  async function loadAll() {
    setLoading(true);
    try {
      const [k, t, h] = await Promise.all([
        api.get('/konsumen', { params: { limit: 100 } }),
        api.get('/broadcast/templates'),
        api.get('/broadcast/history'),
      ]);
      setKonsumen(k.data.data); setTemplates(t.data.data); setHistory(h.data.data);
    } finally { setLoading(false); }
  }
  useEffect(() => { loadAll(); }, []);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload: any = { pesan };
      if (all) payload.all = true; else payload.konsumen_ids = target;
      const r = await api.post('/broadcast/send', payload);
      setResult(r.data.data.penerima);
      notify('success', `Broadcast disiapkan untuk ${r.data.data.total} konsumen`);
      api.get('/broadcast/history').then((h) => setHistory(h.data.data));
    } catch (err) { notify('error', apiError(err)); }
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <h2>Broadcast WhatsApp</h2>
      <p className="muted">Gratis tanpa Twilio — sistem menghasilkan link <code>wa.me</code> click-to-chat per konsumen. Klik link untuk membuka WhatsApp.</p>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <h3>Kirim Pesan</h3>
          <form onSubmit={send}>
            <div className="field">
              <label>Template</label>
              <select onChange={(e) => { const t = templates.find((x) => x.id === e.target.value); if (t) setPesan(t.pesan); }}>
                <option value="">— pilih template (opsional) —</option>
                {templates.map((t) => <option key={t.id} value={t.id}>{t.nama}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Pesan (gunakan {'{nama}'} untuk personalisasi)</label>
              <textarea value={pesan} onChange={(e) => setPesan(e.target.value)} rows={4} required />
            </div>
            <div className="field">
              <label><input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} /> Kirim ke semua konsumen aktif</label>
            </div>
            {!all && (
              <div style={{ maxHeight: 160, overflow: 'auto', border: '1px solid var(--border)', borderRadius: 8, padding: 8, marginBottom: 12 }}>
                {konsumen.map((k) => (
                  <label key={k.id} style={{ display: 'block' }}>
                    <input type="checkbox" checked={target.includes(k.id)} onChange={(e) => setTarget(e.target.checked ? [...target, k.id] : target.filter((x) => x !== k.id))} />
                    {' '}{k.nama_toko}
                  </label>
                ))}
              </div>
            )}
            <button className="btn">Siapkan Broadcast</button>
          </form>
        </div>

        <div className="card">
          <h3>Link Terkirim</h3>
          {result.length === 0 ? <EmptyState message="Belum ada. Kirim broadcast untuk membuat link." /> : (
            <ul style={{ paddingLeft: 18 }}>
              {result.map((r) => (
                <li key={r.konsumen_id} style={{ marginBottom: 6 }}>
                  {r.nama_toko} — <a href={r.link} target="_blank" rel="noreferrer">Buka WhatsApp ↗</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Riwayat Broadcast</h3>
        {history.length === 0 ? <EmptyState message="Belum ada riwayat." /> : (
          <table>
            <thead><tr><th>Tanggal</th><th>Pesan</th><th>Target</th><th>Oleh</th></tr></thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id}><td>{new Date(h.created_at).toLocaleString('id-ID')}</td><td>{h.pesan}</td><td>{h.total_target}</td><td>{h.oleh}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
