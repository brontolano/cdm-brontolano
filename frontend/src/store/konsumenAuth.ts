import axios from 'axios';

// Axios khusus akun konsumen katalog — token & penyimpanan terpisah dari staf,
// tanpa interceptor redirect-ke-/login (katalog itu surface publik).
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const KEY = 'konsumenToken';

export const katalogApi = axios.create({ baseURL: API_URL });
katalogApi.interceptors.request.use((cfg) => {
  const t = localStorage.getItem(KEY);
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export interface KonsumenUser { kid: string; no_wa: string; nama: string; kind: 'konsumen'; }
export interface KonsumenOrder {
  id: string; total: string | number; status: string; metode_bayar: string;
  alamat: string | null; items: any[]; created_at: string;
}

export function getToken() { return localStorage.getItem(KEY); }
function setToken(t: string) { localStorage.setItem(KEY, t); }
export function clearToken() { localStorage.removeItem(KEY); }

export async function register(nama: string, no_wa: string, password: string) {
  const r = await katalogApi.post('/konsumen-auth/register', { nama, no_wa, password });
  setToken(r.data.data.token);
  return r.data.data.user as KonsumenUser;
}
export async function login(no_wa: string, password: string) {
  const r = await katalogApi.post('/konsumen-auth/login', { no_wa, password });
  setToken(r.data.data.token);
  return r.data.data.user as KonsumenUser;
}
export async function fetchMe(): Promise<KonsumenUser | null> {
  if (!getToken()) return null;
  try { return (await katalogApi.get('/konsumen-auth/me')).data.data as KonsumenUser; }
  catch { clearToken(); return null; }
}
export async function fetchOrders(): Promise<KonsumenOrder[]> {
  try { return (await katalogApi.get('/konsumen-auth/orders')).data.data as KonsumenOrder[]; }
  catch { return []; }
}
