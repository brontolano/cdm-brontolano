-- Batas HET (Harga Eceran Tertinggi) untuk komoditas ber-regulasi (mis. MinyaKita).
-- NULL = tidak diatur (harga bebas).
ALTER TABLE barang ADD COLUMN IF NOT EXISTS batas_het NUMERIC(14,2);
