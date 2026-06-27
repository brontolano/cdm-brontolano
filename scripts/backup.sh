#!/bin/sh
# Backup database CDM Brontolano (PostgreSQL dalam container 'db').
# Jalankan dari folder root proyek: sh scripts/backup.sh
set -e

DIR="${BACKUP_DIR:-./backups}"
KEEP="${BACKUP_KEEP:-7}"          # simpan N backup terbaru
PG_USER="${POSTGRES_USER:-postgres}"
PG_DB="${POSTGRES_DB:-consumer_data_manager}"

mkdir -p "$DIR"
TS=$(date +%Y%m%d_%H%M%S)
FILE="$DIR/cdm_${TS}.sql.gz"

echo "Membuat backup -> $FILE"
docker compose exec -T db pg_dump -U "$PG_USER" "$PG_DB" | gzip > "$FILE"

# Retensi: hapus yang lebih lama dari N terbaru
ls -1t "$DIR"/cdm_*.sql.gz 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -f

echo "Selesai. Backup tersimpan di $DIR (retensi $KEEP terbaru)."
ls -1t "$DIR"/cdm_*.sql.gz 2>/dev/null | head -n "$KEEP"
