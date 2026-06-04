import { Faculty } from '../models/Faculty.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';

export const listFaculty = asyncHandler(async (req, res) => {
  const filter = req.query.collegeId ? { collegeId: req.query.collegeId } : {};
  const faculty = await Faculty.find(filter).lean();
  res.json(faculty);
});

export const createFaculty = asyncHandler(async (req, res) => {
  const existingUser = await User.findById(req.body.userId);
  if (!existingUser) throw new AppError('Linked user not found', 404);

  const faculty = await Faculty.create({
    ...req.body,
    expertiseSubjectIds: req.body.expertiseSubjectIds ?? []
  });
  res.status(201).json(faculty);
});

export const getFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.params.id).lean();
  if (!faculty) throw new AppError('Faculty not found', 404);
  res.json(faculty);
});

export const updateFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!faculty) throw new AppError('Faculty not found', 404);
  res.json(faculty);
});

export const deleteFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findByIdAndDelete(req.params.id);
  if (!faculty) throw new AppError('Faculty not found', 404);
  res.status(204).send();
});

export const saveFacultyAs = asyncHandler(async (req, res) => {
  const source = await Faculty.findById(req.params.id).lean();
  if (!source) throw new AppError('Faculty not found', 404);
  const faculty = await Faculty.create({
    ...source,
    _id: undefined,
    userId: undefined,
    employeeCode: `${source.employeeCode}-${Date.now().toString().slice(-4)}`
  });
  res.status(201).json(faculty);
});

export const markLeave = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findByIdAndUpdate(
    req.params.id,
    { isOnLeave: true, leaveNote: req.body.reason || 'Marked leave' },
    { new: true }
  );
  if (!faculty) throw new AppError('Faculty not found', 404);
  res.json(faculty);
});
