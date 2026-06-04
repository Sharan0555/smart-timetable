import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { dashboardAnalytics } from '../controllers/analyticsController.js';

const router = Router();

router.get('/dashboard', authenticate, authorize('SUPER_ADMIN', 'COLLEGE_ADMIN'), dashboardAnalytics);

export default router;
