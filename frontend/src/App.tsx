import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutDashboard, Store, Package, Inbox, ReceiptText, Banknote, Truck, MessageCircle, Users as UsersIcon, LogOut, Search, Bell, LifeBuoy, Wallet, Coins, ExternalLink, ShoppingBag, type LucideIcon } from 'lucide-react';
import { useAuth, homePathFor, Role } from './store/auth';
import { Spinner } from './components/ui';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Konsumen from './pages/Konsumen';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Invoices from './pages/Invoices';
import Pengiriman from './pages/Pengiriman';
import Broadcasting from './pages/Broadcasting';
import Katalog from './pages/Katalog';
import PesananMasuk from './pages/PesananMasuk';
import Users from './pages/Users';
import Payments from './pages/Payments';
import Pengeluaran from './pages/Pengeluaran';
import LapanganHome from './pages/lapangan/LapanganHome';
import LapanganPengiriman from './pages/lapangan/LapanganPengiriman';
import LapanganKonsumen from './pages/lapangan/LapanganKonsumen';
import LapanganPos from './pages/lapangan/LapanganPos';
import GudangHome from './pages/gudang/GudangHome';
import GudangMasuk from './pages/gudang/GudangMasuk';
import GudangKeluar from './pages/gudang/GudangKeluar';
import StaffAkun from './pages/staff/StaffAkun';

interface MenuItem {
  path: string;
  label: string;
  icon: LucideIcon;
  roles?: Role[]; // visible to these roles (undefined = all)
}

const MENU: MenuItem[] = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/konsumen', label: 'Konsumen', icon: Store },
  { path: '/inventory', label: 'Inventory', icon: Package },
  { path: '/pesanan', label: 'Pesanan Masuk', icon: Inbox },
  { path: '/orders', label: 'Orders', icon: ReceiptText },
  { path: '/invoices', label: 'Invoices', icon: Banknote },
  { path: '/pengiriman', label: 'Pengiriman', icon: Truck },
  { path: '/broadcasting', label: 'Broadcast WA', icon: MessageCircle, roles: ['lapangan', 'admin'] },
  { path: '/pembayaran', label: 'Pembayaran', icon: Wallet, roles: ['admin', 'management'] },
  { path: '/pengeluaran', label: 'Pengeluaran', icon: Coins, roles: ['admin', 'management'] },
  { path: '/users', label: 'Manajemen User', icon: UsersIcon, roles: ['admin'] },
];

// Pintasan ke surface aplikasi lain (buka di tab baru).
const APPS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/katalog', label: 'Katalog Konsumen', icon: ShoppingBag },
  { to: '/sales', label: 'PWA Lapangan', icon: Truck },
  { to: '/gudang', label: 'PWA Gudang', icon: Package },
];

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  if (!user) return null;
  const visible = MENU.filter((m) => !m.roles || m.roles.includes(user.role));
  const initials = (user.nama_lengkap || 'U').split(/\s+/).slice(0, 2).map((s) => s[0]?.toUpperCase()).join('');
  return (
    <div className="adm">
      <aside className="adm__side">
        <div className="adm__brand">
          <img src="/brontolano-mark.png" alt="" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
          <div className="adm__brandtext">
            <strong>Brontolano</strong>
            <span>CDM Admin</span>
          </div>
        </div>
        <nav className="adm__nav">
          {visible.map((m) => {
            const Icon = m.icon;
            return (
              <NavLink key={m.path} to={m.path} end={m.path === '/'} className={({ isActive }) => 'adm__navitem' + (isActive ? ' is-active' : '')}>
                <Icon size={18} strokeWidth={2} aria-hidden />
                <span>{m.label}</span>
              </NavLink>
            );
          })}
        </nav>
        {(user.role === 'admin' || user.role === 'management') && (
          <div className="adm__apps">
            <div className="adm__apps-label">Aplikasi</div>
            {APPS.map((a) => {
              const Icon = a.icon;
              return (
                <a key={a.to} href={a.to} target="_blank" rel="noreferrer" className="adm__navitem">
                  <Icon size={18} strokeWidth={2} aria-hidden />
                  <span>{a.label}</span>
                  <ExternalLink size={13} aria-hidden style={{ marginLeft: 'auto', opacity: .6 }} />
                </a>
              );
            })}
          </div>
        )}
        <div className="adm__sidefoot">
          <LifeBuoy size={17} aria-hidden /><span>Bantuan</span>
        </div>
      </aside>
      <div className="adm__main">
        <header className="adm__top">
          <div className="adm__search">
            <Search size={16} aria-hidden />
            <input placeholder="Cari konsumen, order, barang…" aria-label="Cari" />
          </div>
          <div className="adm__user">
            <button className="adm__icon" aria-label="Notifikasi"><Bell size={19} aria-hidden /></button>
            <div className="adm__userbox">
              <div className="adm__avatar">{initials}</div>
              <div className="adm__usermeta">
                <strong>{user.nama_lengkap}</strong>
                <span className="adm__role">{user.role}</span>
              </div>
            </div>
            <button className="adm__icon" aria-label="Keluar" onClick={logout}><LogOut size={18} aria-hidden /></button>
          </div>
        </header>
        <main className="adm__content">{children}</main>
      </div>
    </div>
  );
}

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

// Halaman mobile penuh (PWA staff) tanpa sidebar — gating per role.
function MobileProtected({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  const lap: Role[] = ['lapangan', 'admin'];
  const gud: Role[] = ['gudang', 'admin'];
  return (
    <Routes>
      {/* Katalog publik — tanpa login (nanti dilayani di katalog.brontolano.com) */}
      <Route path="/katalog" element={<Katalog />} />
      {/* PWA Staff Lapangan (mobile) — path /sales */}
      <Route path="/sales" element={<MobileProtected roles={lap}><LapanganHome /></MobileProtected>} />
      <Route path="/sales/pengiriman" element={<MobileProtected roles={lap}><LapanganPengiriman /></MobileProtected>} />
      <Route path="/sales/konsumen" element={<MobileProtected roles={lap}><LapanganKonsumen /></MobileProtected>} />
      <Route path="/sales/pos" element={<MobileProtected roles={lap}><LapanganPos /></MobileProtected>} />
      <Route path="/sales/akun" element={<MobileProtected roles={lap}><StaffAkun /></MobileProtected>} />
      {/* PWA Staff Gudang (mobile) */}
      <Route path="/gudang" element={<MobileProtected roles={gud}><GudangHome /></MobileProtected>} />
      <Route path="/gudang/masuk" element={<MobileProtected roles={gud}><GudangMasuk /></MobileProtected>} />
      <Route path="/gudang/keluar" element={<MobileProtected roles={gud}><GudangKeluar /></MobileProtected>} />
      <Route path="/gudang/akun" element={<MobileProtected roles={gud}><StaffAkun /></MobileProtected>} />
      <Route path="/login" element={user ? <Navigate to={homePathFor(user.role)} replace /> : <Login />} />
      <Route path="/" element={
        user && user.role === 'lapangan' ? <Navigate to="/sales" replace />
        : user && user.role === 'gudang' ? <Navigate to="/gudang" replace />
        : <Protected><Dashboard /></Protected>
      } />
      <Route path="/konsumen" element={<Protected><Konsumen /></Protected>} />
      <Route path="/inventory" element={<Protected><Inventory /></Protected>} />
      <Route path="/pesanan" element={<Protected><PesananMasuk /></Protected>} />
      <Route path="/orders" element={<Protected><Orders /></Protected>} />
      <Route path="/invoices" element={<Protected><Invoices /></Protected>} />
      <Route path="/pengiriman" element={<Protected><Pengiriman /></Protected>} />
      <Route path="/broadcasting" element={<Protected><Broadcasting /></Protected>} />
      <Route path="/users" element={<Protected><Users /></Protected>} />
      <Route path="/pembayaran" element={<Protected><Payments /></Protected>} />
      <Route path="/pengeluaran" element={<Protected><Pengeluaran /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
