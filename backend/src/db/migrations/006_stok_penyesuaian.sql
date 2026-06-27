-- Izinkan tipe 'penyesuaian' (stok opname) di stok_history.
-- 'penyesuaian' = 11 char, jadi lebarkan kolom dulu (sebelumnya VARCHAR(10)).
ALTER TABLE stok_history ALTER COLUMN tipe TYPE VARCHAR(20);
ALTER TABLE stok_history DROP CONSTRAINT IF EXISTS stok_history_tipe_check;
ALTER TABLE stok_history ADD CONSTRAINT stok_history_tipe_check
  CHECK (tipe IN ('masuk','keluar','penyesuaian'));
