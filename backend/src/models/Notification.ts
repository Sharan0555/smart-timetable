import mongoose, { type InferSchemaType } from 'mongoose';
import type { Role } from '../../../shared/types.js';

const notificationSchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    targetUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    targetRoles: [{ type: String, enum: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY', 'STUDENT'] }],
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export type NotificationDocument = InferSchemaType<typeof notificationSchema> & {
  _id: mongoose.Types.ObjectId;
  targetRoles: Role[];
};

export const Notification = mongoose.model('Notification', notificationSchema);
