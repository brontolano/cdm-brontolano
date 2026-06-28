#!/bin/sh
# Auto-deploy CDM Brontolano: cek update dari GitHub, rebuild bila ada perubahan.
# Dipanggil oleh cron. Aman dijalankan berulang (idempoten).
set -e
REPO_DIR="${REPO_DIR:-/opt/cdm-brontolano}"
cd "$REPO_DIR" || exit 1

git fetch --quiet origin main
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
  echo "$(date '+%F %T') Update terdeteksi ($LOCAL -> $REMOTE), deploy..."
  git pull --quiet origin main
  # Rebuild + (re)create container. Migrasi DB otomatis jalan di entrypoint
  # backend (node dist/db/migrate.js) saat container start — tak perlu tsx.
  docker compose up -d --build
  docker image prune -f >/dev/null 2>&1 || true
  # Pastikan route Caddy CDM terpasang setelah (re)create container.
  sh "$REPO_DIR/scripts/ensure-caddy-route.sh" >/dev/null 2>&1 || true
  echo "$(date '+%F %T') Deploy selesai."
else
  echo "$(date '+%F %T') Tidak ada update."
fi
# Selalu pastikan route Caddy hidup (self-heal walau tak ada update kode).
sh "$REPO_DIR/scripts/ensure-caddy-route.sh" >/dev/null 2>&1 || true
