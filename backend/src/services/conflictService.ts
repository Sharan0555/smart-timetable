import { Timetable } from '../models/Timetable.js';
import type { TimetableEntry } from '../../../shared/types.js';

export type ConflictResult = {
  hasConflict: boolean;
  conflicts: Array<{ type: 'faculty' | 'classroom' | 'subject'; entry: unknown }>;
};

export const detectConflicts = async (
  candidate: Pick<TimetableEntry, 'collegeId' | 'departmentId' | 'academicYear' | 'semester' | 'day' | 'slotIndex' | 'facultyId' | 'classroomId' | 'subjectId'>
): Promise<ConflictResult> => {
  const matches = await Timetable.find({
    collegeId: candidate.collegeId,
    academicYear: candidate.academicYear,
    semester: candidate.semester,
    day: candidate.day,
    slotIndex: candidate.slotIndex,
    status: { $ne: 'cancelled' },
    type: { $in: ['LECTURE', 'PRACTICAL'] },
    $or: [
      { facultyId: candidate.facultyId },
      { classroomId: candidate.classroomId },
      { subjectId: candidate.subjectId }
    ]
  }).lean();

  const conflicts = matches.flatMap((entry) => {
    const items: ConflictResult['conflicts'] = [];
    if (String(entry.facultyId) === candidate.facultyId) items.push({ type: 'faculty', entry });
    if (String(entry.classroomId) === candidate.classroomId) items.push({ type: 'classroom', entry });
    if (String(entry.subjectId) === candidate.subjectId) items.push({ type: 'subject', entry });
    return items;
  });

  return { hasConflict: conflicts.length > 0, conflicts };
};
