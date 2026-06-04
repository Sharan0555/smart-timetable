import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { createClassroom, deleteClassroom, getClassroom, listClassrooms, updateClassroom } from '../controllers/classroomController.js';
import { validateBody } from '../middleware/validate.js';
import { classroomSchema, classroomUpdateSchema } from '../validators/entities.js';

const router = Router();

router.get('/', authenticate, listClassrooms);
router.get('/:id', authenticate, getClassroom);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN'), validateBody(classroomSchema), createClassroom);
router.patch('/:id', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN'), validateBody(classroomUpdateSchema), updateClassroom);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN'), deleteClassroom);

export default router;
