import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { query } from '../../db/pool';
import { asyncHandler, ok, created, errors } from '../../utils/http';
import { authenticate, rbac } from '../../middleware/auth';

const router = Router();
router.use(authenticate, rbac('admin')); // semua manajemen user khusus admin

const roleEnum = z.enum(['lapangan', 'gudang', 'admin', 'management']);

// GET /api/users
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const r = await query(
      'SELECT id, email, nama_lengkap, role, status, created_at FROM users ORDER BY created_at'
    );
    ok(res, r.rows);
  })
);

// POST /api/users — buat user baru
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const d = z
      .object({ email: z.string().email(), password: z.string().min(6), nama_lengkap: z.string().min(1), role: roleEnum })
      .parse(req.body);
    const dup = await query('SELECT id FROM users WHERE email=$1', [d.email]);
    if (dup.rowCount) throw errors.conflict('Email sudah terdaftar');
    const hash = bcrypt.hashSync(d.password, 10);
    const r = await query(
      `INSERT INTO users (email, password_hash, nama_lengkap, role)
       VALUES ($1,$2,$3,$4) RETURNING id, email, nama_lengkap, role, status, created_at`,
      [d.email, hash, d.nama_lengkap, d.role]
    );
    created(res, r.rows[0]);
  })
);

// PUT /api/users/:id — ubah nama/role/status
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const d = z
      .object({ nama_lengkap: z.string().min(1).optional(), role: roleEnum.optional(), status: z.enum(['active', 'inactive']).optional() })
      .parse(req.body);
    const fields = Object.keys(d);
    if (!fields.length) throw errors.badRequest('Tidak ada perubahan');
    // Cegah admin menonaktifkan dirinya sendiri
    if (d.status === 'inactive' && req.params.id === req.user!.id) throw errors.badRequest('Tidak bisa menonaktifkan akun sendiri');
    const sets = fields.map((f, i) => `${f}=$${i + 1}`);
    const params = fields.map((f) => (d as any)[f]);
    params.push(req.params.id);
    const r = await query(
      `UPDATE users SET ${sets.join(', ')}, updated_at=now() WHERE id=$${params.length}
       RETURNING id, email, nama_lengkap, role, status`,
      params
    );
    if (!r.rowCount) throw errors.notFound('User tidak ditemukan');
    ok(res, r.rows[0]);
  })
);

// PUT /api/users/:id/password — reset password
router.put(
  '/:id/password',
  asyncHandler(async (req, res) => {
    const { password } = z.object({ password: z.string().min(6) }).parse(req.body);
    const hash = bcrypt.hashSync(password, 10);
    const r = await query('UPDATE users SET password_hash=$1, updated_at=now() WHERE id=$2 RETURNING id', [hash, req.params.id]);
    if (!r.rowCount) throw errors.notFound('User tidak ditemukan');
    ok(res, { message: 'Password direset' });
  })
);

export default router;
