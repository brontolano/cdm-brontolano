#!/bin/sh
# Pastikan route Caddy untuk domain CDM (pos & katalog) selalu ada di container Caddy
# pesantren. Caddyfile pesantren baked di image → hilang tiap container restart.
# Skrip ini idempoten & self-healing: dijalankan cron, pasang ulang bila hilang.
#
# Pasang cron (sekali):
#   ( crontab -l 2>/dev/null | grep -v ensure-caddy-route.sh; \
#     echo "*/2 * * * * sh /opt/cdm-brontolano/scripts/ensure-caddy-route.sh >> /var/log/cdm-caddy.log 2>&1" ) | crontab -
set -e

CADDY="${CADDY_CONTAINER:-pesantren-app}"
CADDYFILE="${CADDYFILE_PATH:-/etc/caddy/Caddyfile}"

# Caddy harus satu network dengan stack CDM agar bisa resolve nama container.
NET=$(docker inspect cdm-frontend -f '{{range $k,$v := .NetworkSettings.Networks}}{{$k}}{{end}}' 2>/dev/null || true)
if [ -n "$NET" ]; then
  docker network connect "$NET" "$CADDY" 2>/dev/null || true
fi

# Sudah ada route? tidak perlu apa-apa.
if docker exec "$CADDY" sh -c "grep -q 'pos.brontolano.com' $CADDYFILE" 2>/dev/null; then
  exit 0
fi

echo "$(date '+%F %T') Route CDM tidak ada di Caddyfile — memasang ulang…"

# Frontend & katalog listen di port 80 di dalam network (host map 8080/8090 utk akses luar).
docker exec -i "$CADDY" sh -c "cat >> $CADDYFILE" <<'EOF'

pos.brontolano.com {
    reverse_proxy cdm-frontend:80
}
katalog.brontolano.com {
    reverse_proxy cdm-katalog:80
}
EOF

# Reload (FrankenPHP pakai binary `frankenphp`; fallback ke `caddy`).
docker exec "$CADDY" frankenphp reload --config "$CADDYFILE" --adapter caddyfile 2>/dev/null \
  || docker exec "$CADDY" caddy reload --config "$CADDYFILE" --adapter caddyfile

echo "$(date '+%F %T') Route CDM dipasang ulang & Caddy reload."
