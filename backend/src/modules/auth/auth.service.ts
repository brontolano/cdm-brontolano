import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../db/pool';
import { config } from '../../config';
import { errors } from '../../utils/http';
import type { AuthUser, Role } from '../../middleware/auth';

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  nama_lengkap: string;
  role: Role;
  status: string;
}

function signTokens(user: AuthUser) {
  const accessToken = jwt.sign(user, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpires } as jwt.SignOptions);
  const refreshToken = jwt.sign({ id: user.id }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpires,
  } as jwt.SignOptions);
  return { accessToken, refreshToken };
}

export async function register(input: {
  email: string;
  password: string;
  nama_lengkap: string;
  role: Role;
}) {
  const existing = await query<UserRow>('SELECT id FROM users WHERE email=$1', [input.email]);
  if (existing.rowCount) throw errors.conflict('Email sudah terdaftar');
  const hash = bcrypt.hashSync(input.password, 10);
  const res = await query<UserRow>(
    `INSERT INTO users (email, password_hash, nama_lengkap, role)
     VALUES ($1,$2,$3,$4) RETURNING id, email, nama_lengkap, role`,
    [input.email, hash, input.nama_lengkap, input.role]
  );
  const u = res.rows[0];
  const user: AuthUser = { id: u.id, email: u.email, role: u.role, nama_lengkap: u.nama_lengkap };
  return { user, ...signTokens(user) };
}

export async function login(email: string, password: string) {
  const res = await query<UserRow>('SELECT * FROM users WHERE email=$1', [email]);
  const u = res.rows[0];
  if (!u || !bcrypt.compareSync(password, u.password_hash)) {
    throw errors.unauthorized('Email atau password salah');
  }
  if (u.status !== 'active') throw errors.forbidden('Akun tidak aktif');
  const user: AuthUser = { id: u.id, email: u.email, role: u.role, nama_lengkap: u.nama_lengkap };
  return { user, ...signTokens(user) };
}

export async function refresh(refreshToken: string) {
  let decoded: { id: string };
  try {
    decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { id: string };
  } catch {
    throw errors.unauthorized('Refresh token tidak valid');
  }
  const res = await query<UserRow>('SELECT id, email, nama_lengkap, role FROM users WHERE id=$1', [decoded.id]);
  const u = res.rows[0];
  if (!u) throw errors.unauthorized();
  const user: AuthUser = { id: u.id, email: u.email, role: u.role, nama_lengkap: u.nama_lengkap };
  return { user, ...signTokens(user) };
}
