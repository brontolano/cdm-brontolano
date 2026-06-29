import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Boxes, Download } from 'lucide-react';
import { useAuth } from '../../store/auth';
import { usePwaInstall } from '../../utils/usePwaInstall';
import { api } from '../../api/client';
import StaffBottomNav from '../staff/StaffBottomNav';
import '../staff/staff.css';

interface Barang { id: string; nama_barang: string; stok_saat_ini: number; stok_minimum: number; unit: string; kategori: string | null; }

export default function GudangHome() {
  const { user } = useAuth();
  const { canInstall, install } = usePwaInstall();
  const nav = useNavigate();
  const [list, setList] = useState<Barang[] | null>(null);

  useEffect(() => { api.get('/inventory', { params: { limit: 300 } }).then((r) => setList(r.data.data)).catch(() => setList([])); }, []);

  const namaDepan = (user?.nama_lengkap || 'Staff').split(' ')[0];
  const low = (list || []).filter((b) => b.stok_saat_ini < b.stok_minimum);
  const kategori = new Set((list || []).map((b) => b.kategori).filter(Boolean)).size;

  return (
    <div className="stf-has-nav" style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      <header className="stf__hero">
        <div className="stf__herotop">
          <div>
            <div className="stf__hello">Halo, {namaDepan}</div>
            <div className="stf__hsub">Staff Gudang · Brontolano</div>
          </div>
          {canInstall
            ? <button className="stf__installchip" onClick={install}><Download size={14} aria-hidden /> Pasang</button>
            : <span className="stf__sync"><span className="stf__syncdot" /> Tersinkron</span>}
        </div>
      </header>

      <div className="stf__body2">
        <div className="stf__mini">
          <div className="stf__minicard"><Boxes size={18} aria-hidden /><strong>{list ? list.length : '—'}</strong><span>Barang</span></div>
          <div className="stf__minicard"><Package size={18} aria-hidden /><strong>{kategori}</strong><span>Kategori</span></div>
          <div className="stf__minicard"><AlertTriangle size={18} aria-hidden /><strong className={low.length ? 'is-warn' : ''}>{low.length}</strong><span>Restok</span></div>
        </div>

        <div className="stf__quick" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <button className="stf__qbtn" onClick={() => nav('/gudang/masuk')}><span className="stf__qic stf__qic--green"><ArrowDownToLine size={19} aria-hidden /></span>Stok Masuk</button>
          <button className="stf__qbtn" onClick={() => nav('/gudang/keluar')}><span className="stf__qic stf__qic--red"><ArrowUpFromLine size={19} aria-hidden /></span>Stok Keluar</button>
        </div>

        <div className="stf__sectionhead">
          <strong>Perlu Restok</strong>
          {low.length > 0 && <span className="stf__warnpill"><AlertTriangle size={13} aria-hidden /> {low.length}</span>}
        </div>
        <div className="stf__tasks">
          {list == null ? <div className="stf__emptytask">Memuat…</div>
            : low.length === 0 ? <div className="stf__emptytask">Semua stok aman. 👍</div>
            : low.map((b) => (
              <div className="stf__stokrow" key={b.id}>
                <span className="stf__stokinfo">
                  <span className="stf__taskname">{b.nama_barang}</span>
                  <span className="stf__taskaddr">Min. {b.stok_minimum} {b.unit}</span>
                </span>
                <span className="stf__stoknum">{b.stok_saat_ini}<span> {b.unit}</span></span>
                <button className="btn small" onClick={() => nav('/gudang/masuk')}>+ Masuk</button>
              </div>
            ))}
        </div>
      </div>
      <StaffBottomNav />
    </div>
  );
}
