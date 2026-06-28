-- Hapus data contoh (seed demo) + data uji. FK-aman.
-- DIPERTAHANKAN: superadmin admin@brontolano.com, konsumen/akun asli (mis. yang daftar via katalog),
--               metode pembayaran, dan catatan pengeluaran asli.
-- Catatan: jalankan SETELAH set SEED_ON_START=false agar tak tertanam ulang.
BEGIN;

-- 1) Semua data transaksi (demo & uji) — dikosongkan total
DELETE FROM stok_history;
DELETE FROM order_items;
DELETE FROM invoices;
DELETE FROM pengiriman;
DELETE FROM orders;
DELETE FROM pesanan_masuk;
DELETE FROM broadcasts;

-- 2) Akun konsumen uji ("Tes Cek")
DELETE FROM konsumen_auth WHERE no_wa = '080000000001';

-- 3) Konsumen demo (nomor WA seed) + konsumen uji
DELETE FROM konsumen WHERE kontak_wa IN
  ('+6281200000001','+6281200000002','+6281200000003','+6281200000004','080000000001');

-- 4) Barang demo (seed)
DELETE FROM barang WHERE nama_barang IN
  ('Beras Premium 5kg','Minyak Goreng 2L','Gula Pasir 1kg','Telur Ayam 1kg','Kopi Sachet (renceng)');

-- 5) Lepas referensi created_by ke user demo, lalu hapus user demo (@cdm.test).
--    Superadmin admin@brontolano.com TIDAK terpengaruh.
UPDATE konsumen SET created_by = NULL
  WHERE created_by IN (SELECT id FROM users WHERE email LIKE '%@cdm.test');
DELETE FROM users WHERE email LIKE '%@cdm.test';

COMMIT;
