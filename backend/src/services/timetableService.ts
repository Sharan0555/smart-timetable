import { randomUUID } from 'node:crypto';
import { Classroom } from '../models/Classroom.js';
import { Faculty } from '../models/Faculty.js';
import { ScheduleConfig } from '../models/ScheduleConfig.js';
import { Subject } from '../models/Subject.js';
import { Timetable } from '../models/Timetable.js';
import { DEFAULT_TIME_SLOTS, WEEKDAYS } from '../constants/timetable.js';
import { detectConflicts } from './conflictService.js';
import { createNotification } from './notificationService.js';
import { emitRealtime } from './realtimeService.js';
import { findBestReplacementFaculty, markReplacementImpact } from './replacementService.js';

type ScheduleBlockType = 'LECTURE' | 'BREAK' | 'MEDITATION' | 'PRACTICAL';

type GenerateTimetableInput = {
  collegeId: string;
  departmentId?: string;
  departmentIds?: string[];
  academicYear: string;
  semester: number;
  generatedBy?: string;
  scheduleConfig?: {
    numberOfStaff?: number;
    numberOfSubjects?: number;
    lecturesPerDay?: number;
    numberOfClasses?: number;
    numberOfPracticalSessions?: number;
    workingDays?: (typeof WEEKDAYS)[number][];
    breakSlots?: Array<{ slotIndex: number; label: string; startTime: string; endTime: string }>;
    meditationSlots?: Array<{ slotIndex: number; label: string; startTime: string; endTime: string }>;
  };
};

type ScheduleSlot = {
  slotIndex: number;
  startTime: string;
  endTime: string;
  type: ScheduleBlockType;
  label?: string;
};

const DEFAULT_WORKING_DAYS = WEEKDAYS;

const addMinutes = (time: string, minutes: number) => {
  const [hour, minute] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hour, minute + minutes, 0, 0);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const normalizeDepartmentIds = (input: GenerateTimetableInput) => {
  const ids = [...(input.departmentIds ?? []), input.departmentId]
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .map((value) => value.trim());
  return Array.from(new Set(ids));
};

const resolveLimit = (value: number | undefined, fallback: number) => {
  return typeof value === 'number' && value > 0 ? value : fallback;
};

const buildSessionPool = (
  subjects: Array<any>,
  lecturesPerDay: number,
  practicalSessions: number,
  numberOfSubjects: number
) => {
  const pool: Array<any> = [];
  const selectedSubjects = subjects.slice(0, numberOfSubjects > 0 ? numberOfSubjects : subjects.length);
  const practicalSubjects = selectedSubjects.filter((subject) => subject.sessionType === 'PRACTICAL');
  const theorySubjects = selectedSubjects.filter((subject) => subject.sessionType !== 'PRACTICAL');

  const practicalBudget = practicalSessions;
  for (let index = 0; index < practicalBudget && practicalSubjects.length; index += 1) {
    const subject = practicalSubjects[index % practicalSubjects.length];
    const sessions = Math.max(1, Number(subject.durationSlots || 2));
    for (let count = 0; count < sessions; count += 1) {
      pool.push(subject);
    }
  }

  const theoryBudget = Math.max(lecturesPerDay * DEFAULT_WORKING_DAYS.length, theorySubjects.length);
  for (let index = 0; index < theoryBudget; index += 1) {
    const subject = theorySubjects[index % Math.max(theorySubjects.length, 1)];
    if (subject) pool.push(subject);
  }

  return pool;
};

const buildDailySlots = (
  lecturesPerDay: number,
  breakSlots: Array<{ slotIndex: number; label: string; startTime: string; endTime: string }> = [],
  meditationSlots: Array<{ slotIndex: number; label: string; startTime: string; endTime: string }> = []
) => {
  const blocked = new Map<number, ScheduleSlot>();
  for (const slot of breakSlots ?? []) {
    blocked.set(slot.slotIndex, { ...slot, type: 'BREAK' });
  }
  for (const slot of meditationSlots ?? []) {
    blocked.set(slot.slotIndex, { ...slot, type: 'MEDITATION' });
  }

  const highestBlockedSlot = Math.max(-1, ...Array.from(blocked.keys()));
  const totalSlots = Math.max(lecturesPerDay + blocked.size, highestBlockedSlot + 1, lecturesPerDay);
  const slots: ScheduleSlot[] = [];
  let previousEndTime: string = DEFAULT_TIME_SLOTS[0].startTime;

  for (let slotIndex = 0; slotIndex < totalSlots; slotIndex += 1) {
    const custom = blocked.get(slotIndex);
    const defaultSlot = DEFAULT_TIME_SLOTS[slotIndex];
    const startTime = custom?.startTime ?? defaultSlot?.startTime ?? previousEndTime;
    const endTime = custom?.endTime ?? defaultSlot?.endTime ?? addMinutes(startTime, 60);
    previousEndTime = endTime;
    slots.push({
      slotIndex,
      startTime,
      endTime,
      type: custom?.type ?? 'LECTURE',
      label: custom?.label ?? ''
    });
  }

  return slots;
};

const pickFaculty = (faculty: Array<any>, subject: any) => {
  const candidates = faculty
    .filter((item) => !item.isOnLeave)
    .filter((item) => (item.currentWeeklyLoad ?? 0) < (item.maxWeeklyLoad ?? Number.MAX_SAFE_INTEGER))
    .filter((item) => (item.expertiseSubjectIds?.length ? item.expertiseSubjectIds.some((id: any) => String(id) === String(subject._id)) : true))
    .sort((a, b) => {
      const aScore = (a.expertiseSubjectIds?.some((id: any) => String(id) === String(subject._id)) ? 10 : 0) + (a.maxWeeklyLoad - a.currentWeeklyLoad);
      const bScore = (b.expertiseSubjectIds?.some((id: any) => String(id) === String(subject._id)) ? 10 : 0) + (b.maxWeeklyLoad - b.currentWeeklyLoad);
      return bScore - aScore;
    });

  return candidates[0] ?? null;
};

const pickClassroom = (classrooms: Array<any>, subject: any, usedRooms: Set<string>) => {
  const wantLab = subject.sessionType === 'PRACTICAL' || subject.preferredRoomType === 'LAB';
  const candidates = classrooms.filter((room) => room.isActive !== false).filter((room) => !usedRooms.has(String(room._id)));
  const preferred = candidates.filter((room) => (wantLab ? room.isLab || room.roomType === 'LAB' : true));
  return (preferred[0] ?? candidates[0]) ?? null;
};

const createSeedForSlot = async (params: {
  collegeId: string;
  departmentId: string;
  academicYear: string;
  semester: number;
  day: (typeof WEEKDAYS)[number];
  slot: ScheduleSlot;
  subject: any;
  faculty: any;
  classroom: any;
  sessionGroupId: string;
}) => {
  return {
    collegeId: params.collegeId,
    departmentId: params.departmentId,
    academicYear: params.academicYear,
    semester: params.semester,
    day: params.day,
    slotIndex: params.slot.slotIndex,
    timeSlot: {
      startTime: params.slot.startTime,
      endTime: params.slot.endTime
    },
    subjectId: String(params.subject._id),
    subjectName: params.subject.name,
    facultyId: String(params.faculty._id),
    facultyName: params.faculty.employeeCode,
    classroomId: String(params.classroom._id),
    classroomName: params.classroom.name,
    type: params.subject.sessionType === 'PRACTICAL' ? 'PRACTICAL' : 'LECTURE',
    sessionGroupId: params.sessionGroupId,
    durationSlots: Math.max(1, Number(params.subject.durationSlots || 1)),
    isPractical: params.subject.sessionType === 'PRACTICAL',
    isBreak: false,
    isMeditation: false
  };
};

const createMarkerSeed = (params: {
  collegeId: string;
  departmentId: string;
  academicYear: string;
  semester: number;
  day: (typeof WEEKDAYS)[number];
  slot: ScheduleSlot;
}) => ({
  collegeId: params.collegeId,
  departmentId: params.departmentId,
  academicYear: params.academicYear,
  semester: params.semester,
  day: params.day,
  slotIndex: params.slot.slotIndex,
  timeSlot: {
    startTime: params.slot.startTime,
    endTime: params.slot.endTime
  },
  subjectId: null,
  subjectName: params.slot.label || (params.slot.type === 'BREAK' ? 'Break' : 'Meditation'),
  facultyId: null,
  facultyName: '',
  classroomId: null,
  classroomName: '',
  type: params.slot.type,
  sessionGroupId: `${params.day}-${params.slot.slotIndex}-${params.slot.type.toLowerCase()}`,
  durationSlots: 1,
  isPractical: false,
  isBreak: params.slot.type === 'BREAK',
  isMeditation: params.slot.type === 'MEDITATION'
});

const recomputeFacultyLoads = async (collegeId: string) => {
  const faculty = await Faculty.find({ collegeId }).lean();
  const lectures = await Timetable.find({ collegeId, status: { $ne: 'cancelled' }, type: { $in: ['LECTURE', 'PRACTICAL'] } }).lean();
  await Promise.all(
    faculty.map((member) =>
      Faculty.findByIdAndUpdate(member._id, {
        currentWeeklyLoad: lectures.filter((entry) => String(entry.facultyId) === String(member._id)).length
      })
    )
  );
};

const generateForDepartment = async (input: GenerateTimetableInput, departmentId: string) => {
  const [subjects, faculty, classrooms, existingConfig] = await Promise.all([
    Subject.find({
      collegeId: input.collegeId,
      departmentId,
      semester: input.semester,
      academicYear: input.academicYear
    }).lean(),
    Faculty.find({ collegeId: input.collegeId, departmentId }).lean(),
    Classroom.find({ collegeId: input.collegeId, departmentId, isActive: true }).lean(),
    ScheduleConfig.findOne({
      collegeId: input.collegeId,
      departmentId,
      academicYear: input.academicYear,
      semester: input.semester
    }).lean()
  ]);

  const scheduleConfig = {
    numberOfStaff: resolveLimit(input.scheduleConfig?.numberOfStaff ?? existingConfig?.numberOfStaff, faculty.length),
    numberOfSubjects: resolveLimit(input.scheduleConfig?.numberOfSubjects ?? existingConfig?.numberOfSubjects, subjects.length),
    lecturesPerDay: resolveLimit(input.scheduleConfig?.lecturesPerDay ?? existingConfig?.lecturesPerDay, 6),
    numberOfClasses: resolveLimit(input.scheduleConfig?.numberOfClasses ?? existingConfig?.numberOfClasses, classrooms.length),
    numberOfPracticalSessions:
      input.scheduleConfig?.numberOfPracticalSessions ?? existingConfig?.numberOfPracticalSessions ?? subjects.filter((subject) => subject.sessionType === 'PRACTICAL').length,
    workingDays: input.scheduleConfig?.workingDays ?? existingConfig?.workingDays ?? DEFAULT_WORKING_DAYS,
    breakSlots: input.scheduleConfig?.breakSlots ?? existingConfig?.breakSlots ?? [],
    meditationSlots: input.scheduleConfig?.meditationSlots ?? existingConfig?.meditationSlots ?? []
  };

  const limitedFaculty = faculty.slice(0, scheduleConfig.numberOfStaff);
  const limitedSubjects = subjects.slice(0, scheduleConfig.numberOfSubjects);
  const limitedClassrooms = classrooms.slice(0, scheduleConfig.numberOfClasses);

  await ScheduleConfig.findOneAndUpdate(
    { collegeId: input.collegeId, departmentId, academicYear: input.academicYear, semester: input.semester },
    {
      collegeId: input.collegeId,
      departmentId,
      academicYear: input.academicYear,
      semester: input.semester,
      ...scheduleConfig
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await Timetable.deleteMany({
    collegeId: input.collegeId,
    departmentId,
    academicYear: input.academicYear,
    semester: input.semester
  });

  const dailySlots = buildDailySlots(scheduleConfig.lecturesPerDay, scheduleConfig.breakSlots, scheduleConfig.meditationSlots);
  const pool = buildSessionPool(limitedSubjects, scheduleConfig.lecturesPerDay, scheduleConfig.numberOfPracticalSessions, scheduleConfig.numberOfSubjects);
  const created: Array<unknown> = [];
  const warnings: Array<{ departmentId: string; day: string; slotIndex: number; reason: string }> = [];
  const usedSubjectSlots = new Set<string>();

  for (const day of scheduleConfig.workingDays) {
    for (let index = 0; index < dailySlots.length; index += 1) {
      const slot = dailySlots[index];
      if (slot.type !== 'LECTURE') {
        const marker = await Timetable.create({
          ...createMarkerSeed({
            collegeId: input.collegeId,
            departmentId,
            academicYear: input.academicYear,
            semester: input.semester,
            day,
            slot
          }),
          generatedBy: input.generatedBy
        });
        created.push(marker);
        continue;
      }

      const subject = pool[(index + WEEKDAYS.indexOf(day)) % Math.max(pool.length, 1)];
      if (!subject) {
        warnings.push({ departmentId, day, slotIndex: slot.slotIndex, reason: 'No subject available' });
        continue;
      }

      const sessionGroupId = randomUUID();
      const durationSlots = Math.max(1, Number(subject.durationSlots || (subject.sessionType === 'PRACTICAL' ? 2 : 1)));
      const isBlockClear = Array.from({ length: durationSlots }).every((_, offset) => {
        const nextSlot = dailySlots[index + offset];
        return nextSlot && nextSlot.type === 'LECTURE' && !usedSubjectSlots.has(`${day}-${nextSlot.slotIndex}`);
      });

      if (!isBlockClear) {
        warnings.push({ departmentId, day, slotIndex: slot.slotIndex, reason: 'Insufficient contiguous slots for subject block' });
        continue;
      }

      const facultyCandidate = pickFaculty(limitedFaculty, subject);
      const classroomCandidate = pickClassroom(limitedClassrooms, subject, new Set());

      if (!facultyCandidate || !classroomCandidate) {
        warnings.push({
          departmentId,
          day,
          slotIndex: slot.slotIndex,
          reason: !facultyCandidate ? 'No available faculty' : 'No available classroom'
        });
        continue;
      }

      for (let offset = 0; offset < durationSlots; offset += 1) {
        const nextSlot = dailySlots[index + offset];
        if (!nextSlot) break;
        const seed = await createSeedForSlot({
          collegeId: input.collegeId,
          departmentId,
          academicYear: input.academicYear,
          semester: input.semester,
          day,
          slot: nextSlot,
          subject,
          faculty: facultyCandidate,
          classroom: classroomCandidate,
          sessionGroupId
        });

        const conflict = await detectConflicts({
          collegeId: input.collegeId,
          departmentId,
          academicYear: input.academicYear,
          semester: input.semester,
          day,
          slotIndex: nextSlot.slotIndex,
          facultyId: seed.facultyId,
          classroomId: seed.classroomId,
          subjectId: seed.subjectId
        });

        if (conflict.hasConflict) {
          warnings.push({ departmentId, day, slotIndex: nextSlot.slotIndex, reason: 'Conflict prevented automatic insert' });
          continue;
        }

        const document = await Timetable.create({
          ...seed,
          generatedBy: input.generatedBy
        });
        usedSubjectSlots.add(`${day}-${nextSlot.slotIndex}`);
        created.push(document);
      }
    }
  }

  return { departmentId, created, warnings, scheduleConfig };
};

export const generateTimetable = async (input: GenerateTimetableInput) => {
  const created: Array<unknown> = [];
  const warnings: Array<{ departmentId: string; day: string; slotIndex: number; reason: string }> = [];
  const departmentIds = normalizeDepartmentIds(input);

  for (const departmentId of departmentIds) {
    const result = await generateForDepartment(input, departmentId);
    created.push(...result.created);
    warnings.push(...result.warnings);
  }

  await recomputeFacultyLoads(input.collegeId);
  for (const entry of created) {
    emitRealtime('timetable:update', entry, input.collegeId);
  }

  return {
    created,
    warnings,
    scheduleConfigs: departmentIds
  };
};

export const reassignLectureForAbsence = async (params: {
  timetableId: string;
  absentFacultyId: string;
  collegeId: string;
  academicYear: string;
  semester: number;
  date?: string;
}) => {
  const lecture = await Timetable.findById(params.timetableId);
  if (!lecture) return null;

  const replacement = await findBestReplacementFaculty({
    collegeId: params.collegeId,
    subjectId: String(lecture.subjectId),
    day: lecture.day,
    slotIndex: lecture.slotIndex,
    academicYear: params.academicYear,
    semester: params.semester,
    excludedFacultyId: params.absentFacultyId
  });

  if (!replacement) return { lecture, replacement: null };

  const faculty = await Faculty.findById(replacement._id).lean();
  if (!faculty) return { lecture, replacement: null };

  lecture.facultyId = replacement._id;
  lecture.facultyName = faculty.employeeCode;
  lecture.status = 'reassigned';
  await lecture.save();

  await markReplacementImpact(params.absentFacultyId, -1);
  await markReplacementImpact(String(replacement._id), 1);
  emitRealtime('timetable:update', lecture, params.collegeId);
  return { lecture, replacement };
};

export const replaceBlockForAbsence = async (params: {
  timetableIds: string[];
  absentFacultyId: string;
  collegeId: string;
  academicYear: string;
  semester: number;
}) => {
  const results = [];
  for (const timetableId of params.timetableIds) {
    const result = await reassignLectureForAbsence({
      timetableId,
      absentFacultyId: params.absentFacultyId,
      collegeId: params.collegeId,
      academicYear: params.academicYear,
      semester: params.semester
    });
    results.push(result);
  }
  return results;
};

export const notifyTimetableChange = async (collegeId: string, message: string) => {
  return createNotification(collegeId, {
    title: 'Timetable Update',
    message,
    type: 'info'
  });
};
