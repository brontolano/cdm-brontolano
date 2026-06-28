#!/bin/sh
# Hapus data contoh dari database. Jalankan di VPS, di folder repo.
# PENTING: pastikan SEED_ON_START=false di .env dulu, agar data demo tak tertanam ulang.
set -e
cd "${REPO_DIR:-/opt/cdm-brontolano}"

echo "⚠️  Menghapus data contoh (user @cdm.test, konsumen & barang seed, semua transaksi, akun uji)…"
docker compose exec -T db sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < scripts/hapus-data-contoh.sql
echo "✅ Selesai. Pastikan SEED_ON_START=false di .env agar tidak muncul lagi setelah rebuild."
