import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

/** Header mobile dengan tombol kembali untuk sub-halaman lapangan/gudang. */
export function MobileHeader({ title, back = '/sales', color = '#1e3a8a' }: { title: string; back?: string; color?: string }) {
  const nav = useNavigate();
  return (
    <header style={{ background: color, color: '#fff', padding: '14px 12px', paddingTop: 'calc(14px + env(safe-area-inset-top))', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 20 }}>
      <button onClick={() => nav(back)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, padding: 0, cursor: 'pointer' }}>‹</button>
      <strong style={{ fontSize: 17 }}>{title}</strong>
    </header>
  );
}

export function MobilePage({ title, back, color, children }: { title: string; back?: string; color?: string; children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', paddingBottom: 'calc(24px + env(safe-area-inset-bottom))' }}>
      <MobileHeader title={title} back={back} color={color} />
      <div style={{ padding: 14 }}>{children}</div>
    </div>
  );
}
