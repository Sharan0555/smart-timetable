import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { createFaculty, deleteFaculty, getFaculty, listFaculty, markLeave, saveFacultyAs, updateFaculty } from '../controllers/facultyController.js';
import { validateBody } from '../middleware/validate.js';
import { facultySchema, facultyUpdateSchema, leaveSchema } from '../validators/entities.js';

const router = Router();

router.get('/', authenticate, listFaculty);
router.get('/:id', authenticate, getFaculty);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN'), validateBody(facultySchema), createFaculty);
router.post('/:id/save-as', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN'), saveFacultyAs);
router.patch('/:id', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN'), validateBody(facultyUpdateSchema), updateFaculty);
router.patch('/:id/leave', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY'), validateBody(leaveSchema), markLeave);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN'), deleteFaculty);

export default router;
