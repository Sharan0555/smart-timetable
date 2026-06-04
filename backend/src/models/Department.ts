import mongoose, { type InferSchemaType } from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    academicYears: [{ type: String, required: true }],
    semestersPerYear: { type: Number, default: 2 }
  },
  { timestamps: true }
);

departmentSchema.index({ collegeId: 1, code: 1 }, { unique: true });

export type DepartmentDocument = InferSchemaType<typeof departmentSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Department = mongoose.model('Department', departmentSchema);
