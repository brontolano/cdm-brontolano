import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/http';

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Endpoint tidak ditemukan' } });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Input tidak valid',
        details: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      },
    });
  }
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      error: { code: err.code, message: err.message, ...(err.details ? { details: err.details } : {}) },
    });
  }
  // Postgres unique violation
  if (err?.code === '23505') {
    return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Data sudah ada (duplikat)' } });
  }
  // Postgres foreign-key violation (data masih direferensikan tabel lain)
  if (err?.code === '23503') {
    return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Data tidak bisa dihapus karena masih dipakai data lain' } });
  }
  console.error('Unhandled error:', err);
  return res.status(500).json({ success: false, error: { code: 'INTERNAL', message: 'Terjadi kesalahan server' } });
}
