// CDM Admin shell — slate sidebar + sticky topbar. Reads DS components
// from the global namespace; exports <AdminShell> + <Icon> to window.
const NS = window.BrontolanoDesignSystem_7cf21c || {};

// Robust Lucide-in-React icon: React owns the <span>, Lucide mutates inside
// it imperatively, so re-renders never touch replaced DOM nodes.
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
window.Icon = Icon;

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { key: 'konsumen', label: 'Konsumen', icon: 'store' },
  { key: 'inventory', label: 'Inventory', icon: 'package' },
  { key: 'pesanan', label: 'Pesanan Masuk', icon: 'inbox' },
  { key: 'orders', label: 'Orders', icon: 'receipt' },
  { key: 'invoices', label: 'Invoices', icon: 'banknote' },
  { key: 'pengiriman', label: 'Pengiriman', icon: 'truck' },
  { key: 'broadcasting', label: 'Broadcast WA', icon: 'message-circle' },
  { key: 'users', label: 'Manajemen User', icon: 'users' },
];

function AdminShell({ active, onNav, children }) {
  return (
    <div className="adm">
      <aside className="adm__side">
        <div className="adm__brand">
          <img src="../../assets/brontolano-mark.png" alt="" />
          <div className="adm__brandtext">
            <strong>Brontolano</strong>
            <span>CDM Admin</span>
          </div>
        </div>
        <nav className="adm__nav">
          {NAV.map((n) => (
            <button
              key={n.key}
              className={'adm__navitem' + (active === n.key ? ' is-active' : '')}
              onClick={() => onNav(n.key)}
            >
              <Icon name={n.icon} />
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="adm__sidefoot">
          <Icon name="life-buoy" /><span>Bantuan</span>
        </div>
      </aside>

      <div className="adm__main">
        <header className="adm__top">
          <div className="adm__search">
            <Icon name="search" />
            <input placeholder="Cari konsumen, order, barang…" />
          </div>
          <div className="adm__user">
            <button className="adm__icon" aria-label="Notifikasi"><Icon name="bell" /></button>
            <div className="adm__userbox">
              <div className="adm__avatar">RB</div>
              <div className="adm__usermeta">
                <strong>Rizal Bahri</strong>
                <span className="adm__role">admin</span>
              </div>
            </div>
          </div>
        </header>
        <main className="adm__content">{children}</main>
      </div>
    </div>
  );
}

window.AdminShell = AdminShell;
