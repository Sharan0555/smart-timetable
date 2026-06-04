import { Department } from '../models/Department.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';

export const listDepartments = asyncHandler(async (req, res) => {
  const filter = req.query.collegeId ? { collegeId: req.query.collegeId } : {};
  const departments = await Department.find(filter).lean();
  res.json(departments);
});

export const createDepartment = asyncHandler(async (req, res) => {
  const department = await Department.create(req.body);
  res.status(201).json(department);
});

export const getDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id).lean();
  if (!department) throw new AppError('Department not found', 404);
  res.json(department);
});

export const updateDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!department) throw new AppError('Department not found', 404);
  res.json(department);
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findByIdAndDelete(req.params.id);
  if (!department) throw new AppError('Department not found', 404);
  res.status(204).send();
});
