// Dashboard — summary stats, omset chart, recent orders, top barang, piutang.
const NS = window.BrontolanoDesignSystem_7cf21c || {};

function DashboardView() {
  const { StatCard, Card, StatusBadge } = NS;
  const Icon = window.Icon;
  const rupiah = (n) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
  const omset = [
    { p: 'Sen', v: 4200000 }, { p: 'Sel', v: 5100000 }, { p: 'Rab', v: 3800000 },
    { p: 'Kam', v: 6400000 }, { p: 'Jum', v: 7200000 }, { p: 'Sab', v: 8800000 }, { p: 'Min', v: 2600000 },
  ];
  const max = Math.max(...omset.map((o) => o.v));
  const orders = [
    { no: 'ORD-00231', toko: 'Toko Berkah Jaya', total: 1240000, status: 'dikirim' },
    { no: 'ORD-00230', toko: 'Warung Bu Sri', total: 486000, status: 'selesai' },
    { no: 'ORD-00229', toko: 'Grosir Makmur', total: 3180000, status: 'confirmed' },
    { no: 'ORD-00228', toko: 'Toko Sumber Rezeki', total: 742000, status: 'proses' },
  ];
  const top = [
    { nama: 'Indomie Goreng Spesial', qty: 320, omset: 18560000 },
    { nama: 'MinyaKita 1L', qty: 145, omset: 22765000 },
    { nama: 'Gula Pasir Gulaku 1kg', qty: 96, omset: 16704000 },
  ];
  const aging = [
    { label: 'Belum jatuh tempo', v: 8400000, tone: '' },
    { label: 'Telat 1–7 hari', v: 2100000, tone: 'warn' },
    { label: 'Telat 8–30 hari', v: 950000, tone: 'warn' },
    { label: 'Telat >30 hari', v: 430000, tone: 'bad' },
  ];

  return (
    <div className="view">
      <div className="view__head">
        <h2>Dashboard</h2>
        <span className="view__sub">Ringkasan operasional · Juni 2026</span>
      </div>

      <div className="statgrid">
        <StatCard label="Konsumen Aktif" value="128" icon={<Icon name="store" />} />
        <StatCard label="Total Order" value="231" icon={<Icon name="receipt" />} />
        <StatCard label="Omset Bulan Ini" value={rupiah(38120000)} icon={<Icon name="trending-up" />} accent delta="12%" deltaDir="up" />
        <StatCard label="Laba Kotor" value={rupiah(4870000)} icon={<Icon name="hand-coins" />} delta="3,4%" deltaDir="up" />
        <StatCard label="Piutang" value={rupiah(11880000)} icon={<Icon name="hourglass" />} />
        <StatCard label="Stok Rendah" value="6" icon={<Icon name="package" />} delta="2 baru" deltaDir="down" />
      </div>

      <div className="cols2">
        <Card title="Omset (Lunas) — Mingguan">
          <div className="chart">
            {omset.map((o) => (
              <div className="chart__col" key={o.p}>
                <div className="chart__bar" style={{ height: (o.v / max * 130) + 'px' }} title={rupiah(o.v)}></div>
                <span className="chart__lbl">{o.p}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Barang Terlaris">
          <table className="tbl">
            <thead><tr><th>Barang</th><th className="r">Terjual</th><th className="r">Omset</th></tr></thead>
            <tbody>
              {top.map((b) => (
                <tr key={b.nama}><td>{b.nama}</td><td className="r tnum">{b.qty}</td><td className="r tnum">{rupiah(b.omset)}</td></tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div className="cols2">
        <Card title="Order Terbaru" flush>
          <table className="tbl">
            <thead><tr><th>No. Order</th><th>Toko</th><th className="r">Total</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.no}>
                  <td className="mono">{o.no}</td><td>{o.toko}</td>
                  <td className="r tnum">{rupiah(o.total)}</td><td><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Piutang — Aging">
          <div className="aging">
            {aging.map((a) => (
              <div className={'aging__row' + (a.tone ? ' is-' + a.tone : '')} key={a.label}>
                <span>{a.label}</span><strong className="tnum">{rupiah(a.v)}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

window.DashboardView = DashboardView;
