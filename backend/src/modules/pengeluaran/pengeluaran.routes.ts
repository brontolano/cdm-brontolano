import { Router } from 'express';
import { z } from 'zod';
import { query } from '../../db/pool';
import { asyncHandler, ok, created, errors } from '../../utils/http';
import { authenticate, rbac } from '../../middleware/auth';

const router = Router();
router.use(authenticate, rbac('admin', 'management')); // catatan keuangan: admin & manajemen

const KATEGORI = ['perawatan_kendaraan', 'bbm', 'operasional', 'upah_bongkar_muat', 'gaji', 'sewa', 'lain'] as const;
const bodySchema = z.object({
  tanggal: z.string().optional(),                 // YYYY-MM-DD
  kategori: z.enum(KATEGORI),
  deskripsi: z.string().min(1).max(200),
  jumlah: z.number().nonnegative(),
  catatan: z.string().optional(),
});

// GET /api/pengeluaran?from=&to=&kategori=&search=  → daftar + total
router.get('/', asyncHandler(async (req, res) => {
  const where: string[] = [];
  const params: any[] = [];
  const add = (cond: string, val: any) => { params.push(val); where.push(cond.replaceAll('$?', `$${params.length}`)); };
  if (req.query.from) add('tanggal >= $?', req.query.from);
  if (req.query.to) add('tanggal <= $?', req.query.to);
  if (req.query.kategori) add('kategori = $?', req.query.kategori);
  if (req.query.search) add('(deskripsi ILIKE $? OR catatan ILIKE $?)', `%${req.query.search}%`);
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const list = await query(
    `SELECT id, tanggal, kategori, deskripsi, jumlah, catatan, created_at
     FROM pengeluaran ${whereSql} ORDER BY tanggal DESC, created_at DESC LIMIT 500`, params
  );
  const tot = await query<{ total: string; n: number }>(
    `SELECT COALESCE(SUM(jumlah),0) AS total, COUNT(*)::int AS n FROM pengeluaran ${whereSql}`, params
  );
  ok(res, { items: list.rows, total: Number(tot.rows[0].total), count: tot.rows[0].n });
}));

// POST /api/pengeluaran
router.post('/', asyncHandler(async (req, res) => {
  const d = bodySchema.parse(req.body);
  const r = await query(
    `INSERT INTO pengeluaran (tanggal, kategori, deskripsi, jumlah, catatan, created_by)
     VALUES (COALESCE($1::date, CURRENT_DATE), $2, $3, $4, $5, $6)
     RETURNING id, tanggal, kategori, deskripsi, jumlah, catatan, created_at`,
    [d.tanggal ?? null, d.kategori, d.deskripsi, d.jumlah, d.catatan ?? null, req.user!.id]
  );
  created(res, r.rows[0]);
}));

// PUT /api/pengeluaran/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const d = bodySchema.parse(req.body);
  const r = await query(
    `UPDATE pengeluaran SET tanggal=COALESCE($1::date, tanggal), kategori=$2, deskripsi=$3, jumlah=$4, catatan=$5, updated_at=now()
     WHERE id=$6 RETURNING id, tanggal, kategori, deskripsi, jumlah, catatan, created_at`,
    [d.tanggal ?? null, d.kategori, d.deskripsi, d.jumlah, d.catatan ?? null, req.params.id]
  );
  if (!r.rowCount) throw errors.notFound('Pengeluaran tidak ditemukan');
  ok(res, r.rows[0]);
}));

// DELETE /api/pengeluaran/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const r = await query('DELETE FROM pengeluaran WHERE id=$1 RETURNING id', [req.params.id]);
  if (!r.rowCount) throw errors.notFound('Pengeluaran tidak ditemukan');
  ok(res, { message: 'Pengeluaran dihapus' });
}));

export default router;
