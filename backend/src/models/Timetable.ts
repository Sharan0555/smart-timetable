import mongoose, { type InferSchemaType } from 'mongoose';

const timetableEntrySchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
    academicYear: { type: String, required: true },
    semester: { type: Number, required: true, index: true },
    day: {
      type: String,
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    slotIndex: { type: Number, required: true, index: true },
    timeSlot: {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true }
    },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: null, required: function (this: any) { return this.type === 'LECTURE' || this.type === 'PRACTICAL'; } },
    subjectName: { type: String, default: '' },
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', default: null, required: function (this: any) { return this.type === 'LECTURE' || this.type === 'PRACTICAL'; } },
    facultyName: { type: String, default: '' },
    classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', default: null, required: function (this: any) { return this.type === 'LECTURE' || this.type === 'PRACTICAL'; } },
    classroomName: { type: String, default: '' },
    type: { type: String, enum: ['LECTURE', 'BREAK', 'MEDITATION', 'PRACTICAL'], default: 'LECTURE' },
    sessionGroupId: { type: String, default: '' },
    durationSlots: { type: Number, default: 1 },
    isPractical: { type: Boolean, default: false },
    isBreak: { type: Boolean, default: false },
    isMeditation: { type: Boolean, default: false },
    status: { type: String, enum: ['scheduled', 'reassigned', 'cancelled'], default: 'scheduled' },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

timetableEntrySchema.index(
  { collegeId: 1, departmentId: 1, academicYear: 1, semester: 1, day: 1, slotIndex: 1 },
  { unique: true }
);
timetableEntrySchema.index({ collegeId: 1, departmentId: 1, academicYear: 1, semester: 1, day: 1, sessionGroupId: 1 });
timetableEntrySchema.index({ facultyId: 1, day: 1, slotIndex: 1 });
timetableEntrySchema.index({ classroomId: 1, day: 1, slotIndex: 1 });

export type TimetableDocument = InferSchemaType<typeof timetableEntrySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Timetable = mongoose.model('Timetable', timetableEntrySchema);
