import { useNavigate } from 'react-router-dom';
import { PackagePlus, PackageMinus, LogOut, ChevronRight, type LucideIcon } from 'lucide-react';
import { useAuth } from '../../store/auth';

const MENU: { path: string; icon: LucideIcon; label: string; desc: string }[] = [
  { path: '/gudang/masuk', icon: PackagePlus, label: 'Barang Masuk', desc: 'Foto nota + stok + HPP' },
  { path: '/gudang/keluar', icon: PackageMinus, label: 'Barang Keluar', desc: 'Catat keluar manual + alasan' },
];

export default function GudangHome() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', paddingBottom: 24 }}>
      <header style={{ background: '#c2410c', color: '#fff', padding: 16, paddingTop: 'calc(16px + env(safe-area-inset-top))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/brontolano-mark.png" alt="" style={{ height: 30, width: 'auto' }} />
          <div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>Staff Gudang · Brontolano</div>
            <strong style={{ fontSize: 18 }}>{user?.nama_lengkap}</strong>
          </div>
        </div>
        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.2)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', fontWeight: 600 }}><LogOut size={15} aria-hidden /> Keluar</button>
      </header>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MENU.map((m) => {
          const Icon = m.icon;
          return (
            <button key={m.path} onClick={() => nav(m.path)} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 18, textAlign: 'left', cursor: 'pointer' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 12, background: '#fff7ed', color: '#c2410c', flexShrink: 0 }}><Icon size={24} aria-hidden /></span>
              <span style={{ flex: 1 }}>
                <span style={{ display: 'block', fontWeight: 700, fontSize: 16 }}>{m.label}</span>
                <span style={{ display: 'block', color: '#64748b', fontSize: 13 }}>{m.desc}</span>
              </span>
              <ChevronRight size={22} color="#cbd5e1" aria-hidden />
            </button>
          );
        })}
      </div>
    </div>
  );
}
