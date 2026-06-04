import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError.js';

export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('Route not found', 404));
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const appError = err instanceof AppError ? err : new AppError('Internal server error', 500);
  const payload = {
    message: appError.message,
    details: appError.details ?? null
  };
  res.status(appError.statusCode).json(payload);
};
