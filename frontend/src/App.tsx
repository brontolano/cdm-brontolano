import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useAuth, Role } from './store/auth';
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
import LapanganHome from './pages/lapangan/LapanganHome';
import LapanganPengiriman from './pages/lapangan/LapanganPengiriman';
import LapanganKonsumen from './pages/lapangan/LapanganKonsumen';
import LapanganPos from './pages/lapangan/LapanganPos';
import GudangHome from './pages/gudang/GudangHome';
import GudangMasuk from './pages/gudang/GudangMasuk';
import GudangKeluar from './pages/gudang/GudangKeluar';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
  roles?: Role[]; // visible to these roles (undefined = all)
}

const MENU: MenuItem[] = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/konsumen', label: 'Konsumen', icon: '🏪' },
  { path: '/inventory', label: 'Inventory', icon: '📦' },
  { path: '/pesanan', label: 'Pesanan Masuk', icon: '📥' },
  { path: '/orders', label: 'Orders', icon: '🧾' },
  { path: '/invoices', label: 'Invoices', icon: '💵' },
  { path: '/pengiriman', label: 'Pengiriman', icon: '🚚' },
  { path: '/broadcasting', label: 'Broadcast WA', icon: '💬', roles: ['lapangan', 'admin'] },
  { path: '/users', label: 'Manajemen User', icon: '👥', roles: ['admin'] },
];

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  if (!user) return null;
  const visible = MENU.filter((m) => !m.roles || m.roles.includes(user.role));
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/brontolano-mark.png" alt="" style={{ height: 24, width: 'auto' }} />
          <span className="brand-wordmark">
            Brontolano
            <small>CDM Admin</small>
          </span>
        </h1>
        <nav>
          {visible.map((m) => (
            <NavLink key={m.path} to={m.path} end={m.path === '/'}>
              {m.icon} <span>{m.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="main">
        <header className="topbar">
          <div>
            <strong>{user.nama_lengkap}</strong> <span className="role-badge">{user.role}</span>
          </div>
          <button className="btn secondary small" onClick={logout}>
            Keluar
          </button>
        </header>
        <main className="content">{children}</main>
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
      {/* PWA Staff Gudang (mobile) */}
      <Route path="/gudang" element={<MobileProtected roles={gud}><GudangHome /></MobileProtected>} />
      <Route path="/gudang/masuk" element={<MobileProtected roles={gud}><GudangMasuk /></MobileProtected>} />
      <Route path="/gudang/keluar" element={<MobileProtected roles={gud}><GudangKeluar /></MobileProtected>} />
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<Protected><Dashboard /></Protected>} />
      <Route path="/konsumen" element={<Protected><Konsumen /></Protected>} />
      <Route path="/inventory" element={<Protected><Inventory /></Protected>} />
      <Route path="/pesanan" element={<Protected><PesananMasuk /></Protected>} />
      <Route path="/orders" element={<Protected><Orders /></Protected>} />
      <Route path="/invoices" element={<Protected><Invoices /></Protected>} />
      <Route path="/pengiriman" element={<Protected><Pengiriman /></Protected>} />
      <Route path="/broadcasting" element={<Protected><Broadcasting /></Protected>} />
      <Route path="/users" element={<Protected><Users /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
