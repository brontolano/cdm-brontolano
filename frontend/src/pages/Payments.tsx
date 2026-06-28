import { useEffect, useState } from 'react';
import { HandCoins, QrCode, Building2, Landmark, CreditCard } from 'lucide-react';
import { api, apiError } from '../api/client';
import { useToast } from '../store/toast';
import { Spinner } from '../components/ui';

interface PayMethod { kode: string; label: string; deskripsi: string; enabled: boolean; is_primary: boolean; butuh_gateway: boolean; urutan: number; }
const ICON: Record<string, typeof HandCoins> = { cod: HandCoins, qris: QrCode, transfer: Building2, va: Landmark, card: CreditCard };

export default function Payments() {
  const { notify } = useToast();
  const [rows, setRows] = useState<PayMethod[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    try { setRows((await api.get('/payments')).data.data); }
    catch (e) { notify('error', apiError(e)); }
  }
  useEffect(() => { load(); }, []);

  async function toggle(m: PayMethod) {
    setBusy(m.kode);
    try {
      await api.patch(`/payments/${m.kode}`, { enabled: !m.enabled });
      setRows((rs) => rs!.map((r) => (r.kode === m.kode ? { ...r, enabled: !r.enabled } : r)));
      notify('success', `${m.label} ${!m.enabled ? 'diaktifkan' : 'dinonaktifkan'}`);
    } catch (e) { notify('error', apiError(e)); }
    finally { setBusy(null); }
  }

  if (!rows) return <Spinner />;

  return (
    <div className="view">
      <div className="view__head">
        <h2>Pembayaran</h2>
        <span className="view__sub">Aktif/nonaktifkan metode pembayaran yang tampil di katalog konsumen</span>
      </div>
      <div className="card" style={{ padding: 0 }}>
        {rows.map((m) => {
          const Icon = ICON[m.kode] || HandCoins;
          return (
            <div key={m.kode} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--surface-sunken)', color: 'var(--slate-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon size={20} aria-hidden /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {m.label}
                  {m.is_primary && <span className="badge aktif">Utama</span>}
                  {m.butuh_gateway && <span className="badge proses">Perlu gateway</span>}
                </div>
                <div className="muted" style={{ fontSize: 13 }}>{m.deskripsi}</div>
              </div>
              <button
                role="switch" aria-checked={m.enabled} aria-label={`Toggle ${m.label}`}
                disabled={busy === m.kode}
                onClick={() => toggle(m)}
                style={{ width: 46, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 3,
                  background: m.enabled ? 'var(--commerce)' : 'var(--slate-300)', transition: 'background .15s', flexShrink: 0,
                  display: 'flex', justifyContent: m.enabled ? 'flex-end' : 'flex-start' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', display: 'block' }} />
              </button>
            </div>
          );
        })}
      </div>
      <p className="muted" style={{ fontSize: 12.5, marginTop: 12 }}>
        Metode bertanda <b>Perlu gateway</b> (QRIS/VA) butuh konfigurasi gateway (Midtrans/Xendit) via variabel lingkungan server.
        Sebelum gateway aktif, pesanan non-tunai dikonfirmasi manual via WhatsApp.
      </p>
    </div>
  );
}
