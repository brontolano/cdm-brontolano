import { NavLink, useLocation } from 'react-router-dom';
import { Home, Truck, ShoppingCart, Store, Package, ArrowDownToLine, ArrowUpFromLine, User, type LucideIcon } from 'lucide-react';
import { useAuth } from '../../store/auth';
import './staff.css';

interface Tab { to: string; label: string; icon: LucideIcon; end?: boolean; }

const LAPANGAN: Tab[] = [
  { to: '/sales', label: 'Beranda', icon: Home, end: true },
  { to: '/sales/pengiriman', label: 'Rute', icon: Truck },
  { to: '/sales/pos', label: 'Order', icon: ShoppingCart },
  { to: '/sales/konsumen', label: 'Konsumen', icon: Store },
  { to: '/sales/akun', label: 'Akun', icon: User },
];
const GUDANG: Tab[] = [
  { to: '/gudang', label: 'Beranda', icon: Home, end: true },
  { to: '/gudang/masuk', label: 'Masuk', icon: ArrowDownToLine },
  { to: '/gudang/keluar', label: 'Keluar', icon: ArrowUpFromLine },
  { to: '/gudang/akun', label: 'Akun', icon: User },
];

/** Bottom tab nav untuk PWA staff (role-aware). */
export default function StaffBottomNav() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  // Tab ikut path (admin bisa preview kedua PWA); fallback ke role staff.
  const isGudang = pathname.startsWith('/gudang') || (!pathname.startsWith('/sales') && user?.role === 'gudang');
  const tabs = isGudang ? GUDANG : LAPANGAN;
  return (
    <nav className="stf__nav">
      {tabs.map((t) => {
        const I = t.icon;
        return (
          <NavLink key={t.to} to={t.to} end={t.end}
            className={({ isActive }) => 'stf__navitem' + (isActive ? ' is-active' : '')}>
            <I size={21} aria-hidden />
            <span>{t.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
