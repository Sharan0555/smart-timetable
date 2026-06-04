import { Subject } from '../models/Subject.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';

export const listSubjects = asyncHandler(async (req, res) => {
  const filter: Record<string, string> = {};
  if (req.query.collegeId) filter.collegeId = String(req.query.collegeId);
  if (req.query.departmentId) filter.departmentId = String(req.query.departmentId);
  const subjects = await Subject.find(filter).lean();
  res.json(subjects);
});

export const createSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.create(req.body);
  res.status(201).json(subject);
});

export const getSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id).lean();
  if (!subject) throw new AppError('Subject not found', 404);
  res.json(subject);
});

export const updateSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!subject) throw new AppError('Subject not found', 404);
  res.json(subject);
});

export const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findByIdAndDelete(req.params.id);
  if (!subject) throw new AppError('Subject not found', 404);
  res.status(204).send();
});

export const saveSubjectAs = asyncHandler(async (req, res) => {
  const source = await Subject.findById(req.params.id).lean();
  if (!source) throw new AppError('Subject not found', 404);
  const copy = await Subject.create({
    ...source,
    _id: undefined,
    code: `${source.code}-${Date.now().toString().slice(-4)}`,
    name: `${source.name} Copy`
  });
  res.status(201).json(copy);
});
