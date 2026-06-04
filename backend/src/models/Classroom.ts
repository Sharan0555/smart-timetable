import mongoose, { type InferSchemaType } from 'mongoose';

const classroomSchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
    name: { type: String, required: true, trim: true },
    roomType: { type: String, default: 'CLASSROOM' },
    capacity: { type: Number, default: 60 },
    isLab: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

classroomSchema.index({ collegeId: 1, departmentId: 1, name: 1 }, { unique: true });

export type ClassroomDocument = InferSchemaType<typeof classroomSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Classroom = mongoose.model('Classroom', classroomSchema);
