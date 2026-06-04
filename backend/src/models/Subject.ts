import mongoose, { type InferSchemaType } from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
    code: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    semester: { type: Number, required: true },
    academicYear: { type: String, required: true },
    credits: { type: Number, default: 3 },
    type: {
      type: String,
      enum: ['MAJOR', 'MINOR', 'SKILL_ENHANCEMENT', 'ELECTIVE', 'VALUE_ADDED', 'ABILITY_ENHANCEMENT'],
      default: 'MAJOR'
    },
    sessionType: { type: String, enum: ['THEORY', 'PRACTICAL'], default: 'THEORY' },
    durationSlots: { type: Number, default: 1 },
    weeklySessions: { type: Number, default: 1 },
    requiredFacultyIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' }],
    preferredRoomType: { type: String, default: 'CLASSROOM' }
  },
  { timestamps: true }
);

subjectSchema.index({ collegeId: 1, departmentId: 1, code: 1 }, { unique: true });

export type SubjectDocument = InferSchemaType<typeof subjectSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Subject = mongoose.model('Subject', subjectSchema);
