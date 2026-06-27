-- Tambah kolom gambar (data URL base64) untuk barang
ALTER TABLE barang ADD COLUMN IF NOT EXISTS gambar TEXT;
