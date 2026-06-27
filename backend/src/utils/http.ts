import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;
  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const errors = {
  badRequest: (msg: string, details?: unknown) => new ApiError(400, 'BAD_REQUEST', msg, details),
  unauthorized: (msg = 'Tidak terautentikasi') => new ApiError(401, 'UNAUTHORIZED', msg),
  forbidden: (msg = 'Akses ditolak') => new ApiError(403, 'FORBIDDEN', msg),
  notFound: (msg = 'Data tidak ditemukan') => new ApiError(404, 'NOT_FOUND', msg),
  conflict: (msg: string) => new ApiError(409, 'CONFLICT', msg),
  unprocessable: (msg: string, details?: unknown) => new ApiError(422, 'UNPROCESSABLE', msg, details),
};

export function ok(res: Response, data: unknown, meta?: unknown) {
  return res.json({ success: true, data, ...(meta ? { meta } : {}) });
}

export function created(res: Response, data: unknown) {
  return res.status(201).json({ success: true, data });
}

/** Wraps async route handlers so thrown errors hit the error middleware. */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export function parsePagination(req: Request) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  return { page, limit, offset: (page - 1) * limit };
}
