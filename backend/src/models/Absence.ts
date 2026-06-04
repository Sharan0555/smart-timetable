import mongoose, { type InferSchemaType } from 'mongoose';

const absenceSchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true, index: true },
    date: { type: String, required: true },
    reason: { type: String, default: '' },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['active', 'resolved'], default: 'active' }
  },
  { timestamps: true }
);

absenceSchema.index({ facultyId: 1, date: 1 }, { unique: true });

export type AbsenceDocument = InferSchemaType<typeof absenceSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Absence = mongoose.model('Absence', absenceSchema);
