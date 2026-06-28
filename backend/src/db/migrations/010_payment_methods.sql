-- Metode pembayaran katalog — bisa di-toggle aktif/nonaktif dari panel admin.
CREATE TABLE IF NOT EXISTS payment_methods (
  kode       VARCHAR(20) PRIMARY KEY,        -- cod | qris | transfer | va | card
  label      VARCHAR(60) NOT NULL,
  deskripsi  VARCHAR(120) NOT NULL DEFAULT '',
  enabled    BOOLEAN NOT NULL DEFAULT true,
  is_primary BOOLEAN NOT NULL DEFAULT false,  -- COD = utama
  butuh_gateway BOOLEAN NOT NULL DEFAULT false, -- QRIS/VA perlu gateway terkonfigurasi
  urutan     INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default (idempoten). COD utama & aktif; kartu nonaktif.
INSERT INTO payment_methods (kode, label, deskripsi, enabled, is_primary, butuh_gateway, urutan) VALUES
  ('cod',      'COD — Bayar di Tempat', 'Tunai saat barang tiba',           true,  true,  false, 1),
  ('qris',     'QRIS',                  'Scan QR · semua e-wallet & bank',  true,  false, true,  2),
  ('transfer', 'Transfer Bank',         'BCA · BRI · Mandiri',              true,  false, false, 3),
  ('va',       'Virtual Account',       'Pembayaran VA otomatis',           true,  false, true,  4),
  ('card',     'Kartu Kredit/Debit',    'Dinonaktifkan oleh admin',         false, false, true,  5)
ON CONFLICT (kode) DO NOTHING;
