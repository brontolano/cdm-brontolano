import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { api, apiError } from '../api/client';
import { useAuth } from '../store/auth';
import { useToast } from '../store/toast';
import { Modal, Badge, Spinner, EmptyState } from '../components/ui';

const ROLES = ['lapangan', 'gudang', 'admin', 'management'];
const empty = { email: '', password: '', nama_lengkap: '', role: 'lapangan' };

export default function Users() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(empty);
  const [pwUser, setPwUser] = useState<any>(null);
  const [pw, setPw] = useState('');

  async function load() {
    setLoading(true);
    try { setList((await api.get('/users')).data.data); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editId) await api.put(`/users/${editId}`, { nama_lengkap: form.nama_lengkap, role: form.role });
      else await api.post('/users', form);
      notify('success', editId ? 'User diperbarui' : 'User ditambahkan');
      setShowForm(false); load();
    } catch (err) { notify('error', apiError(err)); }
  }
  async function toggleStatus(u: any) {
    try {
      await api.put(`/users/${u.id}`, { status: u.status === 'active' ? 'inactive' : 'active' });
      notify('success', 'Status diperbarui'); load();
    } catch (err) { notify('error', apiError(err)); }
  }
  async function resetPw(e: React.FormEvent) {
    e.preventDefault();
    try { await api.put(`/users/${pwUser.id}/password`, { password: pw }); notify('success', 'Password direset'); setPwUser(null); setPw(''); }
    catch (err) { notify('error', apiError(err)); }
  }

  return (
    <div>
      <div className="toolbar">
        <h2>Manajemen User</h2>
        <button className="btn" onClick={() => { setForm(empty); setEditId(null); setShowForm(true); }}><Plus size={16} aria-hidden /> User</button>
      </div>
      <div className="card" style={{ padding: 0 }}>
        {loading ? <Spinner /> : list.length === 0 ? <EmptyState message="Belum ada user." /> : (
          <table>
            <thead><tr><th>Nama</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.id}>
                  <td>{u.nama_lengkap}{u.id === user?.id && <span className="muted"> (Anda)</span>}</td>
                  <td>{u.email}</td>
                  <td><Badge value={u.role} /></td>
                  <td><Badge value={u.status === 'active' ? 'aktif' : 'tidak_aktif'} /></td>
                  <td className="right">
                    <button className="btn secondary small" onClick={() => { setForm({ ...u, password: '' }); setEditId(u.id); setShowForm(true); }}>Edit</button>
                    <button className="btn secondary small" style={{ marginLeft: 6 }} onClick={() => setPwUser(u)}>Reset PW</button>
                    {u.id !== user?.id && <button className="btn secondary small" style={{ marginLeft: 6 }} onClick={() => toggleStatus(u)}>{u.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <Modal title={editId ? 'Edit User' : 'Tambah User'} onClose={() => setShowForm(false)}>
          <form onSubmit={save}>
            <div className="field"><label>Nama Lengkap</label><input value={form.nama_lengkap} onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })} required /></div>
            {!editId && <div className="field"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>}
            {!editId && <div className="field"><label>Password (min 6)</label><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>}
            <div className="field"><label>Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn secondary" onClick={() => setShowForm(false)}>Batal</button>
              <button className="btn">Simpan</button>
            </div>
          </form>
        </Modal>
      )}

      {pwUser && (
        <Modal title={`Reset Password — ${pwUser.nama_lengkap}`} onClose={() => setPwUser(null)}>
          <form onSubmit={resetPw}>
            <div className="field"><label>Password Baru (min 6)</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required /></div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn secondary" onClick={() => setPwUser(null)}>Batal</button>
              <button className="btn">Reset</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
