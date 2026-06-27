import { Router } from 'express';
import { z } from 'zod';
import { query } from '../../db/pool';
import { asyncHandler, ok, created, errors, parsePagination } from '../../utils/http';
import { authenticate, rbac } from '../../middleware/auth';

const router = Router();
router.use(authenticate);

// Bersihkan spasi/strip/kurung/titik dari nomor WA sebelum divalidasi,
// agar input seperti "0812-3456-7890" atau "+62 812 3456 7890" diterima.
// Ubah string kosong / undefined menjadi null (untuk field GPS opsional).
const emptyToNull = (v: unknown) => (v === '' || v === undefined ? null : v);

const kontakWa = z.preprocess(
  (v) => (typeof v === 'string' ? v.replace(/[\s\-().]/g, '') : v),
  z.string().regex(/^(\+62|62|0)[0-9]{8,14}$/, 'Format nomor WA tidak valid')
);

const konsumenSchema = z.object({
  nama_toko: z.string().min(1).max(100),
  nama_pemilik: z.string().min(1),
  kontak_wa: kontakWa,
  alamat_lengkap: z.string().min(5, 'Alamat minimal 5 karakter'),
  latitude: z.preprocess(emptyToNull, z.coerce.number().min(-90).max(90).nullable().optional()),
  longitude: z.preprocess(emptyToNull, z.coerce.number().min(-180).max(180).nullable().optional()),
  kota: z.string().optional(),
  status: z.enum(['aktif', 'tidak_aktif']).optional(),
});

// GET /konsumen — list with search, filter, pagination
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { limit, offset, page } = parsePagination(req);
    const search = (req.query.search as string) || '';
    const status = req.query.status as string | undefined;
    const where: string[] = [];
    const params: any[] = [];
    if (search) {
      params.push(`%${search}%`);
      where.push(`(nama_toko ILIKE $${params.length} OR nama_pemilik ILIKE $${params.length} OR kontak_wa ILIKE $${params.length})`);
    }
    if (status) {
      params.push(status);
      where.push(`status = $${params.length}`);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const totalRes = await query<{ count: string }>(`SELECT COUNT(*) FROM konsumen ${whereSql}`, params);
    params.push(limit, offset);
    const rows = await query(
      `SELECT * FROM konsumen ${whereSql} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    ok(res, rows.rows, { page, limit, total: Number(totalRes.rows[0].count) });
  })
);

// GET /konsumen/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const r = await query('SELECT * FROM konsumen WHERE id=$1', [req.params.id]);
    if (!r.rowCount) throw errors.notFound('Konsumen tidak ditemukan');
    ok(res, r.rows[0]);
  })
);

// POST /konsumen — lapangan & admin
router.post(
  '/',
  rbac('lapangan', 'admin'),
  asyncHandler(async (req, res) => {
    const d = konsumenSchema.parse(req.body);
    const dup = await query('SELECT id FROM konsumen WHERE kontak_wa=$1', [d.kontak_wa]);
    if (dup.rowCount) throw errors.conflict('Nomor WA sudah terdaftar');
    const r = await query(
      `INSERT INTO konsumen (nama_toko, nama_pemilik, kontak_wa, alamat_lengkap, latitude, longitude, kota, status, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,COALESCE($8,'aktif'),$9) RETURNING *`,
      [d.nama_toko, d.nama_pemilik, d.kontak_wa, d.alamat_lengkap, d.latitude ?? null, d.longitude ?? null, d.kota ?? null, d.status ?? null, req.user!.id]
    );
    created(res, r.rows[0]);
  })
);

// PUT /konsumen/:id — lapangan & admin
router.put(
  '/:id',
  rbac('lapangan', 'admin'),
  asyncHandler(async (req, res) => {
    const d = konsumenSchema.partial().parse(req.body);
    const fields = Object.keys(d);
    if (!fields.length) throw errors.badRequest('Tidak ada field untuk diupdate');
    const sets = fields.map((f, i) => `${f}=$${i + 1}`);
    const params = fields.map((f) => (d as any)[f]);
    params.push(req.params.id);
    const r = await query(
      `UPDATE konsumen SET ${sets.join(', ')}, updated_at=now() WHERE id=$${params.length} RETURNING *`,
      params
    );
    if (!r.rowCount) throw errors.notFound('Konsumen tidak ditemukan');
    ok(res, r.rows[0]);
  })
);

// DELETE /konsumen/:id — admin only
router.delete(
  '/:id',
  rbac('admin'),
  asyncHandler(async (req, res) => {
    const r = await query('DELETE FROM konsumen WHERE id=$1 RETURNING id', [req.params.id]);
    if (!r.rowCount) throw errors.notFound('Konsumen tidak ditemukan');
    ok(res, { message: 'Konsumen dihapus' });
  })
);

export default router;
