-- Foto bukti nota (data URL base64) pada riwayat stok (barang masuk).
ALTER TABLE stok_history ADD COLUMN IF NOT EXISTS foto TEXT;
