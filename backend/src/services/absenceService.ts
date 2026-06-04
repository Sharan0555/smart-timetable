import { Absence } from '../models/Absence.js';
import { College } from '../models/College.js';
import { Timetable } from '../models/Timetable.js';
import { createNotification } from './notificationService.js';
import { replaceBlockForAbsence } from './timetableService.js';
import { emitRealtime } from './realtimeService.js';
import { Faculty } from '../models/Faculty.js';

const getWeekdayFromDate = (date: string, timezone = 'Asia/Kolkata') => {
  const resolved = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: timezone }).format(new Date(`${date}T12:00:00`));
  return resolved;
};

export const markFacultyAbsent = async (input: {
  collegeId: string;
  facultyId: string;
  date: string;
  reason?: string;
  markedBy?: string;
}) => {
  const college = await College.findById(input.collegeId).lean();
  const weekday = getWeekdayFromDate(input.date, college?.timezone || 'Asia/Kolkata');

  const absence = await Absence.findOneAndUpdate(
    { facultyId: input.facultyId, date: input.date },
    {
      collegeId: input.collegeId,
      facultyId: input.facultyId,
      date: input.date,
      reason: input.reason || '',
      markedBy: input.markedBy,
      status: 'active'
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await Faculty.findByIdAndUpdate(input.facultyId, { isOnLeave: true, leaveNote: input.reason || 'Marked absent' });

  const lectures = await Timetable.find({
    collegeId: input.collegeId,
    facultyId: input.facultyId,
    day: weekday,
    status: { $ne: 'cancelled' }
  }).sort({ slotIndex: 1 }).lean();

  const results = await replaceBlockForAbsence({
    timetableIds: lectures.map((lecture) => String(lecture._id)),
    absentFacultyId: input.facultyId,
    collegeId: input.collegeId,
    academicYear: lectures[0]?.academicYear ?? '',
    semester: lectures[0]?.semester ?? 1
  });

  if (!lectures.length) {
    await createNotification(input.collegeId, {
      title: 'Faculty absence recorded',
      message: 'The faculty member was marked absent, but no lectures were scheduled for the selected day.',
      type: 'warning'
    });
  }

  const failedReplacements = results.filter((item) => item && item.replacement === null);
  if (failedReplacements.length) {
    await createNotification(input.collegeId, {
      title: 'Replacement unavailable',
      message: `${failedReplacements.length} lecture(s) could not be reassigned automatically. Admin action required.`,
      type: 'error'
    });
  }

  await createNotification(input.collegeId, {
    title: 'Faculty absent',
    message: `Faculty ${input.facultyId} has been marked absent for ${input.date}. Timetable adjustments have been processed.`,
    type: 'warning'
  });

  emitRealtime('absence:updated', absence, input.collegeId);
  return { absence, processedLectures: results };
};

export const resolveFacultyAbsence = async (facultyId: string, date: string) => {
  const absence = await Absence.findOneAndUpdate({ facultyId, date }, { status: 'resolved' }, { new: true });
  await Faculty.findByIdAndUpdate(facultyId, { isOnLeave: false, leaveNote: '' });
  return absence;
};
