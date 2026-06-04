import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { Role } from '../../../shared/types.js';

export type JwtPayload = {
  id: string;
  role: Role;
  collegeId?: string;
  departmentId?: string;
  name: string;
  email: string;
};

export const signToken = (payload: JwtPayload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] });

export const verifyToken = (token: string) => jwt.verify(token, env.jwtSecret) as JwtPayload;
