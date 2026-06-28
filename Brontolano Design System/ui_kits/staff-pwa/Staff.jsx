// Staff PWA — field (lapangan) + warehouse (gudang) tools, redesigned around
// researched field-app patterns: bottom tab nav in the thumb zone, a task-
// focused home dashboard with progress visibility, big high-contrast targets,
// actions in context. Exports <Staff> to window.
const NS = window.BrontolanoDesignSystem_7cf21c || {};

// Robust Lucide-in-React icon.
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

function priceForQty(b, qty) {
  if (qty >= 25) return b.s3; if (qty >= 10) return b.s2; if (qty >= 6) return b.s1; return b.het;
}
function tierForQty(qty) {
  if (qty >= 25) return 'S3'; if (qty >= 10) return 'S2'; if (qty >= 6) return 'S1'; return 'HET';
}
const rupiah = (n) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
const rIngkas = (n) => n >= 1000000 ? 'Rp ' + (n / 1000000).toFixed(1).replace('.0', '') + ' jt' : rupiah(n);

const KONSUMEN = ['Toko Berkah Jaya', 'Warung Bu Sri', 'Grosir Makmur', 'Kios Pak Joko'];
const BARANG = [
  { id: 'b1', nama: 'Indomie Goreng Spesial', stok: 84, het: 116000, s1: 114000, s2: 112000, s3: 111000 },
  { id: 'b2', nama: 'MinyaKita 1L', stok: 12, het: 188000, s1: 187000, s2: 186000, s3: 185000 },
  { id: 'b3', nama: 'Gula Pasir Gulaku 1kg', stok: 56, het: 174000, s1: 172000, s2: 170000, s3: 169000 },
  { id: 'b4', nama: 'Teh Pucuk Harum 350ml', stok: 132, het: 49000, s1: 48000, s2: 47000, s3: 46500 },
];
const TASKS = [
  { toko: 'Toko Berkah Jaya', alamat: 'Jl. Mayor Abdurahman', jenis: 'Kirim', status: 'selesai' },
  { toko: 'Warung Bu Sri', alamat: 'Jl. Prabu Geusan Ulun', jenis: 'Kirim', status: 'proses' },
  { toko: 'Grosir Makmur', alamat: 'Jl. Pangeran Kornel', jenis: 'Kunjungi', status: 'menunggu' },
  { toko: 'Kios Pak Joko', alamat: 'Jl. Tampomas No. 14', jenis: 'Kirim', status: 'menunggu' },
];
const STOK_RENDAH = [
  { nama: 'MinyaKita 1L', stok: 12, min: 24 },
  { nama: 'Beras Pandan Wangi 5kg', stok: 8, min: 10 },
];
const TABS = [
  { k: 'beranda', icon: 'home', label: 'Beranda' },
  { k: 'rute', icon: 'truck', label: 'Rute' },
  { k: 'pos', icon: 'shopping-cart', label: 'Order' },
  { k: 'stok', icon: 'package', label: 'Stok' },
  { k: 'akun', icon: 'user', label: 'Akun' },
];

function StatusPill({ status }) {
  const { StatusBadge } = NS;
  if (status === 'selesai') return <StatusBadge status="selesai">selesai</StatusBadge>;
  if (status === 'proses') return <StatusBadge status="dikirim">proses</StatusBadge>;
  return <StatusBadge status="draft">menunggu</StatusBadge>;
}

function Staff() {
  const { Select, Button, QtyStepper } = NS;
  const { useState } = React;
  const [tab, setTab] = useState('beranda');
  const [konsumen, setKonsumen] = useState('');
  const [cart, setCart] = useState({});
  const [done, setDone] = useState(null);

  const setQty = (id, q) => setCart((c) => { const n = { ...c }; if (q <= 0) delete n[id]; else n[id] = q; return n; });
  const items = Object.entries(cart).map(([id, qty]) => {
    const b = BARANG.find((x) => x.id === id); return { b, qty, harga: priceForQty(b, qty) };
  });
  const total = items.reduce((s, i) => s + i.harga * i.qty, 0);

  function submit() {
    if (!konsumen || items.length === 0) return;
    const no = 'ORD-00' + (232 + Math.floor(Math.random() * 9));
    setDone({ no, total, konsumen }); setCart({}); setKonsumen('');
  }

  const target = 5000000, tercapai = 3200000;
  const pct = Math.round((tercapai / target) * 100);

  return (
    <div className="stf">
      <div className="stf__screen">
        {tab === 'beranda' && (
          <React.Fragment>
            <header className="stf__hero">
              <div className="stf__herotop">
                <div>
                  <div className="stf__hello">Halo, Budi</div>
                  <div className="stf__sub">Staff Lapangan · Sumedang</div>
                </div>
                <span className="stf__sync"><span className="stf__dot"></span> Tersinkron</span>
              </div>
              <div className="stf__progress">
                <div className="stf__progresshead">
                  <span>Target Omset Hari Ini</span>
                  <strong>{pct}%</strong>
                </div>
                <div className="stf__bar"><div className="stf__barfill" style={{ width: pct + '%' }}></div></div>
                <div className="stf__progressval">{rupiah(tercapai)} <span>dari {rIngkas(target)}</span></div>
              </div>
            </header>
            <div className="stf__body">
              <div className="stf__mini">
                <div className="stf__minicard"><Icon name="receipt" /><strong>7</strong><span>Order</span></div>
                <div className="stf__minicard"><Icon name="store" /><strong>8</strong><span>Toko</span></div>
                <div className="stf__minicard"><Icon name="wallet" /><strong>1,2jt</strong><span>Setoran</span></div>
              </div>
              <div className="stf__quick">
                <button className="stf__qbtn" onClick={() => setTab('pos')}><span className="stf__qic stf__qic--red"><Icon name="plus" /></span>Order Baru</button>
                <button className="stf__qbtn"><span className="stf__qic stf__qic--green"><Icon name="user-plus" /></span>Konsumen</button>
                <button className="stf__qbtn"><span className="stf__qic stf__qic--blue"><Icon name="banknote" /></span>Setor</button>
              </div>
              <div className="stf__sectionhead"><strong>Tugas Hari Ini</strong><button className="stf__link" onClick={() => setTab('rute')}>Lihat semua</button></div>
              <div className="stf__tasks">
                {TASKS.slice(0, 3).map((t) => (
                  <button className="stf__task" key={t.toko}>
                    <span className={'stf__taskic stf__taskic--' + t.status}><Icon name={t.jenis === 'Kirim' ? 'truck' : 'map-pin'} /></span>
                    <span className="stf__taskinfo">
                      <span className="stf__taskname">{t.toko}</span>
                      <span className="stf__taskaddr">{t.jenis} · {t.alamat}</span>
                    </span>
                    <StatusPill status={t.status} />
                  </button>
                ))}
              </div>
            </div>
          </React.Fragment>
        )}

        {tab === 'rute' && (
          <React.Fragment>
            <header className="stf__head"><strong>Rute Kirim</strong><span className="stf__headsub">Hari ini · 4 toko</span></header>
            <div className="stf__body">
              <div className="stf__routebar"><Icon name="map" /> 1 selesai · 1 proses · 2 menunggu <button className="stf__maps">Buka Maps</button></div>
              {TASKS.map((t, i) => (
                <div className="stf__stop" key={t.toko}>
                  <span className={'stf__stopnum stf__stopnum--' + t.status}>{i + 1}</span>
                  <span className="stf__stopinfo">
                    <span className="stf__taskname">{t.toko}</span>
                    <span className="stf__taskaddr">{t.alamat}</span>
                  </span>
                  <span className="stf__stopright">
                    <StatusPill status={t.status} />
                    {t.status !== 'selesai' && <Button size="sm" variant={t.status === 'proses' ? 'primary' : 'secondary'}>{t.status === 'proses' ? 'Selesai' : 'Mulai'}</Button>}
                  </span>
                </div>
              ))}
            </div>
          </React.Fragment>
        )}

        {tab === 'pos' && (
          <React.Fragment>
            <header className="stf__head"><strong>Order Baru</strong><span className="stf__headsub">POS Lapangan</span></header>
            <div className="stf__body stf__body--pos">
              {done && (
                <div className="stf__done">
                  <strong className="stf__doneline"><Icon name="check-circle" /> {done.no}</strong> — {rupiah(done.total)}<br />
                  <span className="stf__muted">Invoice otomatis dibuat · {done.konsumen}</span>
                  <div className="stf__donebtns">
                    <Button variant="primary" block iconLeft={<Icon name="printer" />} onClick={() => {}}>Cetak Struk</Button>
                    <Button variant="secondary" onClick={() => setDone(null)}>Order Baru</Button>
                  </div>
                </div>
              )}
              <div className="stf__panel">
                <label className="stf__label">Konsumen</label>
                <Select placeholder="— pilih konsumen —" options={KONSUMEN} value={konsumen} onChange={(e) => setKonsumen(e.target.value)} />
                <label className="stf__label" style={{ marginTop: 12 }}>Barang</label>
                <div className="stf__barang">
                  {BARANG.map((b) => {
                    const qty = cart[b.id] || 0;
                    const harga = priceForQty(b, Math.max(qty, 1));
                    return (
                      <div className="stf__row" key={b.id}>
                        <div className="stf__rowinfo">
                          <div className="stf__rowname">{b.nama}</div>
                          <div className="stf__rowmeta">{rupiah(harga)} {qty > 0 ? `· Tier ${tierForQty(qty)}` : ''} · stok {b.stok}</div>
                        </div>
                        {qty === 0
                          ? <Button size="sm" variant="secondary" onClick={() => setQty(b.id, 1)}>+</Button>
                          : <QtyStepper value={qty} onChange={(q) => setQty(b.id, q)} size="sm" />}
                      </div>
                    );
                  })}
                </div>
              </div>
              <Button variant="primary" size="lg" block onClick={submit} disabled={!items.length || !konsumen}>
                {items.length ? `Buat Order · ${rupiah(total)}` : 'Buat Order'}
              </Button>
            </div>
          </React.Fragment>
        )}

        {tab === 'stok' && (
          <React.Fragment>
            <header className="stf__head"><strong>Stok Gudang</strong><span className="stf__headsub">214 barang</span></header>
            <div className="stf__body">
              <div className="stf__quick stf__quick--2">
                <button className="stf__qbtn"><span className="stf__qic stf__qic--green"><Icon name="arrow-down-to-line" /></span>Stok Masuk</button>
                <button className="stf__qbtn"><span className="stf__qic stf__qic--red"><Icon name="arrow-up-from-line" /></span>Stok Keluar</button>
              </div>
              <div className="stf__sectionhead"><strong>Perlu Restok</strong><span className="stf__warnpill"><Icon name="alert-triangle" /> {STOK_RENDAH.length}</span></div>
              {STOK_RENDAH.map((s) => (
                <div className="stf__stokrow" key={s.nama}>
                  <span className="stf__stokinfo"><span className="stf__taskname">{s.nama}</span><span className="stf__taskaddr">Min. {s.min}</span></span>
                  <span className="stf__stoknum">{s.stok}<span> krtn</span></span>
                  <Button size="sm" variant="primary">+ Masuk</Button>
                </div>
              ))}
            </div>
          </React.Fragment>
        )}

        {tab === 'akun' && (
          <React.Fragment>
            <header className="stf__head"><strong>Akun</strong></header>
            <div className="stf__body">
              <div className="stf__profile">
                <div className="stf__avatar">BS</div>
                <div><div className="stf__taskname">Budi Santoso</div><div className="stf__taskaddr">Staff Lapangan · Sumedang</div></div>
              </div>
              <div className="stf__synccard"><Icon name="refresh-cw" /> <span>Tersinkron · 2 menit lalu</span><span className="stf__online">● Online</span></div>
              <div className="stf__menu">
                {[['settings', 'Pengaturan'], ['bell', 'Notifikasi'], ['life-buoy', 'Bantuan'], ['info', 'Tentang Aplikasi']].map(([ic, l]) => (
                  <button className="stf__menuitem" key={l}><Icon name={ic} /><span>{l}</span><Icon name="chevron-right" className="stf__menuchev" /></button>
                ))}
              </div>
              <Button variant="secondary" block iconLeft={<Icon name="log-out" />}>Keluar</Button>
            </div>
          </React.Fragment>
        )}
      </div>

      <nav className="stf__nav">
        {TABS.map((t) => (
          <button key={t.k} className={'stf__navitem' + (tab === t.k ? ' is-active' : '')} onClick={() => setTab(t.k)}>
            <Icon name={t.icon} />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

window.Staff = Staff;
