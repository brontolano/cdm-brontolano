-- Akun konsumen katalog publik (login opsional via nomor WhatsApp + password).
-- Terpisah dari tabel `konsumen` (yang dikelola staf) & `users` (staf internal).
CREATE TABLE IF NOT EXISTS konsumen_auth (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  no_wa         VARCHAR(25) UNIQUE NOT NULL,   -- dinormalisasi ke format 08xxxx
  nama          VARCHAR(120) NOT NULL,
  password_hash TEXT NOT NULL,
  konsumen_id   UUID REFERENCES konsumen(id),  -- terisi bila admin menautkan ke toko terdaftar
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_konsumen_auth_wa ON konsumen_auth(no_wa);

-- Tautkan pesanan katalog ke akun konsumen (opsional; pesanan tanpa login tetap jalan).
ALTER TABLE pesanan_masuk ADD COLUMN IF NOT EXISTS konsumen_auth_id UUID REFERENCES konsumen_auth(id);
CREATE INDEX IF NOT EXISTS idx_pesanan_konsumen_auth ON pesanan_masuk(konsumen_auth_id);

-- Metode pembayaran terpilih saat checkout (default COD). Dipakai katalog + Fase 4.
ALTER TABLE pesanan_masuk ADD COLUMN IF NOT EXISTS metode_bayar VARCHAR(20) NOT NULL DEFAULT 'cod';
