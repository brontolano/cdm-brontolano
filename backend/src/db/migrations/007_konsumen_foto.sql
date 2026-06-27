-- Foto toko & foto KTP konsumen (data URL base64) untuk input staff lapangan.
ALTER TABLE konsumen ADD COLUMN IF NOT EXISTS foto_toko TEXT;
ALTER TABLE konsumen ADD COLUMN IF NOT EXISTS foto_ktp TEXT;
