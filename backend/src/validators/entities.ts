import { z } from 'zod';

const scheduleBlockSchema = z.object({
  slotIndex: z.number().int().min(0),
  label: z.string().min(1),
  startTime: z.string().min(4),
  endTime: z.string().min(4)
});

export const collegeSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2).max(20),
  address: z.string().optional().default(''),
  timezone: z.string().optional().default('Asia/Kolkata'),
  divisions: z.array(z.string().min(1)).min(1)
});
export const collegeUpdateSchema = collegeSchema.partial();

export const departmentSchema = z.object({
  collegeId: z.string().min(1),
  name: z.string().min(2),
  code: z.string().min(2),
  academicYears: z.array(z.string().min(4)).min(1),
  semestersPerYear: z.number().int().min(1).max(4).default(2)
});
export const departmentUpdateSchema = departmentSchema.partial();

export const facultySchema = z.object({
  collegeId: z.string().min(1),
  departmentId: z.string().min(1),
  userId: z.string().min(1),
  employeeCode: z.string().min(2),
  expertiseSubjectIds: z.array(z.string().min(1)).default([]),
  maxWeeklyLoad: z.number().int().min(1).default(18)
});
export const facultyUpdateSchema = facultySchema.partial();

export const subjectSchema = z.object({
  collegeId: z.string().min(1),
  departmentId: z.string().min(1),
  code: z.string().min(2),
  name: z.string().min(2),
  semester: z.number().int().min(1),
  academicYear: z.string().min(4),
  credits: z.number().int().min(1).default(3),
  type: z.enum(['MAJOR', 'MINOR', 'SKILL_ENHANCEMENT', 'ELECTIVE', 'VALUE_ADDED', 'ABILITY_ENHANCEMENT']).default('MAJOR'),
  sessionType: z.enum(['THEORY', 'PRACTICAL']).default('THEORY'),
  durationSlots: z.number().int().min(1).default(1),
  weeklySessions: z.number().int().min(1).default(1),
  requiredFacultyIds: z.array(z.string().min(1)).default([]),
  preferredRoomType: z.string().optional().default('CLASSROOM')
});
export const subjectUpdateSchema = subjectSchema.partial();

export const classroomSchema = z.object({
  collegeId: z.string().min(1),
  departmentId: z.string().min(1),
  name: z.string().min(2),
  roomType: z.string().optional().default('CLASSROOM'),
  capacity: z.number().int().min(1).default(60),
  isLab: z.boolean().default(false)
});
export const classroomUpdateSchema = classroomSchema.partial();

export const timetableGenerateSchema = z.object({
  collegeId: z.string().min(1),
  departmentId: z.string().min(1).optional(),
  departmentIds: z.array(z.string().min(1)).optional(),
  academicYear: z.string().min(4),
  semester: z.number().int().min(1),
  scheduleConfig: z
    .object({
      numberOfStaff: z.number().int().min(0).optional(),
      numberOfSubjects: z.number().int().min(0).optional(),
      lecturesPerDay: z.number().int().min(1).optional(),
      numberOfClasses: z.number().int().min(0).optional(),
      numberOfPracticalSessions: z.number().int().min(0).optional(),
      workingDays: z.array(z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])).optional(),
      breakSlots: z.array(scheduleBlockSchema).optional(),
      meditationSlots: z.array(scheduleBlockSchema).optional()
    })
    .optional()
}).superRefine((value, ctx) => {
  if (!value.departmentId && !value.departmentIds?.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['departmentId'],
      message: 'Provide a departmentId or at least one departmentIds entry'
    });
  }
});

export const absenceSchema = z.object({
  collegeId: z.string().min(1),
  facultyId: z.string().min(1),
  date: z.string().min(8),
  reason: z.string().optional().default('')
});

export const timetableEntrySchema = z.object({
  collegeId: z.string().min(1),
  departmentId: z.string().min(1),
  academicYear: z.string().min(4),
  semester: z.number().int().min(1),
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
  slotIndex: z.number().int().min(0),
  timeSlot: z.object({
    startTime: z.string().min(4),
    endTime: z.string().min(4)
  }),
  subjectId: z.string().optional().default(''),
  subjectName: z.string().min(1),
  facultyId: z.string().optional().default(''),
  facultyName: z.string().optional().default(''),
  classroomId: z.string().optional().default(''),
  classroomName: z.string().optional().default(''),
  type: z.enum(['LECTURE', 'BREAK', 'MEDITATION', 'PRACTICAL']).default('LECTURE'),
  sessionGroupId: z.string().optional().default(''),
  durationSlots: z.number().int().min(1).optional().default(1),
  isPractical: z.boolean().optional().default(false),
  isBreak: z.boolean().optional().default(false),
  isMeditation: z.boolean().optional().default(false)
}).superRefine((value, ctx) => {
  if (value.type === 'LECTURE' || value.type === 'PRACTICAL') {
    if (!value.subjectId) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['subjectId'], message: 'Subject is required' });
    if (!value.facultyId) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['facultyId'], message: 'Faculty is required' });
    if (!value.classroomId) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['classroomId'], message: 'Classroom is required' });
  }
});

export const leaveSchema = z.object({
  reason: z.string().optional().default('')
});
