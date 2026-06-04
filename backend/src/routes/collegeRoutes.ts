import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { collegeSchema, collegeUpdateSchema } from '../validators/entities.js';
import { createCollege, deleteCollege, getCollege, listColleges, updateCollege } from '../controllers/collegeController.js';

const router = Router();

router.get('/', authenticate, listColleges);
router.get('/:id', authenticate, getCollege);
router.post('/', authenticate, authorize('SUPER_ADMIN'), validateBody(collegeSchema), createCollege);
router.patch('/:id', authenticate, authorize('SUPER_ADMIN'), validateBody(collegeUpdateSchema), updateCollege);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), deleteCollege);

export default router;
