import type { Role } from '../../../shared/types.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
        collegeId?: string;
        departmentId?: string;
        name: string;
        email: string;
      };
    }
  }
}

export {};
