-- Catatan pengeluaran / biaya operasional (perawatan kendaraan, BBM, upah bongkar muat, dll).
CREATE TABLE IF NOT EXISTS pengeluaran (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tanggal    DATE NOT NULL DEFAULT CURRENT_DATE,
  kategori   VARCHAR(40) NOT NULL DEFAULT 'lain',
  deskripsi  VARCHAR(200) NOT NULL DEFAULT '',
  jumlah     NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (jumlah >= 0),
  catatan    TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pengeluaran_tanggal ON pengeluaran(tanggal);
CREATE INDEX IF NOT EXISTS idx_pengeluaran_kategori ON pengeluaran(kategori);
