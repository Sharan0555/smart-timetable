import mongoose, { type InferSchemaType } from 'mongoose';
import type { Role } from '../../../shared/types.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'FACULTY', 'STUDENT'], required: true },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
  role: Role;
};

export const User = mongoose.model('User', userSchema);
