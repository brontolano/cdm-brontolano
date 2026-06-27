# Deploy CDM Brontolano ke VPS Hostinger (coexist dgn pesantren)

VPS: `srv1654110` · IP **187.77.116.167** · Ubuntu + Docker.
Stack ini pakai **port terpisah (8080–8092)** — TIDAK menyentuh port 80/443 milik pesantren.

## Langkah (jalankan di VPS via SSH / Browser Terminal Hostinger)

```bash
# 1. Masuk folder & clone repo (login GitHub bila diminta — repo privat)
mkdir -p /opt && cd /opt
git clone https://github.com/brontolano/cdm-brontolano.git
cd cdm-brontolano

# 2. Siapkan .env
cp .env.docker.example .env
nano .env     # WAJIB: ganti JWT_ACCESS_SECRET & JWT_REFRESH_SECRET (acak panjang)
              # set SEED_ON_START=true  (agar ada data contoh utk demo)
              # set WA_ORDER_NUMBER=628557271197
              # set CORS_ORIGIN=http://187.77.116.167:8080

# 3. Build & jalankan (butuh beberapa menit pertama kali)
docker compose up -d --build

# 4. Cek status
docker compose ps
```

## Akses setelah jalan
| App | URL |
|-----|-----|
| POS / Admin | http://187.77.116.167:8080 |
| Katalog konsumen | http://187.77.116.167:8090 |
| **PWA Lapangan** | http://187.77.116.167:8091 |
| **PWA Gudang** | http://187.77.116.167:8092 |

Login admin: `admin@cdm.test` / `password123` (ganti setelah demo via menu Manajemen User).

## Firewall
Port 8080–8092 perlu dibuka di firewall VPS. Saya bisa bukakan dari sini lewat Hostinger (konfirmasi dulu).

## Update versi berikutnya
```bash
cd /opt/cdm-brontolano && git pull && docker compose up -d --build
```

## Catatan keamanan
- Ini akses HTTP (belum HTTPS). Untuk produksi sebenarnya, arahkan subdomain
  (pos./katalog.brontolano.com) lewat Caddy pesantren yang sudah ada → HTTPS + bisa install PWA.
- Jangan lupa ganti semua secret & password demo sebelum dipakai nyata.
- Stack ini terpisah penuh dari `pesantren-platform`; menghapusnya: `docker compose down` di folder ini.
