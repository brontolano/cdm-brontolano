import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, Store, Wallet, Plus, Truck, MapPin, Package } from 'lucide-react';
import { useAuth } from '../../store/auth';
import { api } from '../../api/client';
import { rupiah } from '../../components/ds';
import { StatusBadge } from '../../components/ds';
import StaffBottomNav from '../staff/StaffBottomNav';
import '../staff/staff.css';

interface Tugas { id: string; nama_toko: string; alamat: string; status: string; }
interface Summary { orders_hari_ini: number; toko_hari_ini: number; omset_hari_ini: number; target_harian: number; progress_pct: number; tugas: Tugas[]; }

const rIngkas = (n: number) => n >= 1_000_000 ? 'Rp ' + (n / 1_000_000).toFixed(1).replace('.0', '') + ' jt' : rupiah(n);

export default function LapanganHome() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [s, setS] = useState<Summary | null>(null);

  useEffect(() => { api.get('/dashboard/staff-summary').then((r) => setS(r.data.data)).catch(() => setS(null)); }, []);

  const namaDepan = (user?.nama_lengkap || 'Staff').split(' ')[0];

  return (
    <div className="stf-has-nav" style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      <header className="stf__hero">
        <div className="stf__herotop">
          <div>
            <div className="stf__hello">Halo, {namaDepan}</div>
            <div className="stf__hsub">Staff Lapangan · Brontolano</div>
          </div>
          <span className="stf__sync"><span className="stf__syncdot" /> Tersinkron</span>
        </div>
        <div className="stf__progress">
          <div className="stf__progresshead">
            <span>Target Omset Hari Ini</span>
            <strong>{s?.progress_pct ?? 0}%</strong>
          </div>
          <div className="stf__bar"><div className="stf__barfill" style={{ width: `${s?.progress_pct ?? 0}%` }} /></div>
          <div className="stf__progressval">{rupiah(s?.omset_hari_ini ?? 0)} <span>dari {rIngkas(s?.target_harian ?? 0)}</span></div>
        </div>
      </header>

      <div className="stf__body2">
        <div className="stf__mini">
          <div className="stf__minicard"><Receipt size={18} aria-hidden /><strong>{s?.orders_hari_ini ?? 0}</strong><span>Order</span></div>
          <div className="stf__minicard"><Store size={18} aria-hidden /><strong>{s?.toko_hari_ini ?? 0}</strong><span>Toko</span></div>
          <div className="stf__minicard"><Wallet size={18} aria-hidden /><strong>{rIngkas(s?.omset_hari_ini ?? 0).replace('Rp ', '')}</strong><span>Setoran</span></div>
        </div>

        <div className="stf__quick">
          <button className="stf__qbtn" onClick={() => nav('/sales/pos')}><span className="stf__qic stf__qic--red"><Plus size={19} aria-hidden /></span>Order Baru</button>
          <button className="stf__qbtn" onClick={() => nav('/sales/konsumen')}><span className="stf__qic stf__qic--green"><Store size={19} aria-hidden /></span>Konsumen</button>
          <button className="stf__qbtn" onClick={() => nav('/sales/pengiriman')}><span className="stf__qic stf__qic--blue"><Truck size={19} aria-hidden /></span>Rute</button>
        </div>

        <div className="stf__sectionhead">
          <strong>Tugas Hari Ini</strong>
          <button className="stf__link" onClick={() => nav('/sales/pengiriman')}>Lihat semua</button>
        </div>
        <div className="stf__tasks">
          {s == null ? <div className="stf__emptytask">Memuat…</div>
            : s.tugas.length === 0 ? <div className="stf__emptytask">Belum ada tugas pengiriman.</div>
            : s.tugas.map((t) => (
              <button className="stf__task" key={t.id} onClick={() => nav('/sales/pengiriman')}>
                <span className={'stf__taskic stf__taskic--' + t.status}>{t.status === 'menunggu' ? <Package size={18} aria-hidden /> : <MapPin size={18} aria-hidden />}</span>
                <span className="stf__taskinfo">
                  <span className="stf__taskname">{t.nama_toko}</span>
                  <span className="stf__taskaddr">{t.alamat}</span>
                </span>
                <StatusBadge status={t.status === 'proses' ? 'dikirim' : t.status === 'selesai' ? 'selesai' : 'draft'}>{t.status}</StatusBadge>
              </button>
            ))}
        </div>
      </div>
      <StaffBottomNav />
    </div>
  );
}
