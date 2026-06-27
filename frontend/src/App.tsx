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
  { path: '/orders', label: 'Orders', icon: '🧾' },
  { path: '/invoices', label: 'Invoices', icon: '💵' },
  { path: '/pengiriman', label: 'Pengiriman', icon: '🚚' },
  { path: '/broadcasting', label: 'Broadcast WA', icon: '💬', roles: ['lapangan', 'admin'] },
];

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  if (!user) return null;
  const visible = MENU.filter((m) => !m.roles || m.roles.includes(user.role));
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>🛒 CDM</h1>
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

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<Protected><Dashboard /></Protected>} />
      <Route path="/konsumen" element={<Protected><Konsumen /></Protected>} />
      <Route path="/inventory" element={<Protected><Inventory /></Protected>} />
      <Route path="/orders" element={<Protected><Orders /></Protected>} />
      <Route path="/invoices" element={<Protected><Invoices /></Protected>} />
      <Route path="/pengiriman" element={<Protected><Pengiriman /></Protected>} />
      <Route path="/broadcasting" element={<Protected><Broadcasting /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
