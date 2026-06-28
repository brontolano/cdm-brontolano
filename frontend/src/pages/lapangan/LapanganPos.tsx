import { useEffect, useState } from 'react';
import { ReceiptText } from 'lucide-react';
import { MobilePage } from './shell';
import { api, apiError } from '../../api/client';
import { useToast } from '../../store/toast';
import { rupiah } from '../../components/ui';
import { priceForQty, tierInfo } from '../../utils/pricing';
import { printThermalReceipt } from '../../utils/receipt';

export default function LapanganPos() {
  const { notify } = useToast();
  const [konsumen, setKonsumen] = useState<any[]>([]);
  const [barang, setBarang] = useState<any[]>([]);
  const [konsumenId, setKonsumenId] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null);

  useEffect(() => {
    api.get('/konsumen', { params: { limit: 100 } }).then((r) => setKonsumen(r.data.data));
    api.get('/inventory', { params: { limit: 100 } }).then((r) => setBarang(r.data.data));
  }, []);

  function setQty(id: string, qty: number) {
    setCart((c) => { const n = { ...c }; if (qty <= 0) delete n[id]; else n[id] = qty; return n; });
  }

  const items = Object.entries(cart).map(([id, qty]) => {
    const b = barang.find((x) => x.id === id)!;
    const harga = b ? priceForQty(b, qty) : 0;
    return { b, qty, harga, subtotal: harga * qty };
  }).filter((i) => i.b);
  const total = items.reduce((s, i) => s + i.subtotal, 0);

  async function submit() {
    if (!konsumenId) return notify('error', 'Pilih konsumen dulu');
    if (!items.length) return notify('error', 'Tambah minimal 1 barang');
    setSubmitting(true);
    try {
      const r = await api.post('/orders', { konsumen_id: konsumenId, items: items.map((i) => ({ barang_id: i.b.id, jumlah: i.qty })) });
      const data = r.data.data;
      const kons = konsumen.find((k) => k.id === konsumenId);
      setLastOrder({ ...data.order, nama_toko: kons?.nama_toko, items: data.items, invoice: data.invoice });
      notify('success', `Order ${data.order.nomor_order} dibuat`);
      setCart({}); setKonsumenId('');
    } catch (err) { notify('error', apiError(err)); }
    finally { setSubmitting(false); }
  }

  function cetak() {
    if (!lastOrder) return;
    printThermalReceipt({
      nomor: lastOrder.nomor_order, tanggal: new Date().toLocaleDateString('id-ID'), kepada: lastOrder.nama_toko,
      items: lastOrder.items.map((it: any) => ({ nama: barang.find((b) => b.id === it.barang_id)?.nama_barang || it.barang_id, jumlah: it.jumlah, harga: Number(it.harga_satuan), subtotal: Number(it.subtotal) })),
      total: Number(lastOrder.total_harga),
    });
  }

  return (
    <MobilePage title="POS / Order">
      {lastOrder && (
        <div className="card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: 12 }}>
          <strong>✅ {lastOrder.nomor_order}</strong> — {rupiah(lastOrder.total_harga)}<br />
          <span className="muted">Invoice {lastOrder.invoice?.nomor_invoice}</span>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn" style={{ flex: 1 }} onClick={cetak}><ReceiptText size={16} aria-hidden /> Cetak Struk</button>
            <button className="btn secondary" onClick={() => setLastOrder(null)}>Order Baru</button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="field">
          <label>Konsumen</label>
          <select value={konsumenId} onChange={(e) => setKonsumenId(e.target.value)}>
            <option value="">— pilih konsumen —</option>
            {konsumen.map((k) => <option key={k.id} value={k.id}>{k.nama_toko}</option>)}
          </select>
        </div>
        <label style={{ fontSize: 13, fontWeight: 600 }}>Barang</label>
        <div style={{ maxHeight: 320, overflowY: 'auto', marginTop: 6 }}>
          {barang.map((b) => {
            const qty = cart[b.id] || 0;
            const harga = priceForQty(b, Math.max(qty, 1));
            return (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{b.nama_barang}</div>
                  <div style={{ fontSize: 12, color: '#16a34a' }}>{rupiah(harga)} {qty > 0 ? `· Tier ${tierInfo(qty).key}` : ''} · stok {b.stok_saat_ini}</div>
                </div>
                {qty === 0 ? (
                  <button className="btn secondary small" onClick={() => setQty(b.id, 1)}>+</button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button className="btn secondary small" onClick={() => setQty(b.id, qty - 1)}>−</button>
                    <input value={qty} onChange={(e) => setQty(b.id, parseInt(e.target.value) || 0)} inputMode="numeric" style={{ width: 44, textAlign: 'center', padding: 6, borderRadius: 6, border: '1px solid var(--border)' }} />
                    <button className="btn secondary small" onClick={() => setQty(b.id, qty + 1)}>+</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ position: 'sticky', bottom: 0, marginTop: 12 }}>
        <button className="btn" style={{ width: '100%', padding: 16, fontSize: 16 }} onClick={submit} disabled={submitting || !items.length}>
          {submitting ? 'Memproses…' : `Buat Order · ${rupiah(total)}`}
        </button>
      </div>
    </MobilePage>
  );
}
