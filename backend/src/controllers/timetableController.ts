import { Timetable } from '../models/Timetable.js';
import { Faculty } from '../models/Faculty.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { detectConflicts } from '../services/conflictService.js';
import { generateTimetable } from '../services/timetableService.js';
import { emitRealtime } from '../services/realtimeService.js';

const dayOrder: Record<string, number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
};

const parseDepartmentIds = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter((item) => item.length > 0);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return [];
};

export const listTimetables = asyncHandler(async (req, res) => {
  const filter: Record<string, unknown> = {};
  if (req.query.collegeId) filter.collegeId = String(req.query.collegeId);
  const departmentIds = parseDepartmentIds(req.query.departmentIds);
  if (departmentIds.length > 0) {
    filter.departmentId = { $in: departmentIds };
  } else if (req.query.departmentId) {
    filter.departmentId = String(req.query.departmentId);
  }
  if (req.query.academicYear) filter.academicYear = String(req.query.academicYear);
  if (req.query.semester) filter.semester = Number(req.query.semester);
  const timetables = await Timetable.find(filter).lean();
  timetables.sort((a, b) => {
    const dayDiff = (dayOrder[a.day] ?? 99) - (dayOrder[b.day] ?? 99);
    if (dayDiff !== 0) return dayDiff;
    return a.slotIndex - b.slotIndex;
  });
  res.json(timetables);
});

export const createTimetableEntry = asyncHandler(async (req, res) => {
  const conflict = await detectConflicts(req.body);
  if (conflict.hasConflict) {
    return res.status(409).json({ message: 'Conflict detected', conflicts: conflict.conflicts });
  }

  const entry = await Timetable.create({ ...req.body, status: 'scheduled' });
  if (req.body.facultyId) {
    await Faculty.findByIdAndUpdate(req.body.facultyId, { $inc: { currentWeeklyLoad: 1 } });
  }
  emitRealtime('timetable:update', entry, req.body.collegeId);
  res.status(201).json(entry);
});

export const generateDepartmentTimetable = asyncHandler(async (req, res) => {
  const result = await generateTimetable({
    ...req.body,
    generatedBy: req.user?.id
  });
  res.status(201).json(result);
});

export const exportTimetable = asyncHandler(async (req, res) => {
  const filter: Record<string, unknown> = {};
  if (req.query.collegeId) filter.collegeId = String(req.query.collegeId);
  const departmentIds = parseDepartmentIds(req.query.departmentIds);
  if (departmentIds.length > 0) {
    filter.departmentId = { $in: departmentIds };
  } else if (req.query.departmentId) {
    filter.departmentId = String(req.query.departmentId);
  }
  if (req.query.academicYear) filter.academicYear = String(req.query.academicYear);
  if (req.query.semester) filter.semester = Number(req.query.semester);
  const entries = await Timetable.find(filter).lean();
  entries.sort((a, b) => {
    const dayRank: Record<string, number> = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
    const dayDiff = (dayRank[a.day] ?? 99) - (dayRank[b.day] ?? 99);
    if (dayDiff !== 0) return dayDiff;
    return a.slotIndex - b.slotIndex;
  });
  const format = String(req.query.format || 'csv');

  if (format === 'json') {
    return res.json(entries);
  }

  const rows = [
    ['Day', 'Slot', 'Start', 'End', 'Type', 'Subject', 'Faculty', 'Classroom', 'Status'],
    ...entries.map((entry) => [
      entry.day,
      String(entry.slotIndex + 1),
      entry.timeSlot?.startTime ?? '',
      entry.timeSlot?.endTime ?? '',
      entry.type || 'LECTURE',
      entry.subjectName || '',
      entry.facultyName || '',
      entry.classroomName || '',
      entry.status
    ])
  ];

  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="timetable-export.${format === 'excel' ? 'csv' : 'csv'}"`);
  res.send(csv);
});

export const updateTimetableStatus = asyncHandler(async (req, res) => {
  const current = await Timetable.findById(req.params.id);
  if (!current) throw new AppError('Timetable entry not found', 404);
  const entry = await Timetable.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!entry) throw new AppError('Timetable entry not found', 404);
  if (current.status !== 'cancelled' && req.body.status === 'cancelled') {
    if (current.facultyId) {
      await Faculty.findByIdAndUpdate(current.facultyId, { $inc: { currentWeeklyLoad: -1 } });
    }
  }
  if (current.status === 'cancelled' && req.body.status !== 'cancelled') {
    if (current.facultyId) {
      await Faculty.findByIdAndUpdate(current.facultyId, { $inc: { currentWeeklyLoad: 1 } });
    }
  }
  emitRealtime('timetable:update', entry, String(entry.collegeId));
  res.json(entry);
});
