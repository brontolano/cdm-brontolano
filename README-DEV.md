# Consumer Data Manager — Developer Guide (Lokal)

Aplikasi full-stack pengelola data konsumen warung/toko/grosir. Dibangun sesuai spesifikasi
5-bagian (lihat `00-Project-Brief.md` … `05-Integration-Breakdown.md`), berjalan **100% di lokal
tanpa biaya API**.

## Stack
- **Backend:** Node.js + Express + TypeScript + PostgreSQL (`pg`), JWT auth, Zod validation
- **Frontend:** React + Vite + TypeScript, React Router, axios, **Leaflet + OpenStreetMap** (peta gratis), **recharts** (grafik omset)
- **Integrasi tanpa biaya:**
  - Peta & GPS → Leaflet + OpenStreetMap (tanpa Google Maps API key)
  - Optimasi rute → algoritma **nearest-neighbour TSP** (Haversine) di backend
  - Broadcast WhatsApp → link **`wa.me`** click-to-chat (tanpa Twilio)

## Prasyarat
- Node.js 18+ (teruji di v24)
- PostgreSQL 14+ berjalan di `localhost:5432` (teruji di 17.7)

## Setup

### 1. Backend
```bash
cd backend
cp .env.example .env          # sesuaikan DATABASE_URL bila perlu
npm install
# Pastikan database 'consumer_data_manager' sudah ada:
#   psql -U postgres -c "CREATE DATABASE consumer_data_manager"
npm run migrate               # buat 8 tabel + broadcasts
npm run seed                  # isi user, barang, konsumen contoh
npm run dev                   # http://localhost:4000  (health: /health)
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev                   # http://localhost:5173
```

Buka http://localhost:5173 dan login.

## Akun Demo (password semua: `password123`)
| Email | Role | Akses utama |
|-------|------|-------------|
| admin@cdm.test | admin | Semua CRUD, order, invoice, harga, pengiriman |
| lapangan@cdm.test | lapangan | Input konsumen, broadcast, update status kirim |
| gudang@cdm.test | gudang | Stok masuk, lihat inventory |
| management@cdm.test | management | Read-only + dashboard/report |

## Struktur
```
backend/src
  config.ts, app.ts, server.ts
  db/         pool, migrations/001_init.sql, migrate.ts, seed.ts
  middleware/ auth.ts (JWT+rbac), error.ts
  utils/      http.ts, sequence.ts, routeOptimizer.ts (TSP), waLink.ts
  modules/    auth, konsumen, inventory, orders, invoices, pengiriman, broadcast, dashboard
frontend/src
  api/client.ts          axios + interceptor (JWT, auto-refresh on 401)
  store/                 auth.tsx, toast.tsx
  components/            ui.tsx, MapView.tsx (Leaflet)
  pages/                 Login, Dashboard, Konsumen, Inventory, Orders, Invoices, Pengiriman, Broadcasting
```

## Alur Bisnis Inti (semua di transaksi DB)
1. **Order** (admin): pilih konsumen + barang → cek stok → hitung total → **auto-generate invoice** (`INV-YYYY-NNN`, jatuh tempo +7 hari).
2. **Confirm order**: status→confirmed, **kurangi stok**, tulis `stok_history` (keluar), alert stok < minimum.
3. **Record payment**: status `belum`→`sebagian`→`lunas`; saat lunas, order→`selesai`.
4. **Pengiriman**: pilih order confirmed → **rute optimal nearest-neighbour** → tampil di peta.
5. **Broadcast**: pilih konsumen / semua → hasilkan link `wa.me` per konsumen + simpan riwayat.

## API (ringkas)
`/api/auth` (login, register, refresh, logout, me) · `/api/konsumen` · `/api/inventory`
(+`/:id/masuk`, `/:id/history`) · `/api/orders` (+`/:id/confirm`, `/cancel`, `/status`) ·
`/api/invoices` (+`/:id/payment`) · `/api/pengiriman` · `/api/broadcast` · `/api/dashboard`.
Format respons: `{ success, data, meta? }` atau `{ success:false, error:{ code, message } }`.

## 🐳 Jalankan dengan Docker (disarankan untuk pindah ke online)

Tidak perlu install Node/PostgreSQL manual — cukup **Docker Desktop**.

```bash
# Dari folder root (sejajar docker-compose.yml)
cp .env.docker.example .env      # sudah disediakan .env default juga
docker compose up -d --build     # build & jalankan 3 container

# Buka aplikasi:
#   http://localhost:8080
```

Perintah berguna:
```bash
docker compose logs -f backend   # lihat log backend (migrasi + seed)
docker compose ps                # status container
docker compose down              # stop (data DB tetap aman di volume)
docker compose down -v           # stop + HAPUS data DB (reset total)
```

**Arsitektur container:**
| Service | Image | Peran | Port |
|---------|-------|-------|------|
| `db` | postgres:17-alpine | Database (volume `cdm_pgdata`) | internal (tidak dipublish) |
| `backend` | build `./backend` | Express API + auto-migrate + seed | internal |
| `frontend` | build `./frontend` (nginx) | UI + reverse-proxy `/api` → backend | **8080** |

Frontend memakai path relatif `/api` (di-proxy nginx ke backend), jadi **portabel** —
saat dipindah online tidak perlu rebuild konfigurasi API.

### Persiapan ke versi online (produksi)
1. **Ganti semua secret** di `.env`: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (pakai string acak panjang).
2. Set `CORS_ORIGIN` ke domain asli, mis. `https://app.domain.com`.
3. Set `SEED_ON_START=false` setelah data nyata terisi (agar tidak menimpa/menambah data contoh).
4. Pasang **HTTPS** (mis. reverse-proxy Caddy/Traefik/nginx di depan, atau Cloudflare).
5. Backup berkala volume `cdm_pgdata` (mis. `docker compose exec db pg_dump ...`).
6. Deploy `docker-compose.yml` yang sama ke VPS/registry — image identik, hanya `.env` yang berbeda.

> Mode lokal tanpa Docker (Node + PostgreSQL host) tetap tersedia — lihat bagian **Setup** di atas.

## Catatan
- Skema enum & RBAC mengikuti `01-Backend-Breakdown.md` & `ARCHITECTURE-CHECKLIST.md`.
- Token: access 15m, refresh 7d; frontend auto-refresh saat 401.
- Untuk produksi: ganti semua secret di `.env`, aktifkan HTTPS, dan (opsional) upgrade broadcast ke `whatsapp-web.js` / API resmi.
```
