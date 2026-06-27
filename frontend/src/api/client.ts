import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const api = axios.create({ baseURL: API_URL });

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}
export function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('accessToken');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

let refreshing: Promise<string> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const refreshToken = localStorage.getItem('refreshToken');
    if (error.response?.status === 401 && refreshToken && !original._retry) {
      original._retry = true;
      try {
        if (!refreshing) {
          refreshing = axios
            .post(`${API_URL}/auth/refresh`, { refreshToken })
            .then((r) => {
              const { accessToken, refreshToken: newRt } = r.data.data;
              setTokens(accessToken, newRt);
              return accessToken as string;
            })
            .finally(() => {
              refreshing = null;
            });
        }
        const newToken = await refreshing;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        clearTokens();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/** Extract a human-readable error message from an axios error, including field-level validation details. */
export function apiError(err: any): string {
  const e = err?.response?.data?.error;
  if (e?.details && Array.isArray(e.details) && e.details.length) {
    return e.details.map((d: any) => (d.field ? `${d.field}: ${d.message}` : d.message)).join('; ');
  }
  return e?.message || err?.message || 'Terjadi kesalahan';
}
