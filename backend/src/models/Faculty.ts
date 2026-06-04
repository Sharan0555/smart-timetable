import mongoose, { type InferSchemaType } from 'mongoose';

const facultySchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true },
    employeeCode: { type: String, required: true, trim: true },
    expertiseSubjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject', index: true }],
    maxWeeklyLoad: { type: Number, default: 18 },
    currentWeeklyLoad: { type: Number, default: 0 },
    availability: [
      {
        day: { type: String, required: true },
        slotIndex: { type: Number, required: true },
        isAvailable: { type: Boolean, default: true }
      }
    ],
    isOnLeave: { type: Boolean, default: false },
    leaveNote: { type: String, default: '' }
  },
  { timestamps: true }
);

facultySchema.index({ collegeId: 1, employeeCode: 1 }, { unique: true });

export type FacultyDocument = InferSchemaType<typeof facultySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Faculty = mongoose.model('Faculty', facultySchema);
