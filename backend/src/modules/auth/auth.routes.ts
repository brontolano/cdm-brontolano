import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler, ok, created } from '../../utils/http';
import { authenticate } from '../../middleware/auth';
import * as service from './auth.service';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nama_lengkap: z.string().min(1),
  role: z.enum(['lapangan', 'gudang', 'admin', 'management']),
});

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const input = registerSchema.parse(req.body);
    created(res, await service.register(input));
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = z.object({ email: z.string().email(), password: z.string() }).parse(req.body);
    ok(res, await service.login(email, password));
  })
);

router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const { refreshToken } = z.object({ refreshToken: z.string() }).parse(req.body);
    ok(res, await service.refresh(refreshToken));
  })
);

// Logout is stateless (client discards tokens); endpoint provided for completeness.
router.post('/logout', authenticate, asyncHandler(async (_req, res) => ok(res, { message: 'Logout berhasil' })));

router.get('/me', authenticate, asyncHandler(async (req, res) => ok(res, req.user)));

export default router;
