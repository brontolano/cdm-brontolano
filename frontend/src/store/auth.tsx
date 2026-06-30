import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, setTokens, clearTokens } from '../api/client';

export type Role = 'lapangan' | 'gudang' | 'admin' | 'management' | 'super_admin';
export interface User {
  id: string;
  email: string;
  role: Role;
  nama_lengkap: string;
}

/** Role admin penuh (admin biasa + super_admin) — dipakai untuk gating tombol aksi. */
export const isAdminLike = (role?: Role) => role === 'admin' || role === 'super_admin';
/** Super admin: akses CRUD penuh termasuk hapus data. */
export const isSuperAdmin = (role?: Role) => role === 'super_admin';

/** Halaman awal sesuai role: staff → PWA-nya, admin/manajemen → dashboard. */
export const homePathFor = (role: Role) =>
  role === 'lapangan' ? '/sales' : role === 'gudang' ? '/gudang' : '/';

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>(null as any);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((r) => setUser(r.data.data))
      .catch(() => clearTokens())
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const r = await api.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = r.data.data;
    setTokens(accessToken, refreshToken);
    setUser(user);
    return user as User;
  }

  function logout() {
    clearTokens();
    setUser(null);
    window.location.href = '/login';
  }

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
