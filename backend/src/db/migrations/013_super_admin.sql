-- 013 — Tambah role 'super_admin' (akses CRUD penuh ke semua modul)
-- Idempoten: aman dijalankan berulang oleh migrate.ts

-- 1. Perluas CHECK constraint role agar menerima 'super_admin'
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('lapangan','gudang','admin','management','super_admin'));

-- 2. Promote akun admin@brontolano.com menjadi super_admin (jika ada)
UPDATE users
   SET role = 'super_admin', updated_at = now()
 WHERE email = 'admin@brontolano.com';
