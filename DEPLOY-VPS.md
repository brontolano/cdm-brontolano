# Deploy CDM Brontolano ke VPS Hostinger (domain + HTTPS, coexist pesantren)

VPS: `srv1654110` · IP **187.77.116.167** · Ubuntu + Docker (Caddy pesantren memegang 80/443).

## Skema domain
| Domain / path | Diarahkan ke | Container |
|---------------|--------------|-----------|
| `pos.brontolano.com` | POS / Admin | frontend (port 8080) |
| `pos.brontolano.com/sales` | PWA Lapangan | (route di app yang sama) |
| `pos.brontolano.com/gudang` | PWA Gudang | (route di app yang sama) |
| `katalog.brontolano.com` | Katalog konsumen | katalog (port 8090) |

> `/sales` & `/gudang` adalah **route di dalam app POS** (satu SPA), jadi cukup arahkan
> `pos.brontolano.com` ke container frontend — keduanya otomatis terlayani.

## Langkah deploy (jalankan di VPS via SSH / Browser Terminal Hostinger)

```bash
# 1. Clone repo privat (login GitHub akun brontolano saat diminta)
mkdir -p /opt && cd /opt
git clone https://github.com/brontolano/cdm-brontolano.git
cd cdm-brontolano

# 2. Siapkan .env
cp .env.docker.example .env
nano .env
#   SEED_ON_START=true
#   WA_ORDER_NUMBER=628557271197
#   CORS_ORIGIN=https://pos.brontolano.com
#   ganti JWT_ACCESS_SECRET & JWT_REFRESH_SECRET (string acak panjang)

# 3. Jalankan stack (port 8080-8092, TIDAK menyentuh 80/443 pesantren)
docker compose up -d --build
docker compose ps
```

## Routing domain + HTTPS lewat Caddy pesantren
Caddy pesantren sudah memegang 80/443. Tambahkan 2 blok ke **Caddyfile** pesantren
(biasanya di `/opt/pesantren-platform/` atau config Caddy yang aktif), lalu reload Caddy.
Caddy akan **otomatis menerbitkan sertifikat HTTPS (Let's Encrypt)**:

```caddyfile
pos.brontolano.com {
    reverse_proxy localhost:8080
}

katalog.brontolano.com {
    reverse_proxy localhost:8090
}
```

Reload Caddy (contoh, sesuaikan dengan setup pesantren):
```bash
# jika Caddy berjalan sbg container pesantren-app:
docker exec <nama-container-caddy> caddy reload --config /etc/caddy/Caddyfile
# atau restart service-nya sesuai cara pesantren
```

> ⚠️ Hati-hati menyunting Caddyfile pesantren — backup dulu (`cp Caddyfile Caddyfile.bak`).
> Kalau ragu, kirim saya isi Caddyfile-nya, saya bantu sisipkan blok yang aman.

## DNS (sudah/akan diatur via Hostinger)
A record → 187.77.116.167:
- `pos.brontolano.com`
- `katalog.brontolano.com`

## Akses final
- POS/Admin: https://pos.brontolano.com (login `admin@cdm.test` / `password123`)
- PWA Lapangan: https://pos.brontolano.com/sales
- PWA Gudang: https://pos.brontolano.com/gudang
- Katalog: https://katalog.brontolano.com

Dengan HTTPS, PWA bisa **di-install** (Add to Home Screen) di HP.

## Update versi berikutnya
```bash
cd /opt/cdm-brontolano && git pull && docker compose up -d --build
```

## Catatan
- Stack terpisah penuh dari `pesantren-platform`. Hapus: `docker compose down` di folder ini.
- Ganti semua secret & password demo sebelum dipakai nyata.
