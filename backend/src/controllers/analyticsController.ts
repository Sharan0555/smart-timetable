import { asyncHandler } from '../utils/asyncHandler.js';
import { getDashboardAnalytics } from '../services/analyticsService.js';

export const dashboardAnalytics = asyncHandler(async (req, res) => {
  const collegeId = String(req.query.collegeId || req.user?.collegeId || '');
  const analytics = await getDashboardAnalytics(collegeId);
  res.json(analytics);
});
