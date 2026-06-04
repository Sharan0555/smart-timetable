import { Router } from 'express';
import authRoutes from './authRoutes.js';
import collegeRoutes from './collegeRoutes.js';
import departmentRoutes from './departmentRoutes.js';
import facultyRoutes from './facultyRoutes.js';
import subjectRoutes from './subjectRoutes.js';
import classroomRoutes from './classroomRoutes.js';
import timetableRoutes from './timetableRoutes.js';
import absenceRoutes from './absenceRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/colleges', collegeRoutes);
router.use('/departments', departmentRoutes);
router.use('/faculty', facultyRoutes);
router.use('/subjects', subjectRoutes);
router.use('/classrooms', classroomRoutes);
router.use('/timetables', timetableRoutes);
router.use('/absences', absenceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
