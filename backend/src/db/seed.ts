import bcrypt from 'bcryptjs';
import { pool } from './pool';

async function seed() {
  const hash = (p: string) => bcrypt.hashSync(p, 10);

  // Users — one per role. Password = "password123" for all.
  const users = [
    ['lapangan@cdm.test', 'Budi Lapangan', 'lapangan'],
    ['gudang@cdm.test', 'Siti Gudang', 'gudang'],
    ['admin@cdm.test', 'Andi Admin', 'admin'],
    ['management@cdm.test', 'Dewi Manajemen', 'management'],
  ];
  for (const [email, nama, role] of users) {
    await pool.query(
      `INSERT INTO users (email, password_hash, nama_lengkap, role)
       VALUES ($1,$2,$3,$4) ON CONFLICT (email) DO NOTHING`,
      [email, hash('password123'), nama, role]
    );
  }

  // Barang
  const barang = [
    ['Beras Premium 5kg', 'Sembako', 55000, 65000, 100, 10, 'karung'],
    ['Minyak Goreng 2L', 'Sembako', 28000, 34000, 80, 10, 'pcs'],
    ['Gula Pasir 1kg', 'Sembako', 13000, 16000, 120, 15, 'pcs'],
    ['Telur Ayam 1kg', 'Protein', 25000, 30000, 60, 10, 'kg'],
    ['Kopi Sachet (renceng)', 'Minuman', 9000, 12000, 200, 20, 'renceng'],
  ];
  for (const [nama, kat, hpp, jual, stok, min, unit] of barang) {
    await pool.query(
      `INSERT INTO barang (nama_barang, kategori, hpp, harga_jual, stok_saat_ini, stok_minimum, unit)
       VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (nama_barang) DO NOTHING`,
      [nama, kat, hpp, jual, stok, min, unit]
    );
  }

  // Konsumen (around Soreang, Bandung)
  const lap = await pool.query(`SELECT id FROM users WHERE role='lapangan' LIMIT 1`);
  const createdBy = lap.rows[0]?.id ?? null;
  const konsumen = [
    ['Warung Bu Ani', 'Ani', '+6281200000001', 'Jl. Raya Soreang No. 1', -7.0289, 107.5198, 'Soreang'],
    ['Toko Pak Joko', 'Joko', '+6281200000002', 'Jl. Terusan Kopo No. 45', -7.0205, 107.5283, 'Soreang'],
    ['Grosir Makmur', 'Hendra', '+6281200000003', 'Jl. Gandasari No. 12', -7.0102, 107.5401, 'Katapang'],
    ['Warung Sederhana', 'Wati', '+6281200000004', 'Jl. Cingcin No. 8', -7.0350, 107.5150, 'Soreang'],
  ];
  for (const [toko, pemilik, wa, alamat, lat, lng, kota] of konsumen) {
    await pool.query(
      `INSERT INTO konsumen (nama_toko, nama_pemilik, kontak_wa, alamat_lengkap, latitude, longitude, kota, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (kontak_wa) DO NOTHING`,
      [toko, pemilik, wa, alamat, lat, lng, kota, createdBy]
    );
  }

  console.log('✅ Seed complete. Login: admin@cdm.test / password123 (also lapangan@, gudang@, management@)');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
