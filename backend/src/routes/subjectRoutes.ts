import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { createSubject, deleteSubject, getSubject, listSubjects, saveSubjectAs, updateSubject } from '../controllers/subjectController.js';
import { validateBody } from '../middleware/validate.js';
import { subjectSchema, subjectUpdateSchema } from '../validators/entities.js';

const router = Router();

router.get('/', authenticate, listSubjects);
router.get('/:id', authenticate, getSubject);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN'), validateBody(subjectSchema), createSubject);
router.post('/:id/save-as', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN'), saveSubjectAs);
router.patch('/:id', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN'), validateBody(subjectUpdateSchema), updateSubject);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN'), deleteSubject);

export default router;
