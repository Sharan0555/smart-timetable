import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { markAbsent } from '../controllers/absenceController.js';
import { validateBody } from '../middleware/validate.js';
import { absenceSchema } from '../validators/entities.js';

const router = Router();

router.post('/mark', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY'), validateBody(absenceSchema), markAbsent);

export default router;
