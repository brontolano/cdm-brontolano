// Konsumen — searchable list of shops with status + row actions.
const NS = window.BrontolanoDesignSystem_7cf21c || {};

function KonsumenView() {
  const { Card, Button, Input, StatusBadge } = NS;
  const Icon = window.Icon;
  const rows = [
    { toko: 'Toko Berkah Jaya', pemilik: 'H. Supriyadi', wa: '+62 812 3456 7890', kota: 'Sumedang', status: 'aktif', gps: true },
    { toko: 'Warung Bu Sri', pemilik: 'Sri Wahyuni', wa: '+62 813 9988 1122', kota: 'Sumedang', status: 'aktif', gps: true },
    { toko: 'Grosir Makmur', pemilik: 'Andi Pratama', wa: '+62 856 7766 5544', kota: 'Bandung', status: 'aktif', gps: false },
    { toko: 'Toko Sumber Rezeki', pemilik: 'Dewi Lestari', wa: '+62 878 1234 5678', kota: 'Cimahi', status: 'tidak_aktif', gps: true },
    { toko: 'Kios Pak Joko', pemilik: 'Joko Susilo', wa: '+62 821 4455 6677', kota: 'Sumedang', status: 'aktif', gps: true },
  ];
  return (
    <div className="view">
      <div className="view__head"><h2>Data Konsumen</h2><span className="view__sub">128 toko terdaftar</span></div>
      <div className="toolbar">
        <div className="toolbar__search">
          <Input placeholder="Cari toko / pemilik / WA…" />
        </div>
        <Button iconLeft={<Icon name="plus" />}>Konsumen</Button>
      </div>
      <Card flush>
        <table className="tbl">
          <thead><tr><th>Toko</th><th>Pemilik</th><th>Kontak WA</th><th>Kota</th><th>GPS</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.toko}>
                <td><strong>{r.toko}</strong></td>
                <td>{r.pemilik}</td>
                <td className="mono">{r.wa}</td>
                <td>{r.kota}</td>
                <td>{r.gps ? <a className="gpslink" href="#"><Icon name="map-pin" /> Arah</a> : <span className="muted">—</span>}</td>
                <td><StatusBadge status={r.status} /></td>
                <td className="r nowrap">
                  <Button size="sm" variant="ghost">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

window.KonsumenView = KonsumenView;
