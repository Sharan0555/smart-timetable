import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError.js';
import { verifyToken } from '../utils/jwt.js';
import type { Role } from '../../../shared/types.js';

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized', 401));
  }

  try {
    const payload = verifyToken(header.slice(7));
    req.user = payload;
    return next();
  } catch {
    return next(new AppError('Invalid or expired token', 401));
  }
};

export const authorize = (...roles: Role[]) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) return next(new AppError('Unauthorized', 401));
  if (!roles.includes(req.user.role)) return next(new AppError('Forbidden', 403));
  return next();
};
