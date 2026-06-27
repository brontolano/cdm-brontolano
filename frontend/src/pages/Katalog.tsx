import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api/client';
import { priceForQty, tierInfo } from '../utils/pricing';
import { rupiah } from '../components/ui';

const WA_NUMBER = import.meta.env.VITE_WA_ORDER_NUMBER || '6285200000000';

interface Produk {
  id: string; sku: string | null; nama_barang: string; kategori: string | null; gambar: string | null;
  ukuran: string | null; type_kemasan: string | null; stok_saat_ini: number;
  isi_karton: number | null; isi_pcs: number | null;
  harga_het: string | null; harga_s1: string | null; harga_s2: string | null; harga_s3: string | null; harga_s4: string | null; harga_jual: string | null;
}

/** Jumlah pcs per karton (untuk hitung harga per pcs). */
function pcsPerKarton(p: Produk): number | null {
  const n = p.isi_pcs || p.isi_karton;
  return n && n > 0 ? n : null;
}
/** Harga per pcs dari harga karton. null jika isi tidak diketahui. */
function hargaPcs(p: Produk, hargaKarton: number): number | null {
  const per = pcsPerKarton(p);
  return per ? Math.round(hargaKarton / per) : null;
}

export default function Katalog() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [kategoriList, setKategoriList] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCart, setShowCart] = useState(false);
  const installEvt = useRef<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const h = (e: any) => { e.preventDefault(); installEvt.current = e; setCanInstall(true); };
    window.addEventListener('beforeinstallprompt', h);
    return () => window.removeEventListener('beforeinstallprompt', h);
  }, []);
  async function install() {
    if (!installEvt.current) return;
    installEvt.current.prompt();
    await installEvt.current.userChoice;
    installEvt.current = null; setCanInstall(false);
  }

  async function load() {
    setLoading(true);
    try { setProduk((await api.get('/public/catalog/products', { params: { search, kategori } })).data.data); }
    finally { setLoading(false); }
  }
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [search, kategori]);
  useEffect(() => { api.get('/public/catalog/categories').then((r) => setKategoriList(r.data.data)); }, []);

  function setQty(id: string, qty: number) {
    setCart((c) => { const n = { ...c }; if (qty <= 0) delete n[id]; else n[id] = qty; return n; });
  }

  const cartItems = useMemo(() =>
    Object.entries(cart).map(([id, qty]) => {
      const p = produk.find((x) => x.id === id); if (!p) return null;
      const harga = priceForQty(p, qty); return { p, qty, harga, subtotal: harga * qty };
    }).filter(Boolean) as { p: Produk; qty: number; harga: number; subtotal: number }[],
    [cart, produk]);
  const total = cartItems.reduce((s, i) => s + i.subtotal, 0);
  const totalQty = cartItems.reduce((s, i) => s + i.qty, 0);

  const [checkout, setCheckout] = useState(false);
  const [ck, setCk] = useState({ nama: '', kontak_wa: '', alamat: '' });
  const [sending, setSending] = useState(false);

  function waMessage() {
    let msg = '*Pesanan Grosir Brontolano*\n\n';
    if (ck.nama) msg += `Pemesan: ${ck.nama}\n`;
    if (ck.alamat) msg += `Alamat: ${ck.alamat}\n`;
    msg += '\n';
    cartItems.forEach((i, idx) => { msg += `${idx + 1}. ${i.p.nama_barang}${i.p.sku ? ` (${i.p.sku})` : ''}\n   ${i.qty} karton x ${rupiah(i.harga)} (Tier ${tierInfo(i.qty).key}) = ${rupiah(i.subtotal)}\n`; });
    msg += `\n*Total: ${rupiah(total)}*\n\nMohon konfirmasi ketersediaan & ongkir. Terima kasih.`;
    return msg;
  }

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!cartItems.length) return;
    setSending(true);
    try {
      // Simpan pesanan ke sistem (harga dihitung ulang di server)
      await api.post('/public/catalog/order', {
        nama: ck.nama, kontak_wa: ck.kontak_wa, alamat: ck.alamat || undefined,
        items: cartItems.map((i) => ({ barang_id: i.p.id, jumlah: i.qty })),
      }).catch(() => {}); // jangan blokir WA jika simpan gagal
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage())}`, '_blank');
      setCheckout(false); setShowCart(false); setCart({});
    } finally { setSending(false); }
  }

  return (
    <div style={S.page}>
      {/* Header */}
      <header style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <img src="https://brontolano.com/logo.png" alt="" style={{ height: 30 }} onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
          <strong style={{ fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Katalog Brontolano</strong>
        </div>
        {canInstall && <button onClick={install} style={S.installBtn}>⬇️ Install</button>}
      </header>

      {/* Banner penjelasan harga tier */}
      <div style={S.banner}>
        <div style={{ fontWeight: 800, marginBottom: 4 }}>💡 Harga Grosir Bertingkat — Makin Banyak, Makin Murah!</div>
        <div style={S.tierStrip}>
          {[['HET', '1–5'], ['S1', '6–9'], ['S2', '10–24'], ['S3', '25–150'], ['S4', '>150']].map(([k, r]) => (
            <span key={k} style={S.tierPill}><b>{k}</b> {r} krtn</span>
          ))}
        </div>
        <div style={{ fontSize: 11.5, opacity: 0.9, marginTop: 5 }}>Harga per karton otomatis turun saat jumlah di keranjang bertambah. Pesan via WhatsApp.</div>
      </div>

      {/* Search (sticky) */}
      <div style={S.searchWrap}>
        <input placeholder="🔍 Cari produk / SKU…" value={search} onChange={(e) => setSearch(e.target.value)} style={S.search} />
      </div>

      {/* Category chips */}
      <div style={S.chips}>
        <Chip active={kategori === ''} onClick={() => setKategori('')}>Semua</Chip>
        {kategoriList.map((k) => <Chip key={k} active={kategori === k} onClick={() => setKategori(k)}>{k}</Chip>)}
      </div>

      {/* Grid */}
      <div style={S.gridWrap}>
        {loading ? <p style={S.muted}>Memuat produk…</p>
          : produk.length === 0 ? <p style={S.muted}>Tidak ada produk ditemukan.</p>
          : (
            <div style={S.grid}>
              {produk.map((p) => {
                const qty = cart[p.id] || 0;
                const qd = Math.max(qty, 1);
                const hKarton = priceForQty(p, qd);
                const hPcs = hargaPcs(p, hKarton);
                const ti = tierInfo(qd);
                const hemat = qty > 0 && hKarton < priceForQty(p, 1); // tier diskon aktif
                return (
                  <div key={p.id} style={S.card}>
                    <div style={S.imgBox}>
                      {p.gambar
                        ? <img src={p.gambar} alt={p.nama_barang} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
                        : <span style={{ fontSize: 34, color: '#cbd5e1' }}>📦</span>}
                      {p.kategori && <span style={S.catTag}>{p.kategori}</span>}
                      {hemat && <span style={S.hematTag}>Tier {ti.key} 🔥</span>}
                    </div>
                    <div style={S.cardBody}>
                      <div style={S.name}>{p.nama_barang}</div>
                      <div style={S.sku}>{p.sku || ''}{p.ukuran ? ` · ${p.ukuran}` : ''}</div>
                      <div style={S.price}>{rupiah(hKarton)} <span style={S.unit}>/karton</span></div>
                      {hPcs != null && <div style={S.pcsPrice}>≈ {rupiah(hPcs)} <span style={S.unit}>/pcs</span>{pcsPerKarton(p) ? ` · isi ${pcsPerKarton(p)}` : ''}</div>}
                      {qty === 0
                        ? <button onClick={() => setQty(p.id, 1)} style={S.addBtn}>+ Keranjang</button>
                        : (
                          <div style={S.stepper}>
                            <button onClick={() => setQty(p.id, qty - 1)} style={S.stepBtn}>−</button>
                            <input value={qty} onChange={(e) => setQty(p.id, parseInt(e.target.value) || 0)} inputMode="numeric" style={S.stepInput} />
                            <button onClick={() => setQty(p.id, qty + 1)} style={S.stepBtn}>+</button>
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>

      {/* Bottom cart bar */}
      {totalQty > 0 && !showCart && (
        <button onClick={() => setShowCart(true)} style={S.bottomBar}>
          <span style={S.bottomBarBadge}>🛒 {totalQty} item</span>
          <span>{rupiah(total)}</span>
          <span style={{ fontWeight: 700 }}>Lihat Keranjang →</span>
        </button>
      )}

      {/* Cart bottom sheet */}
      {showCart && (
        <div style={S.sheetOverlay} onClick={() => setShowCart(false)}>
          <div style={S.sheet} onClick={(e) => e.stopPropagation()}>
            <div style={S.sheetHandle} />
            <div style={S.sheetHead}>
              <strong>Keranjang ({totalQty})</strong>
              <button onClick={() => setShowCart(false)} style={S.closeBtn}>✕</button>
            </div>
            <div style={S.sheetBody}>
              {cartItems.length === 0 ? <p style={S.muted}>Keranjang kosong.</p>
                : cartItems.map((i) => (
                  <div key={i.p.id} style={S.cartRow}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{i.p.nama_barang}</div>
                      <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>{rupiah(i.harga)} /karton · Tier {tierInfo(i.qty).key}</div>
                      {hargaPcs(i.p, i.harga) != null && <div style={{ fontSize: 11, color: '#94a3b8' }}>≈ {rupiah(hargaPcs(i.p, i.harga)!)} /pcs</div>}
                    </div>
                    <div style={S.stepperSm}>
                      <button onClick={() => setQty(i.p.id, i.qty - 1)} style={S.stepBtn}>−</button>
                      <span style={{ minWidth: 22, textAlign: 'center' }}>{i.qty}</span>
                      <button onClick={() => setQty(i.p.id, i.qty + 1)} style={S.stepBtn}>+</button>
                    </div>
                    <div style={{ fontWeight: 700, minWidth: 72, textAlign: 'right' }}>{rupiah(i.subtotal)}</div>
                  </div>
                ))}
            </div>
            <div style={S.sheetFoot}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 17 }}>
                <span>Total</span><strong>{rupiah(total)}</strong>
              </div>
              <button onClick={() => setCheckout(true)} disabled={!cartItems.length} style={S.waBtn}>
                Lanjut Pesan via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout: data pemesan sebelum kirim WA */}
      {checkout && (
        <div style={S.sheetOverlay} onClick={() => setCheckout(false)}>
          <form style={{ ...S.sheet, maxHeight: 'none' }} onClick={(e) => e.stopPropagation()} onSubmit={submitOrder}>
            <div style={S.sheetHandle} />
            <div style={S.sheetHead}><strong>Data Pemesan</strong><button type="button" onClick={() => setCheckout(false)} style={S.closeBtn}>✕</button></div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input placeholder="Nama *" value={ck.nama} onChange={(e) => setCk({ ...ck, nama: e.target.value })} required style={S.ckInput} />
              <input placeholder="Nomor WhatsApp *" value={ck.kontak_wa} onChange={(e) => setCk({ ...ck, kontak_wa: e.target.value })} required inputMode="tel" style={S.ckInput} />
              <textarea placeholder="Alamat (opsional)" value={ck.alamat} onChange={(e) => setCk({ ...ck, alamat: e.target.value })} style={{ ...S.ckInput, minHeight: 60 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16 }}><span>Total</span><strong>{rupiah(total)}</strong></div>
            </div>
            <div style={S.sheetFoot}>
              <button type="submit" disabled={sending} style={S.waBtn}>{sending ? 'Mengirim…' : 'Kirim Pesanan via WhatsApp'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} style={{ ...S.chip, ...(active ? S.chipActive : {}) }}>{children}</button>;
}

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f1f5f9', paddingBottom: 'calc(90px + env(safe-area-inset-bottom))' },
  header: { background: '#000', color: '#fff', padding: '12px 14px', position: 'sticky', top: 0, zIndex: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'calc(12px + env(safe-area-inset-top))' },
  installBtn: { background: '#16a34a', color: '#fff', border: 'none', borderRadius: 999, padding: '7px 12px', fontWeight: 700, fontSize: 13 },
  banner: { margin: '12px 14px 4px', background: 'linear-gradient(135deg,#15803d,#16a34a)', color: '#fff', borderRadius: 14, padding: '12px 14px' },
  tierStrip: { display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 },
  tierPill: { flex: '0 0 auto', background: 'rgba(255,255,255,.18)', borderRadius: 999, padding: '4px 10px', fontSize: 11.5, whiteSpace: 'nowrap' },
  hematTag: { position: 'absolute', top: 6, right: 6, background: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 999 },
  unit: { fontSize: 11, fontWeight: 500, color: '#64748b' },
  pcsPrice: { fontSize: 12, color: '#16a34a', fontWeight: 600 },
  searchWrap: { position: 'sticky', top: 54, zIndex: 20, background: '#f1f5f9', padding: '10px 14px 6px' },
  search: { width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #d1d5db', fontSize: 15, outline: 'none' },
  chips: { display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 14px 10px', WebkitOverflowScrolling: 'touch' },
  chip: { flex: '0 0 auto', background: '#fff', border: '1px solid #e2e8f0', color: '#334155', borderRadius: 999, padding: '8px 16px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' },
  chipActive: { background: '#16a34a', color: '#fff', borderColor: '#16a34a' },
  gridWrap: { padding: '0 12px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 },
  card: { background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #e9eef3', display: 'flex', flexDirection: 'column' },
  imgBox: { position: 'relative', aspectRatio: '1 / 1', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 },
  catTag: { position: 'absolute', top: 6, left: 6, background: 'rgba(22,163,74,.92)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999 },
  cardBody: { padding: '8px 10px 10px', display: 'flex', flexDirection: 'column', gap: 3, flex: 1 },
  name: { fontSize: 13.5, fontWeight: 600, lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 34 },
  sku: { fontSize: 11, color: '#94a3b8' },
  price: { fontSize: 16, fontWeight: 800, color: '#0f172a', marginTop: 2 },
  addBtn: { marginTop: 6, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 0', fontWeight: 700, fontSize: 14 },
  stepper: { marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  stepperSm: { display: 'flex', alignItems: 'center', gap: 8 },
  stepBtn: { width: 38, height: 38, borderRadius: 10, border: '1px solid #d1d5db', background: '#fff', fontSize: 20, fontWeight: 700, lineHeight: 1 },
  stepInput: { flex: 1, width: '100%', textAlign: 'center', padding: '8px 0', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 15 },
  muted: { textAlign: 'center', color: '#6b7280', padding: 40 },
  bottomBar: { position: 'fixed', left: 12, right: 12, bottom: 'calc(12px + env(safe-area-inset-bottom))', zIndex: 40, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: 14, boxShadow: '0 8px 24px rgba(22,163,74,.4)' },
  bottomBarBadge: { fontWeight: 700 },
  sheetOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 50, display: 'flex', alignItems: 'flex-end' },
  sheet: { width: '100%', maxWidth: 560, margin: '0 auto', background: '#fff', borderRadius: '18px 18px 0 0', maxHeight: '88vh', display: 'flex', flexDirection: 'column' },
  sheetHandle: { width: 44, height: 5, borderRadius: 999, background: '#cbd5e1', margin: '10px auto 4px' },
  sheetHead: { padding: '6px 18px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eef2f7' },
  closeBtn: { border: 'none', background: 'none', fontSize: 20 },
  sheetBody: { flex: 1, overflowY: 'auto', padding: 16 },
  cartRow: { display: 'flex', gap: 10, alignItems: 'center', paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f1f5f9' },
  sheetFoot: { padding: '14px 16px calc(16px + env(safe-area-inset-bottom))', borderTop: '1px solid #eef2f7' },
  waBtn: { width: '100%', background: '#25D366', color: '#fff', border: 'none', borderRadius: 12, padding: '15px 0', fontWeight: 800, fontSize: 15 },
  ckInput: { width: '100%', padding: 12, borderRadius: 10, border: '1px solid #d1d5db', fontSize: 15 },
};
