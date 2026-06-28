-- Backfill: akun konsumen katalog (konsumen_auth) yang belum tertaut ke tabel konsumen
-- dibuatkan record konsumen agar muncul di admin "Data Konsumen".
INSERT INTO konsumen (nama_toko, nama_pemilik, kontak_wa, alamat_lengkap, status)
SELECT ka.nama, ka.nama, ka.no_wa, 'Belum diisi (daftar via katalog)', 'aktif'
FROM konsumen_auth ka
WHERE ka.konsumen_id IS NULL
  AND NOT EXISTS (SELECT 1 FROM konsumen k WHERE k.kontak_wa = ka.no_wa);

-- Tautkan konsumen_auth ke record konsumen yang cocok nomornya.
UPDATE konsumen_auth ka
SET konsumen_id = k.id, updated_at = now()
FROM konsumen k
WHERE ka.konsumen_id IS NULL AND k.kontak_wa = ka.no_wa;
