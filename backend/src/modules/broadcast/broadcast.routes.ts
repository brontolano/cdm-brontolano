import { Router } from 'express';
import { z } from 'zod';
import { query } from '../../db/pool';
import { asyncHandler, ok, created, errors } from '../../utils/http';
import { authenticate, rbac } from '../../middleware/auth';
import { waLink } from '../../utils/waLink';

const router = Router();
router.use(authenticate);

// Simple in-code message templates (Feature 2: template messages)
const TEMPLATES = [
  { id: 'promo', nama: 'Promo', pesan: 'Halo {nama}, ada promo menarik di toko kami minggu ini! 🎉' },
  { id: 'restock', nama: 'Restock', pesan: 'Halo {nama}, stok barang favorit Anda sudah tersedia kembali.' },
  { id: 'tagihan', nama: 'Pengingat Tagihan', pesan: 'Halo {nama}, mohon konfirmasi pembayaran tagihan Anda. Terima kasih.' },
];

// GET /broadcast/templates
router.get('/templates', asyncHandler(async (_req, res) => ok(res, TEMPLATES)));

// GET /broadcast/history
router.get(
  '/history',
  asyncHandler(async (_req, res) => {
    const r = await query(
      `SELECT b.*, u.nama_lengkap AS oleh FROM broadcasts b LEFT JOIN users u ON u.id=b.created_by
       ORDER BY b.created_at DESC LIMIT 50`
    );
    ok(res, r.rows);
  })
);

// POST /broadcast/send — generate wa.me links for target konsumen (lapangan & admin)
router.post(
  '/send',
  rbac('lapangan', 'admin'),
  asyncHandler(async (req, res) => {
    const d = z
      .object({
        pesan: z.string().min(1),
        konsumen_ids: z.array(z.string().uuid()).optional(),
        all: z.boolean().optional(),
      })
      .parse(req.body);

    let konsumen;
    if (d.all) {
      konsumen = await query(`SELECT id, nama_toko, nama_pemilik, kontak_wa FROM konsumen WHERE status='aktif'`);
    } else {
      if (!d.konsumen_ids?.length) throw errors.badRequest('Pilih minimal 1 konsumen atau set all=true');
      konsumen = await query(`SELECT id, nama_toko, nama_pemilik, kontak_wa FROM konsumen WHERE id = ANY($1::uuid[])`, [d.konsumen_ids]);
    }
    if (!konsumen.rowCount) throw errors.notFound('Tidak ada konsumen target');

    const penerima = konsumen.rows.map((k) => {
      const pesan = d.pesan.replace(/\{nama\}/g, k.nama_pemilik || k.nama_toko);
      return { konsumen_id: k.id, nama_toko: k.nama_toko, kontak_wa: k.kontak_wa, link: waLink(k.kontak_wa, pesan) };
    });

    await query(
      `INSERT INTO broadcasts (pesan, penerima, total_target, created_by) VALUES ($1,$2,$3,$4)`,
      [d.pesan, JSON.stringify(penerima), penerima.length, req.user!.id]
    );
    created(res, { total: penerima.length, penerima });
  })
);

export default router;
