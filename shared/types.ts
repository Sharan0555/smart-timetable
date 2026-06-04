export type Role = 'SUPER_ADMIN' | 'COLLEGE_ADMIN' | 'FACULTY' | 'STUDENT';

export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export type TimeSlot = {
  startTime: string;
  endTime: string;
};

export type ScheduleBlockType = 'LECTURE' | 'BREAK' | 'MEDITATION' | 'PRACTICAL';

export type ScheduleBlock = {
  slotIndex: number;
  label: string;
  startTime: string;
  endTime: string;
};

export type WeeklyScheduleConfig = {
  numberOfStaff: number;
  numberOfSubjects: number;
  lecturesPerDay: number;
  numberOfClasses: number;
  numberOfPracticalSessions: number;
  workingDays: Weekday[];
  breakSlots: ScheduleBlock[];
  meditationSlots: ScheduleBlock[];
};

export type TimetableEntry = {
  _id?: string;
  collegeId: string;
  departmentId: string;
  academicYear: string;
  semester: number;
  day: Weekday;
  slotIndex: number;
  timeSlot: TimeSlot;
  subjectId: string;
  subjectName: string;
  facultyId: string;
  facultyName: string;
  classroomId: string;
  classroomName: string;
  type?: ScheduleBlockType;
  sessionGroupId?: string;
  durationSlots?: number;
  isPractical?: boolean;
  isBreak?: boolean;
  isMeditation?: boolean;
  status: 'scheduled' | 'reassigned' | 'cancelled';
};

export type NotificationPayload = {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  targetRoles?: Role[];
  targetUserIds?: string[];
};

export type UserSession = {
  id: string;
  email: string;
  role: Role;
  collegeId?: string;
  departmentId?: string;
  name: string;
};
