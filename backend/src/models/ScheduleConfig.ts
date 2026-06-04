import mongoose, { type InferSchemaType } from 'mongoose';

const scheduleBlockSchema = new mongoose.Schema(
  {
    slotIndex: { type: Number, required: true },
    label: { type: String, required: true, trim: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  },
  { _id: false }
);

const scheduleConfigSchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
    academicYear: { type: String, required: true, index: true },
    semester: { type: Number, required: true, index: true },
    numberOfStaff: { type: Number, default: 0 },
    numberOfSubjects: { type: Number, default: 0 },
    lecturesPerDay: { type: Number, default: 7 },
    numberOfClasses: { type: Number, default: 0 },
    numberOfPracticalSessions: { type: Number, default: 0 },
    workingDays: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }],
    breakSlots: { type: [scheduleBlockSchema], default: [] },
    meditationSlots: { type: [scheduleBlockSchema], default: [] }
  },
  { timestamps: true }
);

scheduleConfigSchema.index({ collegeId: 1, departmentId: 1, academicYear: 1, semester: 1 }, { unique: true });

export type ScheduleConfigDocument = InferSchemaType<typeof scheduleConfigSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ScheduleConfig = mongoose.model('ScheduleConfig', scheduleConfigSchema);
