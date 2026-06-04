import { Notification } from '../models/Notification.js';
import { emitRealtime } from './realtimeService.js';
import type { NotificationPayload } from '../../../shared/types.js';

export const createNotification = async (collegeId: string, payload: NotificationPayload) => {
  const notification = await Notification.create({
    collegeId,
    targetUserIds: payload.targetUserIds ?? [],
    targetRoles: payload.targetRoles ?? [],
    title: payload.title,
    message: payload.message,
    type: payload.type
  });

  emitRealtime('notification:new', notification, collegeId);
  return notification;
};
