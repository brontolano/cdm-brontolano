import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { priceForQty, hargaMulai } from '../utils/pricing';
import { rupiah } from '../components/ui';

const WA_NUMBER = import.meta.env.VITE_WA_ORDER_NUMBER || '6285200000000';

interface Produk {
  id: string;
  sku: string | null;
  nama_barang: string;
  kategori: string | null;
  gambar: string | null;
  ukuran: string | null;
  type_kemasan: string | null;
  stok_saat_ini: number;
  harga_het: string | null;
  harga_s1: string | null;
  harga_s2: string | null;
  harga_s3: string | null;
  harga_s4: string | null;
  harga_jual: string | null;
}

export default function Katalog() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [kategoriList, setKategoriList] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCart, setShowCart] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await api.get('/public/catalog/products', { params: { search, kategori } });
      setProduk(r.data.data);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [search, kategori]);
  useEffect(() => {
    api.get('/public/catalog/categories').then((r) => setKategoriList(r.data.data));
  }, []);

  function setQty(id: string, qty: number) {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const p = produk.find((x) => x.id === id);
          if (!p) return null;
          const harga = priceForQty(p, qty);
          return { p, qty, harga, subtotal: harga * qty };
        })
        .filter(Boolean) as { p: Produk; qty: number; harga: number; subtotal: number }[],
    [cart, produk]
  );
  const total = cartItems.reduce((s, i) => s + i.subtotal, 0);
  const totalQty = cartItems.reduce((s, i) => s + i.qty, 0);

  function orderViaWA() {
    if (!cartItems.length) return;
    let msg = '*Pesanan Grosir Brontolano*\n\n';
    cartItems.forEach((i, idx) => {
      msg += `${idx + 1}. ${i.p.nama_barang}${i.p.sku ? ` (${i.p.sku})` : ''}\n   ${i.qty} x ${rupiah(i.harga)} = ${rupiah(i.subtotal)}\n`;
    });
    msg += `\n*Total: ${rupiah(total)}*\n\nMohon konfirmasi ketersediaan & ongkir. Terima kasih.`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', paddingBottom: 80 }}>
      {/* Header */}
      <header style={{ background: '#000', color: '#fff', padding: '14px 16px', position: 'sticky', top: 0, zIndex: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="https://brontolano.com/logo.png" alt="Brontolano" style={{ height: 36 }} onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
          <strong style={{ fontSize: 18 }}>Katalog Grosir Brontolano</strong>
        </div>
        <button onClick={() => setShowCart(true)} style={{ position: 'relative', background: '#1f2937', color: '#fff', border: 'none', borderRadius: 999, padding: '10px 14px', cursor: 'pointer', fontWeight: 600 }}>
          🛒 {totalQty > 0 && <span style={{ marginLeft: 4 }}>{totalQty}</span>}
        </button>
      </header>

      {/* Controls */}
      <div style={{ maxWidth: 1100, margin: '16px auto', padding: '0 16px', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          placeholder="Cari nama produk / SKU…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: 12, borderRadius: 10, border: '1px solid #d1d5db' }}
        />
        <select value={kategori} onChange={(e) => setKategori(e.target.value)} style={{ padding: 12, borderRadius: 10, border: '1px solid #d1d5db', minWidth: 180 }}>
          <option value="">Semua Kategori</option>
          {kategoriList.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>Memuat produk…</p>
        ) : produk.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: 40 }}>Tidak ada produk ditemukan.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
            {produk.map((p) => {
              const qty = cart[p.id] || 0;
              return (
                <div key={p.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: 140, background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.gambar ? (
                      <img src={p.gambar} alt={p.nama_barang} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
                    ) : (
                      <span style={{ color: '#d1d5db', fontSize: 32 }}>📦</span>
                    )}
                  </div>
                  <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                    {p.kategori && <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>{p.kategori}</span>}
                    <strong style={{ fontSize: 14, lineHeight: 1.3 }}>{p.nama_barang}</strong>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{p.sku || ''}{p.ukuran ? ` · ${p.ukuran}` : ''}</span>
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{rupiah(hargaMulai(p))}</div>
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>harga grosir / qty</span>
                    </div>
                    {qty === 0 ? (
                      <button onClick={() => setQty(p.id, 1)} style={{ marginTop: 8, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 0', fontWeight: 600, cursor: 'pointer' }}>+ Keranjang</button>
                    ) : (
                      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                        <button onClick={() => setQty(p.id, qty - 1)} style={qtyBtn}>−</button>
                        <input value={qty} onChange={(e) => setQty(p.id, parseInt(e.target.value) || 0)} style={{ width: 50, textAlign: 'center', padding: 6, borderRadius: 6, border: '1px solid #d1d5db' }} />
                        <button onClick={() => setQty(p.id, qty + 1)} style={qtyBtn}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cart drawer */}
      {showCart && (
        <div onClick={() => setShowCart(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 420, background: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Keranjang ({totalQty})</strong>
              <button onClick={() => setShowCart(false)} style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
              {cartItems.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', marginTop: 40 }}>Keranjang kosong.</p>
              ) : (
                cartItems.map((i) => (
                  <div key={i.p.id} style={{ display: 'flex', gap: 10, paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{i.p.nama_barang}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{i.qty} × {rupiah(i.harga)}</div>
                    </div>
                    <div style={{ fontWeight: 700 }}>{rupiah(i.subtotal)}</div>
                  </div>
                ))
              )}
            </div>
            <div style={{ padding: 16, borderTop: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 18 }}>
                <span>Total</span><strong>{rupiah(total)}</strong>
              </div>
              <button onClick={orderViaWA} disabled={!cartItems.length} style={{ width: '100%', background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 0', fontWeight: 700, fontSize: 15, cursor: cartItems.length ? 'pointer' : 'not-allowed', opacity: cartItems.length ? 1 : 0.5 }}>
                Kirim Pesanan via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const qtyBtn: React.CSSProperties = { width: 32, height: 32, borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: 16, fontWeight: 700 };
