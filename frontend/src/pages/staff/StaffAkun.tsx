import { RefreshCw, Settings, Bell, LifeBuoy, Info, ChevronRight, LogOut, Download } from 'lucide-react';
import { useAuth } from '../../store/auth';
import { Button } from '../../components/ds';
import { usePwaInstall } from '../../utils/usePwaInstall';
import StaffBottomNav from './StaffBottomNav';
import './staff.css';

const MENU: [typeof Settings, string][] = [
  [Settings, 'Pengaturan'], [Bell, 'Notifikasi'], [LifeBuoy, 'Bantuan'], [Info, 'Tentang Aplikasi'],
];

/** Tab Akun PWA staff — profil + menu + keluar. */
export default function StaffAkun() {
  const { user, logout } = useAuth();
  const { canInstall, install } = usePwaInstall();
  const initials = (user?.nama_lengkap || 'U').split(/\s+/).slice(0, 2).map((s) => s[0]?.toUpperCase()).join('');
  const peran = user?.role === 'gudang' ? 'Staff Gudang' : 'Staff Lapangan';
  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }} className="stf-has-nav">
      <header className="stf__head"><strong>Akun</strong></header>
      <div className="stf__akunbody">
        <div className="stf__profile">
          <div className="stf__avatar">{initials}</div>
          <div><div className="stf__taskname">{user?.nama_lengkap}</div><div className="stf__taskaddr">{peran} · Brontolano</div></div>
        </div>
        <div className="stf__synccard"><RefreshCw size={16} aria-hidden /> <span>Tersinkron</span><span className="stf__online">● Online</span></div>
        {canInstall && (
          <Button variant="primary" block iconLeft={<Download size={17} />} onClick={install}>Pasang Aplikasi ke HP</Button>
        )}
        <div className="stf__menu">
          {MENU.map(([Icon, label]) => (
            <button className="stf__menuitem" key={label}>
              <Icon size={18} aria-hidden /><span>{label}</span><ChevronRight className="stf__menuchev" size={18} aria-hidden />
            </button>
          ))}
        </div>
        <Button variant="secondary" block iconLeft={<LogOut size={16} />} onClick={logout}>Keluar</Button>
      </div>
      <StaffBottomNav />
    </div>
  );
}
