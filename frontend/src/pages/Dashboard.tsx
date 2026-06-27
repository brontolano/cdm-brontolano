import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { api } from '../api/client';
import { Spinner, rupiah, Badge } from '../components/ui';

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [omset, setOmset] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/summary'),
      api.get('/dashboard/omset?period=harian'),
      api.get('/dashboard/report'),
    ]).then(([s, o, r]) => {
      setSummary(s.data.data);
      setOmset(o.data.data);
      setReport(r.data.data);
    });
  }, []);

  if (!summary) return <Spinner />;

  const cards = [
    { label: 'Konsumen Aktif', value: summary.total_konsumen },
    { label: 'Total Order', value: summary.total_orders },
    { label: 'Omset Bulan Ini', value: rupiah(summary.omset_bulan_ini) },
    { label: 'Piutang', value: rupiah(summary.total_piutang) },
    { label: 'Stok Rendah', value: summary.barang_stok_rendah },
  ];

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="grid stat-grid" style={{ marginBottom: 20 }}>
        {cards.map((c) => (
          <div key={c.label} className="card stat">
            <div className="label">{c.label}</div>
            <div className="value">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <h3>Omset (Lunas) — Harian</h3>
          {omset.length === 0 ? (
            <p className="muted">Belum ada data omset.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={omset}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periode" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip formatter={(v: any) => rupiah(v)} />
                <Bar dataKey="omset" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h3>Order Terbaru</h3>
          <table>
            <thead>
              <tr><th>No. Order</th><th>Toko</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {report?.recent_orders?.map((o: any) => (
                <tr key={o.nomor_order}>
                  <td>{o.nomor_order}</td>
                  <td>{o.nama_toko}</td>
                  <td>{rupiah(o.total_harga)}</td>
                  <td><Badge value={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
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
  );
}
