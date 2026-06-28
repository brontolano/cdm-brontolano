import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../db/pool';
import { config } from '../../config';
import { errors } from '../../utils/http';

export interface KonsumenAuthUser {
  kid: string;       // konsumen_auth.id
  no_wa: string;
  nama: string;
  kind: 'konsumen';
}

interface Row {
  id: string;
  no_wa: string;
  nama: string;
  password_hash: string;
}

/** Normalisasi nomor WA Indonesia ke format 08xxxxxxxxxx. */
export function normalizeWa(input: string): string {
  let d = (input || '').replace(/\D/g, '');
  if (d.startsWith('62')) d = '0' + d.slice(2);
  else if (d.startsWith('8')) d = '0' + d;
  return d;
}

function signToken(u: KonsumenAuthUser) {
  return jwt.sign(u, config.jwt.konsumenSecret, { expiresIn: config.jwt.konsumenExpires } as jwt.SignOptions);
}

function toUser(r: Pick<Row, 'id' | 'no_wa' | 'nama'>): KonsumenAuthUser {
  return { kid: r.id, no_wa: r.no_wa, nama: r.nama, kind: 'konsumen' };
}

export async function register(input: { nama: string; no_wa: string; password: string }) {
  const no_wa = normalizeWa(input.no_wa);
  if (no_wa.length < 9) throw errors.badRequest('Nomor WhatsApp tidak valid');
  const existing = await query<Row>('SELECT id FROM konsumen_auth WHERE no_wa=$1', [no_wa]);
  if (existing.rowCount) throw errors.conflict('Nomor WhatsApp sudah terdaftar');

  // Jadikan konsumen: pakai record yang sudah ada (nomor cocok) atau buat baru,
  // agar konsumen yang daftar mandiri muncul di admin "Data Konsumen".
  const variants = [no_wa, '+62' + no_wa.slice(1), '62' + no_wa.slice(1)];
  let konsumenId: string;
  const found = await query<{ id: string }>('SELECT id FROM konsumen WHERE kontak_wa = ANY($1)', [variants]);
  if (found.rowCount) {
    konsumenId = found.rows[0].id;
  } else {
    const ins = await query<{ id: string }>(
      `INSERT INTO konsumen (nama_toko, nama_pemilik, kontak_wa, alamat_lengkap, status)
       VALUES ($1,$2,$3,$4,'aktif') RETURNING id`,
      [input.nama, input.nama, no_wa, 'Belum diisi (daftar via katalog)']
    );
    konsumenId = ins.rows[0].id;
  }

  const hash = bcrypt.hashSync(input.password, 10);
  const res = await query<Row>(
    `INSERT INTO konsumen_auth (no_wa, nama, password_hash, konsumen_id) VALUES ($1,$2,$3,$4)
     RETURNING id, no_wa, nama`,
    [no_wa, input.nama, hash, konsumenId]
  );
  const user = toUser(res.rows[0]);
  return { user, token: signToken(user) };
}

export async function login(no_wa_input: string, password: string) {
  const no_wa = normalizeWa(no_wa_input);
  const res = await query<Row>('SELECT * FROM konsumen_auth WHERE no_wa=$1', [no_wa]);
  const r = res.rows[0];
  if (!r || !bcrypt.compareSync(password, r.password_hash)) {
    throw errors.unauthorized('Nomor WhatsApp atau password salah');
  }
  const user = toUser(r);
  return { user, token: signToken(user) };
}

export interface ProfileInput {
  nama?: string; nama_toko?: string; alamat_lengkap?: string; kota?: string;
  latitude?: number | null; longitude?: number | null; foto_toko?: string | null; foto_ktp?: string | null;
}

/** Profil konsumen (akun + record konsumen tertaut) untuk prefill form Akun Saya. */
export async function getProfile(kid: string) {
  const r = await query(
    `SELECT ka.nama AS akun_nama, ka.no_wa,
            k.id AS konsumen_id, k.nama_toko, k.nama_pemilik, k.alamat_lengkap, k.kota,
            k.latitude, k.longitude, k.foto_toko, k.foto_ktp
     FROM konsumen_auth ka LEFT JOIN konsumen k ON k.id = ka.konsumen_id WHERE ka.id=$1`,
    [kid]
  );
  return r.rows[0] || null;
}

/** Update profil konsumen dari PWA katalog → memperbarui record konsumen tertaut. */
export async function updateProfile(kid: string, no_wa: string, d: ProfileInput) {
  const ka = await query<{ konsumen_id: string | null; nama: string }>('SELECT konsumen_id, nama FROM konsumen_auth WHERE id=$1', [kid]);
  if (!ka.rowCount) throw errors.notFound('Akun tidak ditemukan');
  let konsumenId = ka.rows[0].konsumen_id;
  const nama = (d.nama && d.nama.trim()) || ka.rows[0].nama;
  if (!konsumenId) {
    const ins = await query<{ id: string }>(
      `INSERT INTO konsumen (nama_toko, nama_pemilik, kontak_wa, alamat_lengkap, status)
       VALUES ($1,$2,$3,$4,'aktif') RETURNING id`,
      [d.nama_toko || nama, nama, no_wa, d.alamat_lengkap || 'Belum diisi (daftar via katalog)']
    );
    konsumenId = ins.rows[0].id;
    await query('UPDATE konsumen_auth SET konsumen_id=$1 WHERE id=$2', [konsumenId, kid]);
  }
  await query(
    `UPDATE konsumen SET
       nama_toko = COALESCE(NULLIF($1,''), nama_toko),
       nama_pemilik = $2,
       alamat_lengkap = COALESCE(NULLIF($3,''), alamat_lengkap),
       kota = COALESCE($4, kota),
       latitude = COALESCE($5, latitude),
       longitude = COALESCE($6, longitude),
       foto_toko = COALESCE($7, foto_toko),
       foto_ktp = COALESCE($8, foto_ktp),
       updated_at = now()
     WHERE id=$9`,
    [d.nama_toko ?? null, nama, d.alamat_lengkap ?? null, d.kota ?? null, d.latitude ?? null, d.longitude ?? null, d.foto_toko ?? null, d.foto_ktp ?? null, konsumenId]
  );
  if (d.nama && d.nama.trim()) await query('UPDATE konsumen_auth SET nama=$1, updated_at=now() WHERE id=$2', [d.nama.trim(), kid]);
  return getProfile(kid);
}

/** Riwayat pesanan katalog milik konsumen (dicocokkan via konsumen_auth_id atau no_wa). */
export async function listOrders(kid: string, no_wa: string) {
  const res = await query(
    `SELECT id, total, status, items, alamat, metode_bayar, created_at
       FROM pesanan_masuk
      WHERE konsumen_auth_id = $1 OR kontak_wa = $2
      ORDER BY created_at DESC
      LIMIT 50`,
    [kid, no_wa]
  );
  return res.rows;
}
