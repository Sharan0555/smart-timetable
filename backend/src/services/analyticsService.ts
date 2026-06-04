import { Timetable } from '../models/Timetable.js';
import { Faculty } from '../models/Faculty.js';
import { Classroom } from '../models/Classroom.js';
import { Absence } from '../models/Absence.js';

export const getDashboardAnalytics = async (collegeId: string) => {
  const [faculty, classrooms, lectures, absences] = await Promise.all([
    Faculty.find({ collegeId }).lean(),
    Classroom.find({ collegeId }).lean(),
    Timetable.find({ collegeId, type: { $in: ['LECTURE', 'PRACTICAL'] }, status: { $ne: 'cancelled' } }).lean(),
    Absence.find({ collegeId, status: 'active' }).lean()
  ]);

  const classroomUsage = classrooms.map((room) => {
    const usedSlots = lectures.filter((entry) => String(entry.classroomId) === String(room._id)).length;
    return {
      roomId: String(room._id),
      roomName: room.name,
      utilization: lectures.length ? Math.round((usedSlots / lectures.length) * 100) : 0
    };
  });

  const facultyLoad = faculty.map((member) => ({
    facultyId: String(member._id),
    facultyName: member.employeeCode,
    workload: member.currentWeeklyLoad,
    loadRatio: member.maxWeeklyLoad ? Math.round((member.currentWeeklyLoad / member.maxWeeklyLoad) * 100) : 0
  }));

  const conflictCount = lectures.length - new Set(lectures.map((entry) => `${entry.day}-${entry.slotIndex}-${entry.facultyId}-${entry.classroomId}`)).size;
  const practicalCount = lectures.filter((entry) => entry.type === 'PRACTICAL').length;

  return {
    facultyLoad,
    classroomUsage,
    conflictCount,
    totalLectures: lectures.length,
    practicalCount,
    onLeaveCount: faculty.filter((member) => member.isOnLeave).length,
    activeAbsences: absences.length
  };
};
