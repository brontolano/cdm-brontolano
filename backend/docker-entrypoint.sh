#!/bin/sh
set -e

echo "⏳ Menjalankan migrasi database..."
node dist/db/migrate.js

if [ "$SEED_ON_START" = "true" ]; then
  echo "🌱 Menjalankan seed data awal..."
  node dist/db/seed.js || echo "⚠️  Seed dilewati (mungkin data sudah ada)."
fi

echo "🚀 Menjalankan server..."
exec node dist/server.js
