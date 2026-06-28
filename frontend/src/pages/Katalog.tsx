import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, LayoutGrid, ChevronDown, X, Check, Download, User, Settings, HandCoins, QrCode, Building2, Landmark, CreditCard, BadgePercent, Truck, MessageCircle } from 'lucide-react';
import { api } from '../api/client';
import { priceForQty, tierInfo } from '../utils/pricing';
import { rupiah } from '../components/ui';
import { ProductCard, CartBar, QtyStepper, Button } from '../components/ds';
import './katalog.css';

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

const TRUST = [
  { icon: BadgePercent, t: 'Harga pabrik' },
  { icon: Truck, t: 'Kirim cepat' },
  { icon: MessageCircle, t: 'Order via WA' },
];
/** Metode pembayaran — `enabled` mengikuti toggle admin (Fase 4 backend). COD utama. */
const PAYMENTS = [
  { id: 'cod', name: 'COD — Bayar di Tempat', desc: 'Tunai saat barang tiba', Icon: HandCoins, primary: true, enabled: true },
  { id: 'qris', name: 'QRIS', desc: 'Scan QR · semua e-wallet & bank', Icon: QrCode, enabled: true },
  { id: 'transfer', name: 'Transfer Bank', desc: 'BCA · BRI · Mandiri', Icon: Building2, enabled: true },
  { id: 'va', name: 'Virtual Account', desc: 'Pembayaran VA otomatis', Icon: Landmark, enabled: true },
  { id: 'card', name: 'Kartu Kredit/Debit', desc: 'Dinonaktifkan oleh admin', Icon: CreditCard, enabled: false },
];
const payName = (id: string) => PAYMENTS.find((p) => p.id === id)?.name || '';
const LADDER: [string, string][] = [['HET', '1–5'], ['S1', '6–9'], ['S2', '10–24'], ['S3', '25–150'], ['S4', '>150']];

export default function Katalog() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [kategoriList, setKategoriList] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [sheet, setSheet] = useState<null | 'cart' | 'checkout' | 'done'>(null);
  const [pay, setPay] = useState('cod');
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
      const harga = priceForQty(p, qty);
      const base = priceForQty(p, 1);
      return { p, qty, harga, subtotal: harga * qty, saving: Math.max(0, base - harga) * qty };
    }).filter(Boolean) as { p: Produk; qty: number; harga: number; subtotal: number; saving: number }[],
    [cart, produk]);
  const total = cartItems.reduce((s, i) => s + i.subtotal, 0);
  const totalQty = cartItems.reduce((s, i) => s + i.qty, 0);
  const totalSaving = cartItems.reduce((s, i) => s + i.saving, 0);

  const [ck, setCk] = useState({ nama: '', kontak_wa: '', alamat: '' });
  const [sending, setSending] = useState(false);

  function waMessage() {
    let msg = '*Pesanan Grosir Brontolano*\n\n';
    if (ck.nama) msg += `Pemesan: ${ck.nama}\n`;
    if (ck.alamat) msg += `Alamat: ${ck.alamat}\n`;
    msg += `Pembayaran: ${payName(pay)}\n\n`;
    cartItems.forEach((i, idx) => { msg += `${idx + 1}. ${i.p.nama_barang}${i.p.sku ? ` (${i.p.sku})` : ''}\n   ${i.qty} karton x ${rupiah(i.harga)} (Tier ${tierInfo(i.qty).key}) = ${rupiah(i.subtotal)}\n`; });
    msg += `\n*Total: ${rupiah(total)}*\n\nMohon konfirmasi ketersediaan & ongkir. Terima kasih.`;
    return msg;
  }

  async function submitOrder() {
    if (!cartItems.length || !ck.nama || !ck.kontak_wa) return;
    setSending(true);
    try {
      await api.post('/public/catalog/order', {
        nama: ck.nama, kontak_wa: ck.kontak_wa, alamat: ck.alamat || undefined,
        metode_bayar: pay,
        items: cartItems.map((i) => ({ barang_id: i.p.id, jumlah: i.qty })),
      }).catch(() => {});
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage())}`, '_blank');
      setSheet('done');
    } finally { setSending(false); }
  }

  const catLabel = kategori || 'Semua Kategori';
  const barVisible = totalQty > 0 && sheet === null && !catOpen;

  return (
    <div className="cat">
      <header className="cat__head">
        <div className="cat__brand">
          <img src="/brontolano-mark.png" alt="" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
          <span className="cat__brandtext">
            <strong>Brontolano</strong>
            <span className="cat__brandsub">Grosir Sembako</span>
          </span>
        </div>
        <div className="cat__headright">
          <button className="cat__masuk" type="button"><User size={14} aria-hidden /> Masuk</button>
          {canInstall && <button className="cat__installic" onClick={install} aria-label="Pasang App"><Download size={17} aria-hidden /></button>}
        </div>
      </header>

      <div className="cat__trust">
        {TRUST.map((x) => { const I = x.icon; return <span className="cat__trustitem" key={x.t}><I size={14} aria-hidden /> {x.t}</span>; })}
      </div>

      <div className="cat__scroll">
        <div className="cat__banner">
          <div className="cat__banner-top">
            <span className="cat__banner-eyebrow">Promo Grosir</span>
            <span className="cat__banner-badge">Hemat hingga 5%</span>
          </div>
          <div className="cat__banner-h">Belanja Grosir,<br />Untung Lebih Banyak</div>
          <div className="cat__banner-sub">Makin banyak karton, makin turun harganya — otomatis.</div>
          <div className="cat__ladder">
            {LADDER.map(([k, r], idx) => (
              <div className={'cat__rung' + (idx === 4 ? ' is-best' : '')} key={k}>
                <span className="cat__rung-k">{k}</span><span className="cat__rung-r">{r}</span>
              </div>
            ))}
          </div>
          <div className="cat__ladder-cap">Per karton (krtn) — makin banyak, makin murah →</div>
        </div>

        <div className="cat__searchbar">
          <div className="cat__searchwrap">
            <Search className="cat__searchic" size={17} aria-hidden />
            <input placeholder="Cari produk atau SKU…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="cat__filterbar">
          <button className={'cat__catbtn' + (catOpen ? ' is-open' : '')} onClick={() => setCatOpen(true)}>
            <LayoutGrid size={16} aria-hidden /><span>{catLabel}</span><ChevronDown className="cat__catcaret" size={16} aria-hidden />
          </button>
          <span className="cat__count">{produk.length} produk</span>
        </div>

        <div className="cat__grid">
          {loading ? <p className="cat__empty">Memuat produk…</p>
            : produk.length === 0 ? <p className="cat__empty">Tidak ada produk ditemukan.</p>
            : produk.map((p) => {
              const qty = cart[p.id] || 0; const qd = Math.max(qty, 1);
              const harga = priceForQty(p, qd); const base = priceForQty(p, 1);
              const saving = Math.max(0, base - harga);
              return (
                <ProductCard key={p.id} name={p.nama_barang} sku={p.sku || ''} size={p.ukuran || ''}
                  category={p.kategori || ''} image={p.gambar}
                  price={harga} wasPrice={saving > 0 ? base : null} saving={saving > 0 ? saving : 0}
                  hotTier={saving > 0 ? tierInfo(qd).key : null}
                  perPcs={hargaPcs(p, harga)} isi={pcsPerKarton(p)}
                  qty={qty} onQty={(q) => setQty(p.id, q)} />
              );
            })}
        </div>
      </div>

      {barVisible && <div className="cat__barwrap"><CartBar count={totalQty} total={total} onClick={() => setSheet('cart')} /></div>}

      {/* Pilih kategori (bottom-sheet) */}
      {catOpen && (
        <div className="cat__overlay" onClick={() => setCatOpen(false)}>
          <div className="cat__sheet" onClick={(e) => e.stopPropagation()}>
            <div className="cat__handle" />
            <div className="cat__sheet-head"><strong>Pilih Kategori</strong><button className="cat__x" onClick={() => setCatOpen(false)} aria-label="Tutup"><X size={18} /></button></div>
            <div className="cat__sheet-body cat__catlist">
              <button className={'cat__catitem' + (kategori === '' ? ' is-sel' : '')} onClick={() => { setKategori(''); setCatOpen(false); }}>
                <span>Semua Kategori</span>{kategori === '' && <Check className="cat__catcheck" size={16} />}
              </button>
              {kategoriList.map((k) => (
                <button key={k} className={'cat__catitem' + (kategori === k ? ' is-sel' : '')} onClick={() => { setKategori(k); setCatOpen(false); }}>
                  <span>{k}</span>{kategori === k && <Check className="cat__catcheck" size={16} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Keranjang */}
      {sheet === 'cart' && (
        <div className="cat__overlay" onClick={() => setSheet(null)}>
          <div className="cat__sheet" onClick={(e) => e.stopPropagation()}>
            <div className="cat__handle" />
            <div className="cat__sheet-head"><strong>Keranjang ({totalQty})</strong><button className="cat__x" onClick={() => setSheet(null)} aria-label="Tutup"><X size={18} /></button></div>
            <div className="cat__sheet-body">
              {cartItems.length === 0 ? <p className="cat__empty">Keranjang kosong.</p>
                : cartItems.map((i) => (
                  <div className="cat__cartrow" key={i.p.id}>
                    <div className="cat__cartinfo">
                      <div className="cat__cartname">{i.p.nama_barang}</div>
                      <div className="cat__carttier">{rupiah(i.harga)} /karton · Tier {tierInfo(i.qty).key}</div>
                    </div>
                    <QtyStepper value={i.qty} onChange={(q) => setQty(i.p.id, q)} size="sm" />
                    <div className="cat__cartsub">{rupiah(i.subtotal)}</div>
                  </div>
                ))}
            </div>
            <div className="cat__sheet-foot">
              {totalSaving > 0 && <div className="cat__saverow"><BadgePercent size={15} aria-hidden /> Anda hemat {rupiah(totalSaving)} dengan harga grosir</div>}
              <div className="cat__totalrow"><span>Total</span><strong>{rupiah(total)}</strong></div>
              <Button variant="commerce" size="lg" block disabled={!cartItems.length} onClick={() => setSheet('checkout')}>Lanjut ke Pembayaran</Button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout: data + metode pembayaran */}
      {sheet === 'checkout' && (
        <div className="cat__overlay" onClick={() => setSheet('cart')}>
          <div className="cat__sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '92vh' }}>
            <div className="cat__handle" />
            <div className="cat__sheet-head"><strong>Checkout</strong><button className="cat__x" onClick={() => setSheet('cart')} aria-label="Tutup"><X size={18} /></button></div>
            <div className="cat__sheet-body">
              <div className="cat__formsec">Data Pemesan</div>
              <div className="ds-field"><label className="ds-field__label">Nama<span className="ds-field__req">*</span></label>
                <input className="ds-field__control" value={ck.nama} onChange={(e) => setCk({ ...ck, nama: e.target.value })} placeholder="Nama Anda" /></div>
              <div className="ds-field"><label className="ds-field__label">Nomor WhatsApp<span className="ds-field__req">*</span></label>
                <input className="ds-field__control" inputMode="tel" value={ck.kontak_wa} onChange={(e) => setCk({ ...ck, kontak_wa: e.target.value })} placeholder="0812 3456 7890" /></div>
              <div className="ds-field"><label className="ds-field__label">Alamat Pengiriman</label>
                <input className="ds-field__control" value={ck.alamat} onChange={(e) => setCk({ ...ck, alamat: e.target.value })} placeholder="Jl. / Toko / patokan" /></div>

              <div className="cat__formsec">Metode Pembayaran</div>
              <div className="cat__paylist">
                {PAYMENTS.map((p) => {
                  const I = p.Icon;
                  return (
                    <button key={p.id} type="button" disabled={!p.enabled}
                      className={'cat__payopt' + (pay === p.id ? ' is-sel' : '') + (!p.enabled ? ' is-off' : '')}
                      onClick={() => p.enabled && setPay(p.id)}>
                      <span className="cat__payic"><I size={19} aria-hidden /></span>
                      <span className="cat__payinfo">
                        <span className="cat__payname">{p.name}{p.primary && <span className="cat__paybadge">Utama</span>}{!p.enabled && <span className="cat__payoff">Nonaktif</span>}</span>
                        <span className="cat__paydesc">{p.desc}</span>
                      </span>
                      <span className="cat__payradio">{pay === p.id && <span className="cat__paydot" />}</span>
                    </button>
                  );
                })}
              </div>
              <div className="cat__paynote"><Settings size={13} aria-hidden /> Metode pembayaran diatur oleh admin di panel.</div>
            </div>
            <div className="cat__sheet-foot">
              <div className="cat__totalrow"><span>Total ({totalQty} item)</span><strong>{rupiah(total)}</strong></div>
              <Button variant="commerce" size="lg" block disabled={!ck.nama || !ck.kontak_wa || sending} onClick={submitOrder}>
                {sending ? 'Memproses…' : 'Buat Pesanan via WhatsApp'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Konfirmasi */}
      {sheet === 'done' && (
        <div className="cat__overlay" onClick={() => { setSheet(null); setCart({}); }}>
          <div className="cat__done" onClick={(e) => e.stopPropagation()}>
            <div className="cat__done-ic"><Check size={30} aria-hidden /></div>
            <h3>Pesanan dibuat!</h3>
            <p className="cat__doneno">{rupiah(total)} · {payName(pay)}</p>
            <p>{pay === 'cod'
              ? 'Bayar tunai saat barang tiba. Admin akan konfirmasi stok & ongkir via WhatsApp.'
              : `Selesaikan pembayaran ${payName(pay)} — instruksi dikirim via WhatsApp.`}</p>
            <Button variant="commerce" block onClick={() => { setCart({}); setSheet(null); }}>Belanja Lagi</Button>
          </div>
        </div>
      )}
    </div>
  );
}
