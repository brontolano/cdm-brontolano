-- Adaptasi tabel barang ke model grosir Brontolano:
-- SKU, kemasan (ukuran/type/isi), dan harga grosir 5-tier.
ALTER TABLE barang ADD COLUMN IF NOT EXISTS sku        VARCHAR(50);
ALTER TABLE barang ADD COLUMN IF NOT EXISTS ukuran     VARCHAR(30);   -- satuan besar: Karton/Dus
ALTER TABLE barang ADD COLUMN IF NOT EXISTS type_kemasan VARCHAR(30); -- Botol/Pouch/Renceng/Pcs
ALTER TABLE barang ADD COLUMN IF NOT EXISTS isi_karton INTEGER;       -- jumlah per karton/dus
ALTER TABLE barang ADD COLUMN IF NOT EXISTS isi_pcs    INTEGER;       -- jumlah pcs

-- Harga grosir berjenjang (per satuan jual). NULL = tier tidak dipakai.
ALTER TABLE barang ADD COLUMN IF NOT EXISTS harga_het NUMERIC(14,2);  -- 1-5
ALTER TABLE barang ADD COLUMN IF NOT EXISTS harga_s1  NUMERIC(14,2);  -- 6-9
ALTER TABLE barang ADD COLUMN IF NOT EXISTS harga_s2  NUMERIC(14,2);  -- 10-24
ALTER TABLE barang ADD COLUMN IF NOT EXISTS harga_s3  NUMERIC(14,2);  -- 25-150
ALTER TABLE barang ADD COLUMN IF NOT EXISTS harga_s4  NUMERIC(14,2);  -- >150

CREATE UNIQUE INDEX IF NOT EXISTS idx_barang_sku ON barang(sku) WHERE sku IS NOT NULL;

-- Backfill: jika tier HET kosong, pakai harga_jual lama sebagai HET.
UPDATE barang SET harga_het = harga_jual WHERE harga_het IS NULL AND harga_jual IS NOT NULL;
