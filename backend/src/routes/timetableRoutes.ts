import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { createTimetableEntry, exportTimetable, generateDepartmentTimetable, listTimetables, updateTimetableStatus } from '../controllers/timetableController.js';
import { validateBody } from '../middleware/validate.js';
import { timetableEntrySchema, timetableGenerateSchema } from '../validators/entities.js';

const router = Router();

router.get('/', authenticate, listTimetables);
router.get('/export', authenticate, exportTimetable);
router.post('/entries', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN'), validateBody(timetableEntrySchema), createTimetableEntry);
router.post('/generate', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN'), validateBody(timetableGenerateSchema), generateDepartmentTimetable);
router.patch('/:id/status', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN'), updateTimetableStatus);

export default router;
