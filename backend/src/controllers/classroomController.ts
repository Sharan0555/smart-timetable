import { Classroom } from '../models/Classroom.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';

export const listClassrooms = asyncHandler(async (req, res) => {
  const filter: Record<string, string> = {};
  if (req.query.collegeId) filter.collegeId = String(req.query.collegeId);
  if (req.query.departmentId) filter.departmentId = String(req.query.departmentId);
  const classrooms = await Classroom.find(filter).lean();
  res.json(classrooms);
});

export const createClassroom = asyncHandler(async (req, res) => {
  const classroom = await Classroom.create(req.body);
  res.status(201).json(classroom);
});

export const getClassroom = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findById(req.params.id).lean();
  if (!classroom) throw new AppError('Classroom not found', 404);
  res.json(classroom);
});

export const updateClassroom = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!classroom) throw new AppError('Classroom not found', 404);
  res.json(classroom);
});

export const deleteClassroom = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findByIdAndDelete(req.params.id);
  if (!classroom) throw new AppError('Classroom not found', 404);
  res.status(204).send();
});
