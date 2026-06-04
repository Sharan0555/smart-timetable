import mongoose, { type InferSchemaType } from 'mongoose';

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    address: { type: String, default: '' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    divisions: { type: [String], default: [] },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export type CollegeDocument = InferSchemaType<typeof collegeSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const College = mongoose.model('College', collegeSchema);
