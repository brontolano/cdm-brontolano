import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, homePathFor } from '../store/auth';
import { apiError } from '../api/client';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@cdm.test');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const u = await login(email, password);
      navigate(homePathFor(u.role));
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/brontolano-mark.png" alt="" style={{ height: 30, width: 'auto' }} />
          <span>Brontolano</span>
        </h1>
        <p>Masuk untuk kelola konsumen, order &amp; pengiriman toko Anda</p>
        <div className="field">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div className="field">
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </div>
        {error && <div className="field err" style={{ marginBottom: 10 }}>{error}</div>}
        <button className="btn" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Memproses…' : 'Masuk'}
        </button>
        <p style={{ marginTop: 16, fontSize: 12 }}>
          Demo: admin@cdm.test · lapangan@cdm.test · gudang@cdm.test · management@cdm.test<br />
          Password semua: <b>password123</b>
        </p>
      </form>
    </div>
  );
}
