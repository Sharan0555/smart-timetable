import { College } from '../models/College.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';

export const listColleges = asyncHandler(async (_req, res) => {
  const colleges = await College.find().lean();
  res.json(colleges);
});

export const createCollege = asyncHandler(async (req, res) => {
  const college = await College.create(req.body);
  res.status(201).json(college);
});

export const getCollege = asyncHandler(async (req, res) => {
  const college = await College.findById(req.params.id).lean();
  if (!college) throw new AppError('College not found', 404);
  res.json(college);
});

export const updateCollege = asyncHandler(async (req, res) => {
  const college = await College.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!college) throw new AppError('College not found', 404);
  res.json(college);
});

export const deleteCollege = asyncHandler(async (req, res) => {
  const college = await College.findByIdAndDelete(req.params.id);
  if (!college) throw new AppError('College not found', 404);
  res.status(204).send();
});
