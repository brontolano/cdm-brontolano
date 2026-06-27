import { useEffect, useState } from 'react';
import { MobilePage } from './shell';
import { api, apiError } from '../../api/client';
import { useToast } from '../../store/toast';
import { rupiah, Badge } from '../../components/ui';
import { gmapsRoute } from '../../utils/maps';
import { printThermalReceipt } from '../../utils/receipt';

const STATUS = ['planning', 'in_transit', 'completed', 'delayed'];

export default function LapanganPengiriman() {
  const { notify } = useToast();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [orders, setOrders] = useState<Record<string, any>>({});

  async function load() {
    setLoading(true);
    try { setList((await api.get('/pengiriman')).data.data); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function toggle(p: any) {
    if (open === p.id) { setOpen(null); return; }
    setOpen(p.id);
    // muat detail order yang belum di-cache
    const ids: string[] = Array.isArray(p.order_ids) ? p.order_ids : [];
    for (const id of ids) {
      if (!orders[id]) {
        try { const d = (await api.get(`/orders/${id}`)).data.data; setOrders((o) => ({ ...o, [id]: d })); } catch {}
      }
    }
  }

  async function setStatus(p: any, status: string) {
    try { await api.put(`/pengiriman/${p.id}/status`, { status }); notify('success', `Status: ${status}`); load(); }
    catch (err) { notify('error', apiError(err)); }
  }

  function cetakStruk(o: any) {
    printThermalReceipt({
      nomor: o.nomor_order, tanggal: new Date(o.tanggal_order).toLocaleDateString('id-ID'), kepada: o.nama_toko,
      items: (o.items || []).map((it: any) => ({ nama: it.nama_barang, jumlah: it.jumlah, harga: Number(it.harga_satuan), subtotal: Number(it.subtotal) })),
      total: Number(o.total_harga),
    });
  }
  function cetakInvoice(o: any) {
    if (!o.invoice) { notify('error', 'Invoice belum ada'); return; }
    printThermalReceipt({
      nomor: o.invoice.nomor_invoice, tanggal: new Date(o.invoice.tanggal_invoice).toLocaleDateString('id-ID'), kepada: o.nama_toko,
      items: (o.items || []).map((it: any) => ({ nama: it.nama_barang, jumlah: it.jumlah, harga: Number(it.harga_satuan), subtotal: Number(it.subtotal) })),
      total: Number(o.invoice.total), dibayar: Number(o.invoice.jumlah_dibayar), statusBayar: o.invoice.status_pembayaran,
    });
  }

  return (
    <MobilePage title="Rute Kirim Orderan">
      {loading ? <p className="muted">Memuat…</p> : list.length === 0 ? <p style={{ color: '#64748b' }}>Belum ada tugas pengiriman.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map((p) => {
            const rute = p.rute || [];
            return (
              <div key={p.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{p.driver_assignment || 'Driver'}</strong>
                    <Badge value={p.status} />
                  </div>
                  <div style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>{rute.length} tujuan · {p.total_jarak_km} km · {new Date(p.tanggal_pengiriman).toLocaleDateString('id-ID')}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                    <a className="btn" style={{ background: '#16a34a', flex: 1, textAlign: 'center' }} href={gmapsRoute(rute)} target="_blank" rel="noreferrer">🧭 Buka Rute Maps</a>
                    <button className="btn secondary" onClick={() => toggle(p)}>{open === p.id ? 'Tutup' : 'Detail'}</button>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    {STATUS.filter((s) => s !== p.status).map((s) => (
                      <button key={s} className="btn secondary small" onClick={() => setStatus(p, s)}>{s}</button>
                    ))}
                  </div>
                </div>
                {open === p.id && (
                  <div style={{ borderTop: '1px solid #f1f5f9', padding: 14, background: '#f8fafc' }}>
                    <ol style={{ paddingLeft: 18, margin: '0 0 10px' }}>
                      {rute.map((r: any) => <li key={r.konsumen_id} style={{ marginBottom: 2 }}>{r.nama_toko}</li>)}
                    </ol>
                    {(p.order_ids || []).map((id: string) => {
                      const o = orders[id];
                      if (!o) return <div key={id} className="muted" style={{ fontSize: 13 }}>memuat order…</div>;
                      return (
                        <div key={id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 10, marginBottom: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>{o.nomor_order}</strong><span>{rupiah(o.total_harga)}</span>
                          </div>
                          <div style={{ fontSize: 12, color: '#64748b' }}>{o.nama_toko}</div>
                          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <button className="btn secondary small" style={{ flex: 1 }} onClick={() => cetakStruk(o)}>🧾 Struk</button>
                            <button className="btn secondary small" style={{ flex: 1 }} onClick={() => cetakInvoice(o)}>💵 Invoice</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </MobilePage>
  );
}
