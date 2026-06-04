import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { createDepartment, deleteDepartment, getDepartment, listDepartments, updateDepartment } from '../controllers/departmentController.js';
import { validateBody } from '../middleware/validate.js';
import { departmentSchema, departmentUpdateSchema } from '../validators/entities.js';

const router = Router();

router.get('/', authenticate, listDepartments);
router.get('/:id', authenticate, getDepartment);
router.post('/', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN'), validateBody(departmentSchema), createDepartment);
router.patch('/:id', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN'), validateBody(departmentUpdateSchema), updateDepartment);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN'), deleteDepartment);

export default router;
