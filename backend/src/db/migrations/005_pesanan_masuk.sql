-- Pesanan masuk dari katalog konsumen (sebelum jadi Order resmi).
CREATE TABLE IF NOT EXISTS pesanan_masuk (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_pemesan VARCHAR(150) NOT NULL,
  kontak_wa    VARCHAR(25) NOT NULL,
  alamat       TEXT,
  catatan      TEXT,
  items        JSONB NOT NULL DEFAULT '[]',   -- [{barang_id, nama_barang, jumlah, harga_satuan, subtotal}]
  total        NUMERIC(14,2) NOT NULL DEFAULT 0,
  status       VARCHAR(20) NOT NULL DEFAULT 'baru'
               CHECK (status IN ('baru','diproses','selesai','batal')),
  order_id     UUID REFERENCES orders(id),     -- terisi jika sudah dikonversi jadi Order
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pesanan_status ON pesanan_masuk(status);
