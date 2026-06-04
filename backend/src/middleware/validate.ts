import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '../utils/appError.js';

export const validateBody = <T>(schema: ZodSchema<T>) => (req: Request, _res: Response, next: NextFunction) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return next(new AppError('Validation failed', 400, parsed.error.flatten()));
  }
  req.body = parsed.data;
  return next();
};
