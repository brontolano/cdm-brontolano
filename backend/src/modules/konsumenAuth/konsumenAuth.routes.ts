import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { asyncHandler, ok, created, errors } from '../../utils/http';
import { config } from '../../config';
import * as service from './konsumenAuth.service';
import type { KonsumenAuthUser } from './konsumenAuth.service';

// Middleware: verifikasi JWT konsumen (terpisah dari staf — secret berbeda).
export function authenticateKonsumen(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw errors.unauthorized();
  try {
    const payload = jwt.verify(header.slice(7), config.jwt.konsumenSecret) as KonsumenAuthUser;
    if (payload.kind !== 'konsumen') throw errors.unauthorized();
    (req as any).konsumen = payload;
    next();
  } catch {
    throw errors.unauthorized('Sesi konsumen tidak valid atau kedaluwarsa');
  }
}

const router = Router();

router.post('/register', asyncHandler(async (req, res) => {
  const input = z.object({
    nama: z.string().min(1).max(120),
    no_wa: z.string().min(6),
    password: z.string().min(6),
  }).parse(req.body);
  created(res, await service.register(input));
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { no_wa, password } = z.object({ no_wa: z.string().min(6), password: z.string() }).parse(req.body);
  ok(res, await service.login(no_wa, password));
}));

router.get('/me', authenticateKonsumen, asyncHandler(async (req, res) => {
  ok(res, (req as any).konsumen);
}));

router.get('/orders', authenticateKonsumen, asyncHandler(async (req, res) => {
  const k = (req as any).konsumen as KonsumenAuthUser;
  ok(res, await service.listOrders(k.kid, k.no_wa));
}));

export default router;
