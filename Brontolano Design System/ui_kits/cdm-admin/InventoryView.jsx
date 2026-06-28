// Inventory — stock list with tiered wholesale pricing + low-stock tint.
const NS = window.BrontolanoDesignSystem_7cf21c || {};

function InventoryView() {
  const { Card, Button, TierBadge } = NS;
  const rupiah = (n) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');
  const Icon = window.Icon;
  const rows = [
    { sku: 'MKG-0012', nama: 'Indomie Goreng Spesial', size: 'Karton · isi 40', kat: 'Mie Instan', het: 116000, s4: 110000, stok: 84, min: 20, cap: false },
    { sku: 'SMB-0033', nama: 'MinyaKita Minyak Goreng 1L', size: 'Karton · isi 12', kat: 'Sembako', het: 188000, s4: 184000, stok: 12, min: 24, cap: true },
    { sku: 'SMB-0007', nama: 'Gula Pasir Gulaku 1kg', size: 'Karton · isi 12', kat: 'Sembako', het: 174000, s4: 168000, stok: 56, min: 15, cap: false },
    { sku: 'SMB-0019', nama: 'Beras Pandan Wangi 5kg', size: 'Sak', kat: 'Sembako', het: 72000, s4: 69000, stok: 8, min: 10, cap: false },
    { sku: 'MNM-0004', nama: 'Teh Pucuk Harum 350ml', size: 'Karton · isi 24', kat: 'Minuman', het: 49000, s4: 46000, stok: 132, min: 30, cap: false },
  ];
  return (
    <div className="view">
      <div className="view__head"><h2>Inventory</h2><span className="view__sub">5 dari 214 barang</span></div>
      <div className="toolbar">
        <div className="toolbar__filters">
          <button className="chip is-active">Semua</button>
          <button className="chip">Sembako</button>
          <button className="chip">Mie Instan</button>
          <button className="chip">Minuman</button>
        </div>
        <div className="toolbar__actions">
          <Button variant="secondary" iconLeft={<Icon name="upload" />}>Export CSV</Button>
          <Button iconLeft={<Icon name="plus" />}>Barang</Button>
        </div>
      </div>
      <Card flush>
        <table className="tbl">
          <thead><tr><th>SKU</th><th>Barang</th><th>Kategori</th><th>Harga grosir (HET → S4)</th><th className="r">Stok</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => {
              const low = r.stok < r.min;
              return (
                <tr key={r.sku} className={low ? 'row-low' : ''}>
                  <td className="mono">{r.sku}</td>
                  <td><strong>{r.nama}</strong><div className="muted sm">{r.size}</div></td>
                  <td>{r.kat}</td>
                  <td className="nowrap">
                    <span className="tnum">{rupiah(r.het)}</span>
                    <span className="muted"> → {rupiah(r.s4)}</span>
                    {r.cap && <span className="hetcap" title="Dibatasi HET pemerintah"><Icon name="lock" /> HET</span>}
                  </td>
                  <td className="r"><strong className="tnum">{r.stok}</strong>{low && <Icon name="alert-triangle" className="warn-ic" />}</td>
                  <td className="r nowrap">
                    <TierBadge tier="S2" />
                    <Button size="sm" variant="ghost">+ Masuk</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

window.InventoryView = InventoryView;
