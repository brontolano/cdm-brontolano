// Katalog Brontolano — public mobile storefront + consumer account.
// Marketing 7.0 voice. Adds: WhatsApp login/signup, profile, order history
// & status timeline, and a payment step (COD primary; QRIS/Transfer/VA
// secondary — admin-configurable). Exports <Catalog> to window.
const NS = window.BrontolanoDesignSystem_7cf21c || {};

// Robust Lucide-in-React icon: React owns the <span>, Lucide mutates inside.
function Icon({ name, className }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    el.appendChild(i);
    try { window.lucide.createIcons(); } catch (e) {}
  }, [name]);
  return React.createElement('span', { ref, className: 'ic' + (className ? ' ' + className : ''), 'aria-hidden': true });
}

// Tiered wholesale price: HET 1–5, S1 6–9, S2 10–24, S3 25–150, S4 >150 cartons.
function priceForQty(p, qty) {
  if (qty >= 151) return p.s4;
  if (qty >= 25) return p.s3;
  if (qty >= 10) return p.s2;
  if (qty >= 6) return p.s1;
  return p.het;
}
function tierForQty(qty) {
  if (qty >= 151) return 'S4'; if (qty >= 25) return 'S3';
  if (qty >= 10) return 'S2'; if (qty >= 6) return 'S1'; return 'HET';
}
const initials = (n) => (n || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

const PRODUCTS = [
  { id: 'p1', nama: 'Indomie Goreng Spesial', sku: 'MKG-0012', kategori: 'Mie Instan', isi: 40, het: 116000, s1: 114000, s2: 112000, s3: 111000, s4: 110000 },
  { id: 'p2', nama: 'MinyaKita Minyak Goreng 1L', sku: 'SMB-0033', kategori: 'Sembako', isi: 12, het: 188000, s1: 187000, s2: 186000, s3: 185000, s4: 184000 },
  { id: 'p3', nama: 'Gula Pasir Gulaku 1kg', sku: 'SMB-0007', kategori: 'Sembako', isi: 12, het: 174000, s1: 172000, s2: 170000, s3: 169000, s4: 168000 },
  { id: 'p4', nama: 'Teh Pucuk Harum 350ml', sku: 'MNM-0004', kategori: 'Minuman', isi: 24, het: 49000, s1: 48000, s2: 47000, s3: 46500, s4: 46000 },
  { id: 'p5', nama: 'Kopi Kapal Api Special 165g', sku: 'MNM-0021', kategori: 'Minuman', isi: 20, het: 84000, s1: 82500, s2: 81000, s3: 80000, s4: 79000 },
  { id: 'p6', nama: 'Sabun Lifebuoy Merah 110g', sku: 'NFD-0009', kategori: 'Non-Food', isi: 48, het: 132000, s1: 130000, s2: 128000, s3: 127000, s4: 126000 },
];
const CATS = [
  { name: 'Semua Kategori', v: 'Semua' }, { name: 'Sembako', v: 'Sembako' },
  { name: 'Mie Instan', v: 'Mie Instan' }, { name: 'Minuman', v: 'Minuman' }, { name: 'Non-Food', v: 'Non-Food' },
];
const TRUST = [
  { ic: 'badge-percent', t: 'Harga pabrik' }, { ic: 'truck', t: 'Kirim cepat' }, { ic: 'message-circle', t: 'Order via WA' },
];
// Payment methods — `enabled` mirrors the admin-panel toggle. COD is primary.
const PAYMENTS = [
  { id: 'cod', name: 'COD — Bayar di Tempat', desc: 'Tunai saat barang tiba', icon: 'hand-coins', primary: true, enabled: true },
  { id: 'qris', name: 'QRIS', desc: 'Scan QR · semua e-wallet & bank', icon: 'qr-code', enabled: true },
  { id: 'transfer', name: 'Transfer Bank', desc: 'BCA · BRI · Mandiri', icon: 'building-2', enabled: true },
  { id: 'va', name: 'Virtual Account', desc: 'Pembayaran VA otomatis', icon: 'landmark', enabled: true },
  { id: 'card', name: 'Kartu Kredit/Debit', desc: 'Dinonaktifkan oleh admin', icon: 'credit-card', enabled: false },
];
const payName = (id) => (PAYMENTS.find((p) => p.id === id) || {}).name || '';
// Order status flow for the timeline.
const FLOW = [
  { k: 'dikonfirmasi', label: 'Dikonfirmasi', ic: 'clipboard-check' },
  { k: 'proses', label: 'Disiapkan', ic: 'package' },
  { k: 'dikirim', label: 'Dikirim', ic: 'truck' },
  { k: 'selesai', label: 'Selesai', ic: 'party-popper' },
];
const stepOf = (s) => ({ menunggu: -1, dikonfirmasi: 0, proses: 1, dikirim: 2, selesai: 3 }[s] ?? 0);
const ORDERS0 = [
  { no: 'ORD-00231', tgl: '27 Jun 2026', total: 1240000, status: 'dikirim', bayar: 'COD — Bayar di Tempat', items: 6 },
  { no: 'ORD-00198', tgl: '20 Jun 2026', total: 486000, status: 'selesai', bayar: 'QRIS', items: 3 },
  { no: 'ORD-00154', tgl: '12 Jun 2026', total: 3180000, status: 'selesai', bayar: 'Transfer Bank', items: 14 },
];

function StatusBadgeFor({ status }) {
  const { StatusBadge } = NS;
  const map = { menunggu: 'draft', dikonfirmasi: 'confirmed', proses: 'proses', dikirim: 'dikirim', selesai: 'selesai' };
  const label = { menunggu: 'menunggu', dikonfirmasi: 'dikonfirmasi', proses: 'diproses', dikirim: 'dikirim', selesai: 'selesai' };
  return <StatusBadge status={map[status] || 'draft'}>{label[status] || status}</StatusBadge>;
}

function Catalog() {
  const { ProductCard, CartBar, QtyStepper, Button, Input } = NS;
  const rupiah = (n) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
  const { useState, useMemo } = React;
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('Semua');
  const [catOpen, setCatOpen] = useState(false);
  const [cart, setCart] = useState({ p1: 12 });
  const [sheet, setSheet] = useState(null); // null | 'cart' | 'checkout' | 'done'
  const [ck, setCk] = useState({ nama: '', wa: '', alamat: '' });
  // account / auth / payment / orders
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(null);       // null | 'login' | 'signup'
  const [af, setAf] = useState({ nama: '', wa: '', password: '' });
  const [acctOpen, setAcctOpen] = useState(false);
  const [detail, setDetail] = useState(null);   // order object for status view
  const [pay, setPay] = useState('cod');
  const [orders, setOrders] = useState(ORDERS0);

  const setQty = (id, q) => setCart((c) => { const n = { ...c }; if (q <= 0) delete n[id]; else n[id] = q; return n; });

  const shown = useMemo(() => PRODUCTS.filter((p) =>
    (cat === 'Semua' || p.kategori === cat) &&
    (p.nama.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
  ), [search, cat]);

  const items = Object.entries(cart).map(([id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === id); if (!p) return null;
    const harga = priceForQty(p, qty);
    return { p, qty, harga, subtotal: harga * qty, saving: (p.het - harga) * qty };
  }).filter(Boolean);
  const total = items.reduce((s, i) => s + i.subtotal, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const totalSaving = items.reduce((s, i) => s + i.saving, 0);
  const catLabel = (CATS.find((c) => c.v === cat) || CATS[0]).name;

  function openCheckout() {
    if (user) setCk({ nama: user.nama, wa: user.wa, alamat: ck.alamat });
    setSheet('checkout');
  }
  function doAuth(e) {
    e.preventDefault();
    const nama = auth === 'signup' ? (af.nama || 'Konsumen') : (af.nama || 'Budi Santoso');
    setUser({ nama, wa: af.wa || '0812 0000 0000' });
    setAuth(null); setAf({ nama: '', wa: '', password: '' });
  }
  function placeOrder() {
    const no = 'ORD-00' + (240 + Math.floor(Math.random() * 9));
    const order = { no, tgl: '28 Jun 2026', total, status: 'dikonfirmasi', bayar: payName(pay), items: count, payId: pay };
    setOrders((o) => [order, ...o]);
    setSheet('done'); setLastNo(order); 
  }
  const [lastOrder, setLastNo] = useState(null);

  return (
    <div className="cat">
      <header className="cat__head">
        <div className="cat__brand">
          <img src="../../assets/brontolano-mark.png" alt="" />
          <span className="cat__brandtext">
            <strong>Brontolano</strong>
            <span className="cat__brandsub">Grosir Sembako</span>
          </span>
        </div>
        <div className="cat__headright">
          {user
            ? <button className="cat__avatarbtn" onClick={() => setAcctOpen(true)} aria-label="Akun">{initials(user.nama)}</button>
            : <button className="cat__masuk" onClick={() => setAuth('login')}><Icon name="user" /> Masuk</button>}
          <button className="cat__installic" aria-label="Pasang App"><Icon name="download" /></button>
        </div>
      </header>

      <div className="cat__trust">
        {TRUST.map((x) => (<span className="cat__trustitem" key={x.t}><Icon name={x.ic} /> {x.t}</span>))}
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
            {[['HET', '1–5'], ['S1', '6–9'], ['S2', '10–24'], ['S3', '25–150'], ['S4', '>150']].map(([k, r], idx) => (
              <div className={'cat__rung' + (idx === 4 ? ' is-best' : '')} key={k}>
                <span className="cat__rung-k">{k}</span><span className="cat__rung-r">{r}</span>
              </div>
            ))}
          </div>
          <div className="cat__ladder-cap">Per karton (krtn) — makin banyak, makin murah →</div>
        </div>

        <div className="cat__searchbar">
          <Icon name="search" className="cat__searchic" />
          <input placeholder="Cari produk atau SKU…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="cat__filterbar">
          <button className={'cat__catbtn' + (catOpen ? ' is-open' : '')} onClick={() => setCatOpen(true)}>
            <Icon name="layout-grid" /><span>{catLabel}</span><Icon name="chevron-down" className="cat__catcaret" />
          </button>
          <span className="cat__count">{shown.length} produk</span>
        </div>

        <div className="cat__grid">
          {shown.map((p) => {
            const qty = cart[p.id] || 0; const qd = Math.max(qty, 1);
            const harga = priceForQty(p, qd); const saving = p.het - harga;
            return (
              <ProductCard key={p.id} name={p.nama} sku={p.sku} category={p.kategori}
                price={harga} wasPrice={saving > 0 ? p.het : null} saving={saving > 0 ? saving : 0}
                perPcs={Math.round(harga / p.isi)} isi={p.isi}
                qty={qty} onQty={(q) => setQty(p.id, q)} />
            );
          })}
          {shown.length === 0 && <p className="cat__empty">Tidak ada produk ditemukan.</p>}
        </div>
      </div>

      {count > 0 && sheet === null && !catOpen && !auth && !acctOpen && !detail && (
        <div className="cat__barwrap"><CartBar count={count} total={total} onClick={() => setSheet('cart')} /></div>
      )}

      {/* Category picker sheet */}
      {catOpen && (
        <div className="cat__overlay" onClick={() => setCatOpen(false)}>
          <div className="cat__sheet" onClick={(e) => e.stopPropagation()}>
            <div className="cat__handle"></div>
            <div className="cat__sheet-head"><strong>Pilih Kategori</strong><button className="cat__x" onClick={() => setCatOpen(false)} aria-label="Tutup"><Icon name="x" /></button></div>
            <div className="cat__sheet-body cat__catlist">
              {CATS.map((c) => {
                const n = c.v === 'Semua' ? PRODUCTS.length : PRODUCTS.filter((p) => p.kategori === c.v).length;
                return (
                  <button key={c.v} className={'cat__catitem' + (cat === c.v ? ' is-sel' : '')} onClick={() => { setCat(c.v); setCatOpen(false); }}>
                    <span>{c.name}</span><span className="cat__catn">{n}</span>
                    {cat === c.v && <Icon name="check" className="cat__catcheck" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cart sheet */}
      {sheet === 'cart' && (
        <div className="cat__overlay" onClick={() => setSheet(null)}>
          <div className="cat__sheet" onClick={(e) => e.stopPropagation()}>
            <div className="cat__handle"></div>
            <div className="cat__sheet-head"><strong>Keranjang ({count})</strong><button className="cat__x" onClick={() => setSheet(null)} aria-label="Tutup"><Icon name="x" /></button></div>
            <div className="cat__sheet-body">
              {items.map((i) => (
                <div className="cat__cartrow" key={i.p.id}>
                  <div className="cat__cartinfo">
                    <div className="cat__cartname">{i.p.nama}</div>
                    <div className="cat__carttier">{rupiah(i.harga)} /karton · Tier {tierForQty(i.qty)}</div>
                  </div>
                  <QtyStepper value={i.qty} onChange={(q) => setQty(i.p.id, q)} size="sm" />
                  <div className="cat__cartsub">{rupiah(i.subtotal)}</div>
                </div>
              ))}
            </div>
            <div className="cat__sheet-foot">
              {totalSaving > 0 && <div className="cat__saverow"><Icon name="badge-percent" /> Anda hemat {rupiah(totalSaving)} dengan harga grosir</div>}
              <div className="cat__totalrow"><span>Total</span><strong>{rupiah(total)}</strong></div>
              <Button variant="commerce" size="lg" block onClick={openCheckout}>Lanjut ke Pembayaran</Button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout sheet — data + payment method */}
      {sheet === 'checkout' && (
        <div className="cat__overlay" onClick={() => setSheet('cart')}>
          <div className="cat__sheet cat__sheet--tall" onClick={(e) => e.stopPropagation()}>
            <div className="cat__handle"></div>
            <div className="cat__sheet-head"><strong>Checkout</strong><button className="cat__x" onClick={() => setSheet('cart')} aria-label="Tutup"><Icon name="x" /></button></div>
            <div className="cat__sheet-body">
              {!user && (
                <button className="cat__loginbar" onClick={() => setAuth('login')}>
                  <Icon name="user-round" />
                  <span><b>Masuk</b> untuk simpan alamat &amp; lacak pesanan</span>
                  <Icon name="chevron-right" />
                </button>
              )}
              <div className="cat__formsec">Data Pemesan</div>
              <Input label="Nama" required value={ck.nama} onChange={(e) => setCk({ ...ck, nama: e.target.value })} placeholder="Nama Anda" />
              <Input label="Nomor WhatsApp" required prefix="+62" value={ck.wa} onChange={(e) => setCk({ ...ck, wa: e.target.value })} placeholder="81234 5678" />
              <Input label="Alamat Pengiriman" value={ck.alamat} onChange={(e) => setCk({ ...ck, alamat: e.target.value })} placeholder="Jl. / Toko / patokan" />

              <div className="cat__formsec">Metode Pembayaran</div>
              <div className="cat__paylist">
                {PAYMENTS.map((p) => (
                  <button key={p.id} disabled={!p.enabled}
                    className={'cat__payopt' + (pay === p.id ? ' is-sel' : '') + (!p.enabled ? ' is-off' : '')}
                    onClick={() => p.enabled && setPay(p.id)}>
                    <span className="cat__payic"><Icon name={p.icon} /></span>
                    <span className="cat__payinfo">
                      <span className="cat__payname">{p.name}{p.primary && <span className="cat__paybadge">Utama</span>}{!p.enabled && <span className="cat__payoff">Nonaktif</span>}</span>
                      <span className="cat__paydesc">{p.desc}</span>
                    </span>
                    <span className="cat__payradio">{pay === p.id && <span className="cat__paydot"></span>}</span>
                  </button>
                ))}
              </div>
              <div className="cat__paynote"><Icon name="settings" /> Metode pembayaran diatur oleh admin di panel.</div>
            </div>
            <div className="cat__sheet-foot">
              <div className="cat__totalrow"><span>Total ({count} item)</span><strong>{rupiah(total)}</strong></div>
              <Button variant="commerce" size="lg" block disabled={!ck.nama || !ck.wa} onClick={placeOrder}>Buat Pesanan</Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation */}
      {sheet === 'done' && lastOrder && (
        <div className="cat__overlay" onClick={() => { setSheet(null); setCart({}); }}>
          <div className="cat__done" onClick={(e) => e.stopPropagation()}>
            <div className="cat__done-ic"><Icon name="check" /></div>
            <h3>Pesanan dibuat!</h3>
            <p className="cat__doneno">{lastOrder.no} · {rupiah(lastOrder.total)}</p>
            <p>{lastOrder.payId === 'cod'
              ? 'Bayar tunai saat barang tiba. Admin akan konfirmasi stok & ongkir via WhatsApp.'
              : `Selesaikan pembayaran ${lastOrder.bayar} — instruksi dikirim via WhatsApp.`}</p>
            <Button variant="commerce" block onClick={() => { setCart({}); setSheet(null); setDetail(lastOrder); }}>Lihat Status Pesanan</Button>
            <button className="cat__textbtn" onClick={() => { setSheet(null); setCart({}); }}>Belanja Lagi</button>
          </div>
        </div>
      )}

      {/* Auth (login / signup) */}
      {auth && (
        <div className="cat__overlay" onClick={() => setAuth(null)}>
          <form className="cat__sheet" onClick={(e) => e.stopPropagation()} onSubmit={doAuth}>
            <div className="cat__handle"></div>
            <div className="cat__sheet-head"><strong>{auth === 'login' ? 'Masuk' : 'Daftar Akun'}</strong><button type="button" className="cat__x" onClick={() => setAuth(null)} aria-label="Tutup"><Icon name="x" /></button></div>
            <div className="cat__sheet-body">
              <div className="cat__authlede">{auth === 'login' ? 'Masuk dengan nomor WhatsApp aktif Anda.' : 'Daftar pakai nomor WhatsApp aktif — untuk lacak pesanan & checkout cepat.'}</div>
              {auth === 'signup' && <Input label="Nama Lengkap" required value={af.nama} onChange={(e) => setAf({ ...af, nama: e.target.value })} placeholder="Nama Anda" />}
              <Input label="Nomor WhatsApp" required prefix="+62" value={af.wa} onChange={(e) => setAf({ ...af, wa: e.target.value })} placeholder="81234 5678" />
              <Input label="Password" required type="password" value={af.password} onChange={(e) => setAf({ ...af, password: e.target.value })} placeholder="••••••••" />
              {auth === 'login' && <button type="button" className="cat__textbtn cat__textbtn--right">Lupa password?</button>}
            </div>
            <div className="cat__sheet-foot">
              <Button variant="primary" size="lg" block type="submit">{auth === 'login' ? 'Masuk' : 'Daftar'}</Button>
              <div className="cat__authswitch">
                {auth === 'login'
                  ? <span>Belum punya akun? <button type="button" onClick={() => setAuth('signup')}>Daftar</button></span>
                  : <span>Sudah punya akun? <button type="button" onClick={() => setAuth('login')}>Masuk</button></span>}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Account / profile + order history */}
      {acctOpen && user && (
        <div className="cat__overlay" onClick={() => setAcctOpen(false)}>
          <div className="cat__sheet cat__sheet--tall" onClick={(e) => e.stopPropagation()}>
            <div className="cat__handle"></div>
            <div className="cat__sheet-head"><strong>Akun Saya</strong><button className="cat__x" onClick={() => setAcctOpen(false)} aria-label="Tutup"><Icon name="x" /></button></div>
            <div className="cat__sheet-body">
              <div className="cat__profile">
                <div className="cat__pavatar">{initials(user.nama)}</div>
                <div className="cat__pinfo"><div className="cat__pname">{user.nama}</div><div className="cat__pwa"><Icon name="phone" /> +62 {user.wa}</div></div>
              </div>
              <div className="cat__formsec">Riwayat Pesanan</div>
              <div className="cat__orderlist">
                {orders.map((o) => (
                  <button className="cat__orderrow" key={o.no} onClick={() => { setAcctOpen(false); setDetail(o); }}>
                    <span className="cat__orderinfo">
                      <span className="cat__orderno">{o.no}</span>
                      <span className="cat__ordermeta">{o.tgl} · {o.items} item · {o.bayar.split('—')[0].trim()}</span>
                    </span>
                    <span className="cat__orderright">
                      <span className="cat__ordertotal">{rupiah(o.total)}</span>
                      <StatusBadgeFor status={o.status} />
                    </span>
                  </button>
                ))}
              </div>
              <button className="cat__logout" onClick={() => { setUser(null); setAcctOpen(false); }}><Icon name="log-out" /> Keluar</button>
            </div>
          </div>
        </div>
      )}

      {/* Order status detail */}
      {detail && (
        <div className="cat__overlay" onClick={() => setDetail(null)}>
          <div className="cat__sheet cat__sheet--tall" onClick={(e) => e.stopPropagation()}>
            <div className="cat__handle"></div>
            <div className="cat__sheet-head"><strong>Status Pesanan</strong><button className="cat__x" onClick={() => setDetail(null)} aria-label="Tutup"><Icon name="x" /></button></div>
            <div className="cat__sheet-body">
              <div className="cat__detailtop">
                <div><div className="cat__orderno">{detail.no}</div><div className="cat__ordermeta">{detail.tgl}</div></div>
                <StatusBadgeFor status={detail.status} />
              </div>
              <div className="cat__timeline">
                {FLOW.map((f, i) => {
                  const cur = stepOf(detail.status);
                  const state = i < cur ? 'done' : i === cur ? 'active' : 'todo';
                  return (
                    <div className={'cat__tstep is-' + state} key={f.k}>
                      <span className="cat__tdot"><Icon name={i <= cur ? 'check' : f.ic} /></span>
                      <span className="cat__tlabel">{f.label}</span>
                    </div>
                  );
                })}
              </div>
              <div className="cat__detailcard">
                <div className="cat__drow"><span>Metode bayar</span><strong>{detail.bayar}</strong></div>
                <div className="cat__drow"><span>Jumlah item</span><strong>{detail.items} item</strong></div>
                <div className="cat__drow cat__drow--total"><span>Total</span><strong>{rupiah(detail.total)}</strong></div>
              </div>
            </div>
            <div className="cat__sheet-foot">
              <Button variant="whatsapp" size="lg" block iconLeft={<Icon name="message-circle" />}>Hubungi Admin</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.Catalog = Catalog;
