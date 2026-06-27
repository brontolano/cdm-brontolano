-- Consumer Data Manager — initial schema (8 tables)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. users
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nama_lengkap  VARCHAR(150) NOT NULL,
  role          VARCHAR(20) NOT NULL CHECK (role IN ('lapangan','gudang','admin','management')),
  status        VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. konsumen
CREATE TABLE IF NOT EXISTS konsumen (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_toko      VARCHAR(100) NOT NULL,
  nama_pemilik   VARCHAR(100) NOT NULL,
  kontak_wa      VARCHAR(25) UNIQUE NOT NULL,
  alamat_lengkap TEXT NOT NULL,
  latitude       DOUBLE PRECISION,
  longitude      DOUBLE PRECISION,
  kota           VARCHAR(100),
  status         VARCHAR(20) NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif','tidak_aktif')),
  created_by     UUID REFERENCES users(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_kontak_wa ON konsumen(kontak_wa);
CREATE INDEX IF NOT EXISTS idx_status_city ON konsumen(status, kota);
CREATE INDEX IF NOT EXISTS idx_location ON konsumen(latitude, longitude);

-- 3. barang
CREATE TABLE IF NOT EXISTS barang (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_barang   VARCHAR(150) UNIQUE NOT NULL,
  kategori      VARCHAR(100),
  hpp           NUMERIC(14,2) NOT NULL DEFAULT 0,
  harga_jual    NUMERIC(14,2) NOT NULL DEFAULT 0,
  stok_saat_ini INTEGER NOT NULL DEFAULT 0 CHECK (stok_saat_ini >= 0),
  stok_minimum  INTEGER NOT NULL DEFAULT 5,
  unit          VARCHAR(20) NOT NULL DEFAULT 'pcs',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. orders
CREATE TABLE IF NOT EXISTS orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor_order   VARCHAR(30) UNIQUE NOT NULL,
  konsumen_id   UUID NOT NULL REFERENCES konsumen(id),
  total_harga   NUMERIC(14,2) NOT NULL DEFAULT 0,
  status        VARCHAR(20) NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft','confirmed','proses','dikirim','selesai','dibatalkan')),
  tanggal_order DATE NOT NULL DEFAULT CURRENT_DATE,
  catatan       TEXT,
  created_by    UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_konsumen ON orders(konsumen_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 5. order_items
CREATE TABLE IF NOT EXISTS order_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  barang_id    UUID NOT NULL REFERENCES barang(id),
  jumlah       INTEGER NOT NULL CHECK (jumlah > 0),
  harga_satuan NUMERIC(14,2) NOT NULL,
  subtotal     NUMERIC(14,2) NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- 6. invoices
CREATE TABLE IF NOT EXISTS invoices (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor_invoice       VARCHAR(30) UNIQUE NOT NULL,
  order_id            UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  total               NUMERIC(14,2) NOT NULL,
  jumlah_dibayar      NUMERIC(14,2) NOT NULL DEFAULT 0,
  status_pembayaran   VARCHAR(20) NOT NULL DEFAULT 'belum'
                      CHECK (status_pembayaran IN ('belum','sebagian','lunas')),
  tanggal_invoice     DATE NOT NULL DEFAULT CURRENT_DATE,
  tanggal_jatuh_tempo DATE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. stok_history
CREATE TABLE IF NOT EXISTS stok_history (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barang_id  UUID NOT NULL REFERENCES barang(id),
  tipe       VARCHAR(10) NOT NULL CHECK (tipe IN ('masuk','keluar')),
  jumlah     INTEGER NOT NULL,
  keterangan VARCHAR(255),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_stok_history_barang ON stok_history(barang_id);

-- 8. pengiriman
CREATE TABLE IF NOT EXISTS pengiriman (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rute                 JSONB NOT NULL DEFAULT '[]',
  order_ids            JSONB NOT NULL DEFAULT '[]',
  driver_assignment    VARCHAR(100),
  status               VARCHAR(20) NOT NULL DEFAULT 'planning'
                       CHECK (status IN ('planning','in_transit','completed','delayed')),
  total_jarak_km       NUMERIC(10,2),
  tanggal_pengiriman   DATE NOT NULL DEFAULT CURRENT_DATE,
  estimated_completion TIMESTAMPTZ,
  actual_completion    TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- broadcast (history log) — supports Feature 5 WhatsApp
CREATE TABLE IF NOT EXISTS broadcasts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pesan       TEXT NOT NULL,
  penerima    JSONB NOT NULL DEFAULT '[]',
  total_target INTEGER NOT NULL DEFAULT 0,
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
