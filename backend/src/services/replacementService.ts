import { Faculty } from '../models/Faculty.js';
import { Timetable } from '../models/Timetable.js';
import { Subject } from '../models/Subject.js';
import type { Weekday } from '../../../shared/types.js';
import { WEEKDAYS } from '../constants/timetable.js';
import { scoreReplacementFaculty } from './replacementScoring.js';

type ReplacementInput = {
  collegeId: string;
  subjectId: string;
  day: Weekday;
  slotIndex: number;
  academicYear: string;
  semester: number;
  excludedFacultyId: string;
};

export const findBestReplacementFaculty = async (input: ReplacementInput) => {
  const subject = await Subject.findById(input.subjectId).lean();
  if (!subject) return null;

  const candidates = await Faculty.find({
    collegeId: input.collegeId,
    isOnLeave: false,
    _id: { $ne: input.excludedFacultyId }
  }).lean();

  const occupied = await Timetable.find({
    collegeId: input.collegeId,
    academicYear: input.academicYear,
    semester: input.semester,
    day: input.day,
    slotIndex: input.slotIndex,
    status: { $ne: 'cancelled' },
    type: { $in: ['LECTURE', 'PRACTICAL'] }
  }).lean();

  const occupiedFaculty = new Set(occupied.map((entry) => String(entry.facultyId)));

  const scored = candidates
    .filter((faculty) => (faculty.currentWeeklyLoad ?? 0) < (faculty.maxWeeklyLoad ?? Number.MAX_SAFE_INTEGER))
    .filter((faculty) => !occupiedFaculty.has(String(faculty._id)))
    .map((faculty) => {
      return {
        faculty,
        score: scoreReplacementFaculty(faculty as any, { day: input.day, slotIndex: input.slotIndex, subjectId: input.subjectId })
      };
    })
    .sort((a, b) => b.score - a.score);

  return scored[0]?.faculty ?? null;
};

export const markReplacementImpact = async (facultyId: string, delta: number) => {
  await Faculty.findByIdAndUpdate(facultyId, { $inc: { currentWeeklyLoad: delta } });
};

export const summarizeReplacementContext = async (collegeId: string) => {
  const faculty = await Faculty.find({ collegeId }).lean();
  const subjects = await Subject.find({ collegeId }).lean();
  return {
    facultyCount: faculty.length,
    subjectCount: subjects.length,
    weekdays: WEEKDAYS
  };
};
