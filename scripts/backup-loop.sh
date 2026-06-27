#!/bin/sh
# Loop backup otomatis untuk container sidecar 'backup'.
# pg_dump database setiap BACKUP_INTERVAL detik, simpan ke /backups, retensi BACKUP_KEEP terbaru.
KEEP="${BACKUP_KEEP:-7}"
INTERVAL="${BACKUP_INTERVAL:-86400}"
PG_USER="${POSTGRES_USER:-postgres}"
PG_DB="${POSTGRES_DB:-consumer_data_manager}"

echo "Backup sidecar aktif: tiap ${INTERVAL}s, retensi ${KEEP}."
while true; do
  f="/backups/cdm_$(date +%Y%m%d_%H%M%S).sql.gz"
  if pg_dump -h db -U "$PG_USER" "$PG_DB" | gzip > "$f"; then
    echo "backup: $f"
  else
    echo "backup GAGAL"; rm -f "$f"
  fi
  ls -1t /backups/cdm_*.sql.gz 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -f
  sleep "$INTERVAL"
done
