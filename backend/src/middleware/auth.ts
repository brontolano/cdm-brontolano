import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { errors } from '../utils/http';

export type Role = 'lapangan' | 'gudang' | 'admin' | 'management';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  nama_lengkap: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw errors.unauthorized();
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, config.jwt.accessSecret) as AuthUser;
    req.user = { id: payload.id, email: payload.email, role: payload.role, nama_lengkap: payload.nama_lengkap };
    next();
  } catch {
    throw errors.unauthorized('Token tidak valid atau kedaluwarsa');
  }
}

/** Allow only the given roles. Empty list = any authenticated user. */
export function rbac(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw errors.unauthorized();
    if (roles.length && !roles.includes(req.user.role)) {
      throw errors.forbidden(`Role '${req.user.role}' tidak diizinkan untuk aksi ini`);
    }
    next();
  };
}
