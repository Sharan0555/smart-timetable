import { Notification } from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listNotifications = asyncHandler(async (req, res) => {
  const filter: Record<string, string> = {};
  if (req.query.collegeId) filter.collegeId = String(req.query.collegeId);
  const notifications = await Notification.find(filter).sort({ createdAt: -1 }).lean();
  res.json(notifications);
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { readBy: req.user?.id } },
    { new: true }
  );
  res.json(notification);
});
