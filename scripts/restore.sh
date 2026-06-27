#!/bin/sh
# Restore database CDM Brontolano dari file backup .sql.gz.
# Pakai: sh scripts/restore.sh backups/cdm_YYYYMMDD_HHMMSS.sql.gz
set -e

FILE="$1"
PG_USER="${POSTGRES_USER:-postgres}"
PG_DB="${POSTGRES_DB:-consumer_data_manager}"

if [ -z "$FILE" ]; then
  echo "Usage: sh scripts/restore.sh <file.sql.gz>"
  echo "Backup tersedia:"
  ls -1t "${BACKUP_DIR:-./backups}"/cdm_*.sql.gz 2>/dev/null || echo "  (kosong)"
  exit 1
fi
if [ ! -f "$FILE" ]; then
  echo "File tidak ditemukan: $FILE"; exit 1
fi

echo "PERINGATAN: ini akan menimpa data di database '$PG_DB'."
printf "Ketik 'YA' untuk lanjut: "
read CONFIRM
[ "$CONFIRM" = "YA" ] || { echo "Dibatalkan."; exit 1; }

gunzip -c "$FILE" | docker compose exec -T db psql -U "$PG_USER" -d "$PG_DB"
echo "Restore selesai dari $FILE"
