// Orders — order list with status filter chips.
const NS = window.BrontolanoDesignSystem_7cf21c || {};

function OrdersView() {
  const { Card, Button, StatusBadge } = NS;
  const rupiah = (n) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
  const Icon = window.Icon;
  const rows = [
    { no: 'ORD-00231', toko: 'Toko Berkah Jaya', items: 6, total: 1240000, tgl: '27 Jun', status: 'dikirim' },
    { no: 'ORD-00230', toko: 'Warung Bu Sri', items: 3, total: 486000, tgl: '27 Jun', status: 'selesai' },
    { no: 'ORD-00229', toko: 'Grosir Makmur', items: 14, total: 3180000, tgl: '26 Jun', status: 'confirmed' },
    { no: 'ORD-00228', toko: 'Toko Sumber Rezeki', items: 4, total: 742000, tgl: '26 Jun', status: 'proses' },
    { no: 'ORD-00227', toko: 'Kios Pak Joko', items: 2, total: 198000, tgl: '25 Jun', status: 'draft' },
    { no: 'ORD-00226', toko: 'Toko Berkah Jaya', items: 9, total: 2040000, tgl: '24 Jun', status: 'dibatalkan' },
  ];
  return (
    <div className="view">
      <div className="view__head"><h2>Orders</h2><span className="view__sub">231 order bulan ini</span></div>
      <div className="toolbar">
        <div className="toolbar__filters">
          <button className="chip is-active">Semua</button>
          <button className="chip">Draft</button>
          <button className="chip">Confirmed</button>
          <button className="chip">Proses</button>
          <button className="chip">Dikirim</button>
          <button className="chip">Selesai</button>
        </div>
        <Button iconLeft={<Icon name="plus" />}>Order Baru</Button>
      </div>
      <Card flush>
        <table className="tbl">
          <thead><tr><th>No. Order</th><th>Toko</th><th className="r">Item</th><th className="r">Total</th><th>Tanggal</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.no}>
                <td className="mono">{o.no}</td>
                <td><strong>{o.toko}</strong></td>
                <td className="r tnum">{o.items}</td>
                <td className="r tnum">{rupiah(o.total)}</td>
                <td className="muted">{o.tgl}</td>
                <td><StatusBadge status={o.status} /></td>
                <td className="r"><Button size="sm" variant="ghost">Lihat</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

window.OrdersView = OrdersView;
