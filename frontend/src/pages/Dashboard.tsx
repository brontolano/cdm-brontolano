import { useEffect, useState } from 'react';
import { Upload, Store, ReceiptText, TrendingUp, HandCoins, Hourglass, Package, Coins, Wallet, type LucideIcon } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { api } from '../api/client';
import { Spinner, rupiah, Badge } from '../components/ui';
import { StatCard } from '../components/ds';

const PERIODS = [
  { key: 'harian', label: 'Harian' },
  { key: 'mingguan', label: 'Mingguan' },
  { key: 'bulanan', label: 'Bulanan' },
];
const AGING_LABEL: Record<string, string> = {
  belum_jatuh_tempo: 'Belum jatuh tempo',
  '1-7_hari': 'Telat 1–7 hari',
  '8-30_hari': 'Telat 8–30 hari',
  '>30_hari': 'Telat >30 hari',
};

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [omset, setOmset] = useState<any[]>([]);
  const [period, setPeriod] = useState('harian');
  const [report, setReport] = useState<any>(null);
  const [kategori, setKategori] = useState<any[]>([]);
  const [piutang, setPiutang] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/summary'),
      api.get('/dashboard/report'),
      api.get('/dashboard/omset-kategori'),
      api.get('/dashboard/piutang'),
    ]).then(([s, r, k, p]) => {
      setSummary(s.data.data); setReport(r.data.data); setKategori(k.data.data); setPiutang(p.data.data);
    });
  }, []);
  useEffect(() => {
    api.get(`/dashboard/omset?period=${period}`).then((o) => setOmset(o.data.data));
  }, [period]);

  function exportOmsetCsv() {
    const rows = [['Periode', 'Omset'], ...omset.map((o) => [o.periode, o.omset])];
    const csv = '﻿' + rows.map((r) => r.join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = `omset-${period}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  if (!summary) return <Spinner />;

  const deltaProps = (pct: number | null | undefined) =>
    pct == null ? {} : { delta: `${Math.abs(pct)}%`, deltaDir: (pct >= 0 ? 'up' : 'down') as 'up' | 'down' };
  const cards: { label: string; value: any; icon: LucideIcon; accent?: boolean; delta?: string; deltaDir?: 'up' | 'down' }[] = [
    { label: 'Konsumen Aktif', value: summary.total_konsumen, icon: Store },
    { label: 'Total Order', value: summary.total_orders, icon: ReceiptText },
    { label: 'Omset Bulan Ini', value: rupiah(summary.omset_bulan_ini), icon: TrendingUp, accent: true, ...deltaProps(summary.omset_delta_pct) },
    { label: 'Laba Kotor Bln Ini', value: rupiah(summary.laba_bulan_ini || 0), icon: HandCoins, ...deltaProps(summary.laba_delta_pct) },
    { label: 'Pengeluaran Bln Ini', value: <span style={{ color: 'var(--danger)' }}>{rupiah(summary.pengeluaran_bulan_ini || 0)}</span>, icon: Coins },
    { label: 'Laba Bersih Bln Ini', value: <span style={{ color: (summary.laba_bersih_bulan_ini || 0) >= 0 ? 'var(--green-600)' : 'var(--danger)' }}>{rupiah(summary.laba_bersih_bulan_ini || 0)}</span>, icon: Wallet, accent: true },
    { label: 'Piutang', value: rupiah(summary.total_piutang), icon: Hourglass },
    { label: 'Stok Rendah', value: summary.barang_stok_rendah, icon: Package },
  ];

  return (
    <div className="view">
      <div className="view__head">
        <h2>Dashboard</h2>
        <span className="view__sub">Ringkasan operasional toko Anda</span>
      </div>
      <div className="statgrid">
        {cards.map((c) => {
          const Icon = c.icon;
          return <StatCard key={c.label} label={c.label} value={c.value} accent={c.accent} delta={c.delta} deltaDir={c.deltaDir} icon={<Icon size={18} />} />;
        })}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <div className="toolbar" style={{ marginBottom: 8 }}>
            <h3 style={{ margin: 0 }}>Omset (Lunas)</h3>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} style={{ padding: 6, borderRadius: 8, border: '1px solid var(--border)' }}>
                {PERIODS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
              <button className="btn secondary small" onClick={exportOmsetCsv} disabled={!omset.length}><Upload size={14} aria-hidden /> CSV</button>
            </div>
          </div>
          {omset.length === 0 ? <p className="muted">Belum ada data omset.</p> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={omset}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periode" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip formatter={(v: any) => rupiah(v)} />
                <Bar dataKey="omset" fill="#ed1c24" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h3>Omset per Kategori</h3>
          {kategori.length === 0 ? <p className="muted">Belum ada penjualan.</p> : (
            <table>
              <thead><tr><th>Kategori</th><th>Qty</th><th>Omset</th></tr></thead>
              <tbody>
                {kategori.map((k: any) => (
                  <tr key={k.kategori}><td>{k.kategori}</td><td>{k.qty}</td><td>{rupiah(k.omset)}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 16 }}>
        <div className="card">
          <h3>Order Terbaru</h3>
          <table>
            <thead><tr><th>No. Order</th><th>Toko</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {report?.recent_orders?.map((o: any) => (
                <tr key={o.nomor_order}><td>{o.nomor_order}</td><td>{o.nama_toko}</td><td>{rupiah(o.total_harga)}</td><td><Badge value={o.status} /></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3>Barang Terlaris</h3>
          <table>
            <thead><tr><th>Barang</th><th>Terjual</th><th>Omset</th></tr></thead>
            <tbody>
              {report?.top_barang?.length ? report.top_barang.map((b: any) => (
                <tr key={b.nama_barang}><td>{b.nama_barang}</td><td>{b.total_terjual}</td><td>{rupiah(b.total_omset)}</td></tr>
              )) : <tr><td colSpan={3} className="muted">Belum ada penjualan.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Piutang (Invoice belum lunas)</h3>
        {piutang && (
          <div className="grid stat-grid" style={{ marginBottom: 12 }}>
            {Object.entries(AGING_LABEL).map(([k, label]) => (
              <div key={k} className="card stat" style={{ padding: 10 }}>
                <div className="label" style={{ fontSize: 12 }}>{label}</div>
                <div className="value" style={{ fontSize: 18 }}>{rupiah(piutang.aging?.[k] || 0)}</div>
              </div>
            ))}
          </div>
        )}
        {!piutang?.daftar?.length ? <p className="muted">Tidak ada piutang. 🎉</p> : (
          <table>
            <thead><tr><th>No. Invoice</th><th>Toko</th><th>Sisa</th><th>Jatuh Tempo</th><th>Telat</th><th>Status</th></tr></thead>
            <tbody>
              {piutang.daftar.map((i: any) => (
                <tr key={i.nomor_invoice} style={i.hari_telat > 0 ? { background: '#fef2f2' } : {}}>
                  <td>{i.nomor_invoice}</td><td>{i.nama_toko}</td><td>{rupiah(i.sisa)}</td>
                  <td>{i.tanggal_jatuh_tempo ? new Date(i.tanggal_jatuh_tempo).toLocaleDateString('id-ID') : '-'}</td>
                  <td>{i.hari_telat > 0 ? `${i.hari_telat} hari` : '-'}</td>
                  <td><Badge value={i.status_pembayaran} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
