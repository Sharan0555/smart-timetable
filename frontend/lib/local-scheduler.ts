import type { Weekday } from '../../shared/types';

export const weekdays: Weekday[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export type CollegeRecord = {
  id: string;
  name: string;
  divisions: string[];
};

export const collegeCatalog: CollegeRecord[] = [
  {
    id: 'walchand-institute-of-technology',
    name: 'Walchand Institute of Technology',
    divisions: ['CSE', 'Mechanical', 'Civil', 'Electronic']
  },
  {
    id: 'nk-orchid-college-of-engineering-and-technology-solapur',
    name: 'N. K. Orchid College of Engineering & Technology, Solapur',
    divisions: ['CSE', 'Mechanical', 'Civil', 'Electronic']
  },
  {
    id: 'nb-navale-sinhgad-college-of-engineering-solapur',
    name: 'N. B. Navale Sinhgad College of Engineering Solapur',
    divisions: ['CSE', 'Mechanical', 'Civil', 'Electronic']
  },
  {
    id: 'siddheshwar-womens-college-of-engineering',
    name: "Siddheshwar Women's College of Engineering",
    divisions: ['CSE', 'Mechanical', 'Civil', 'Electronic']
  },
  {
    id: 'ag-patil-institute-of-technology-solapur',
    name: 'A. G. Patil Institute of Technology, Solapur',
    divisions: ['CSE', 'Mechanical', 'Civil', 'Electronic']
  }
];

export type PeriodKind = 'LECTURE' | 'BREAK' | 'MEDITATION';

export type SchedulePlacement = 'start' | 'between' | 'end';

export type SpecialPeriodDisplayMode = 'per-day' | 'full-width';

export type BreakSetting = {
  id: string;
  afterLecture: number;
  durationMinutes: number;
  label: string;
};

export type SpecialPeriodSetting = {
  id: string;
  name: string;
  placement: SchedulePlacement;
  afterLecture: number;
  startTime: string;
  durationMinutes: number;
  displayMode?: SpecialPeriodDisplayMode;
};

export type PeriodRecord = {
  id: string;
  kind: PeriodKind;
  label: string;
  order: number;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  displayMode?: SpecialPeriodDisplayMode;
};

export type FacultyAvailability = Record<Weekday, 'available' | 'on leave'>;

export type FacultyRecord = {
  id: string;
  name: string;
  subjectIds: string[];
  maxLecturesPerDay: number;
  canHandlePractical: boolean;
  availability: FacultyAvailability;
};

export type SubjectType = 'Theory' | 'Practical';

export type SubjectRecord = {
  id: string;
  name: string;
  code: string;
  type: SubjectType;
  hoursPerWeek: number;
  labName: string;
  batch: string;
  durationSlots: number;
  preferredDays: Weekday[];
  assignedFacultyId?: string | null;
};

export type SchedulerConfig = {
  collegeId: string;
  collegeName: string;
  division: string;
  staffCount: number;
  subjectCount: number;
  lecturesPerDay: number;
  workingDays: Weekday[];
  dayStartTime: string;
  dayEndTime: string;
  lectureDurationMinutes: number;
  breaks: BreakSetting[];
  specialPeriods: SpecialPeriodSetting[];
  periods: PeriodRecord[];
};

export type ScheduleCell =
  | {
      kind: 'EMPTY';
      status: 'free';
    }
  | {
      kind: 'SPECIAL';
      status: 'break' | 'meditation';
      label: string;
      timeLabel: string;
    }
  | {
      kind: 'LECTURE';
      status: 'scheduled' | 'substituted' | 'free';
      rowSpan: number;
      hidden?: boolean;
      subjectId?: string;
      subjectName: string;
      subjectCode: string;
      subjectType: SubjectType;
      facultyId?: string;
      facultyName: string;
      roomName: string;
      batch?: string;
      durationSlots: number;
      timeLabel: string;
      isPractical: boolean;
      isAbsent?: boolean;
      substitutionLabel?: string;
    };

export type TimetableDay = {
  day: Weekday;
  cells: ScheduleCell[];
};

export type SubstitutionRecord = {
  id: string;
  day: Weekday;
  rowIndex: number;
  originalFacultyId: string;
  originalFacultyName: string;
  substituteFacultyId: string | null;
  substituteFacultyName: string | null;
  subjectId: string;
  subjectName: string;
  subjectType: SubjectType;
  status: 'substituted' | 'free';
  note: string;
};

export type GeneratedTimetable = {
  generatedAt: string;
  generationSeed: number;
  collegeId: string;
  collegeName: string;
  division: string;
  rows: Array<{
    id: string;
    kind: PeriodKind;
    label: string;
    order: number;
    timeLabel: string;
    durationMinutes: number;
  }>;
  days: TimetableDay[];
  substitutions: SubstitutionRecord[];
  warnings: string[];
};

export type SchedulerStorage = {
  config: SchedulerConfig;
  faculty: FacultyRecord[];
  subjects: SubjectRecord[];
  timetable: GeneratedTimetable | null;
};

const STORAGE_KEY = 'smartSchedulerWorkspace';

const defaultAvailability = (): FacultyAvailability =>
  weekdays.reduce(
    (acc, day) => {
      acc[day] = 'available';
      return acc;
    },
    {} as FacultyAvailability
  );

const createId = () => (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `id-${Math.random().toString(36).slice(2, 10)}`);

export const createDefaultConfig = (): SchedulerConfig => ({
  collegeId: collegeCatalog[0].id,
  collegeName: collegeCatalog[0].name,
  division: collegeCatalog[0].divisions[0],
  staffCount: 3,
  subjectCount: 4,
  lecturesPerDay: 6,
  workingDays: [...weekdays],
  dayStartTime: '08:45',
  dayEndTime: '15:00',
  lectureDurationMinutes: 50,
  breaks: [],
  specialPeriods: [],
  periods: []
});

export const createDefaultFaculty = (): FacultyRecord[] => [
  {
    id: createId(),
    name: 'Dr. Ananya Rao',
    subjectIds: [],
    maxLecturesPerDay: 4,
    canHandlePractical: true,
    availability: defaultAvailability()
  },
  {
    id: createId(),
    name: 'Prof. Kabir Mehta',
    subjectIds: [],
    maxLecturesPerDay: 4,
    canHandlePractical: true,
    availability: defaultAvailability()
  },
  {
    id: createId(),
    name: 'Ms. Priya Nair',
    subjectIds: [],
    maxLecturesPerDay: 3,
    canHandlePractical: false,
    availability: defaultAvailability()
  }
];

export const createDefaultSubjects = (): SubjectRecord[] => [
  {
    id: createId(),
    name: 'Mathematics',
    code: 'MATH101',
    type: 'Theory',
    hoursPerWeek: 4,
    labName: '',
    batch: '',
    durationSlots: 1,
    preferredDays: ['Monday', 'Wednesday', 'Friday'],
    assignedFacultyId: null
  },
  {
    id: createId(),
    name: 'Programming Lab',
    code: 'CSL102',
    type: 'Practical',
    hoursPerWeek: 2,
    labName: 'Lab A',
    batch: 'Batch A',
    durationSlots: 2,
    preferredDays: ['Tuesday', 'Thursday'],
    assignedFacultyId: null
  },
  {
    id: createId(),
    name: 'Data Structures',
    code: 'CS201',
    type: 'Theory',
    hoursPerWeek: 3,
    labName: '',
    batch: '',
    durationSlots: 1,
    preferredDays: ['Monday', 'Thursday'],
    assignedFacultyId: null
  },
  {
    id: createId(),
    name: 'Physics Lab',
    code: 'PHY103L',
    type: 'Practical',
    hoursPerWeek: 2,
    labName: 'Lab B',
    batch: 'Batch B',
    durationSlots: 2,
    preferredDays: ['Wednesday', 'Saturday'],
    assignedFacultyId: null
  }
];

export const createDefaultPeriods = (lecturesPerDay: number): PeriodRecord[] =>
  Array.from({ length: lecturesPerDay }, (_, index) => ({
    id: createId(),
    kind: 'LECTURE' as const,
    label: `Period ${index + 1}`,
    order: index
  }));

export const createDefaultStorage = (): SchedulerStorage => ({
  config: {
    ...createDefaultConfig(),
    periods: createDefaultPeriods(6)
  },
  faculty: createDefaultFaculty(),
  subjects: createDefaultSubjects(),
  timetable: null
});

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const isValidTime = (value: string) => /^\d{2}:\d{2}$/.test(value) && Number.isFinite(parseTime(value));

const getCollege = (collegeId: string) => collegeCatalog.find((college) => college.id === collegeId) ?? collegeCatalog[0];

const createDefaultSubjectCode = (name: string, index: number) => {
  const slug = name
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((part) => part.slice(0, 3).toUpperCase())
    .filter(Boolean)
    .join('');
  return slug || `SUB${String(index + 1).padStart(2, '0')}`;
};

const cloneFacultyAvailability = (availability?: Partial<FacultyAvailability>) =>
  weekdays.reduce(
    (acc, day) => {
      acc[day] = availability?.[day] ?? 'available';
      return acc;
    },
    {} as FacultyAvailability
  );

const normalizeFacultyLinks = (faculty: FacultyRecord[], subjects: SubjectRecord[]) => {
  const nextFaculty = faculty.map((member) => ({ ...member, subjectIds: [...new Set(member.subjectIds ?? [])] }));

  subjects.forEach((subject) => {
    if (!subject.assignedFacultyId) {
      return;
    }
    const member = nextFaculty.find((item) => item.id === subject.assignedFacultyId);
    if (member && !member.subjectIds.includes(subject.id)) {
      member.subjectIds = [...member.subjectIds, subject.id];
    }
  });

  return nextFaculty;
};

const legacyPeriodsToSettings = (periods: PeriodRecord[], lecturesPerDay: number) => {
  const ordered = clone(periods).sort((a, b) => a.order - b.order);
  let lectureCount = 0;
  const breaks: BreakSetting[] = [];
  const specialPeriods: SpecialPeriodSetting[] = [];

  ordered.forEach((period) => {
    if (period.kind === 'LECTURE') {
      lectureCount += 1;
      return;
    }

    if (period.kind === 'BREAK') {
      breaks.push({
        id: period.id,
        afterLecture: Math.max(1, Math.min(lecturesPerDay - 1, lectureCount || 1)),
        durationMinutes: period.durationMinutes ?? 15,
        label: period.label || 'Break'
      });
      return;
    }

    specialPeriods.push({
      id: period.id,
      name: period.label || 'Prayer / Assembly',
      placement: lectureCount <= 0 ? 'start' : lectureCount >= lecturesPerDay ? 'end' : 'between',
      afterLecture: Math.max(0, Math.min(lecturesPerDay, lectureCount)),
      startTime: period.startTime ?? '08:40',
      durationMinutes: period.durationMinutes ?? 15,
      displayMode: period.displayMode ?? 'per-day'
    });
  });

  return { breaks, specialPeriods };
};

const buildSchedulePeriods = (config: SchedulerConfig): PeriodRecord[] => {
  const rows: PeriodRecord[] = [];
  const start = parseTime(config.dayStartTime);
  let current = Number.isFinite(start) ? start : parseTime('08:45');
  let order = 0;

  const startSpecials = config.specialPeriods.filter((item) => item.placement === 'start');
  const betweenSpecials = config.specialPeriods.filter((item) => item.placement === 'between');
  const endSpecials = config.specialPeriods.filter((item) => item.placement === 'end');

  const pushTimedRow = (kind: PeriodKind, label: string, durationMinutes: number, explicitStartTime?: string, id?: string) => {
    const safeStart = explicitStartTime && isValidTime(explicitStartTime) ? Math.max(current, parseTime(explicitStartTime)) : current;
    const safeDuration = Math.max(1, durationMinutes || 0);
    const end = safeStart + safeDuration;
    rows.push({
      id: id ?? createId(),
      kind,
      label,
      order: order++,
      startTime: formatTime(safeStart),
      endTime: formatTime(end),
      durationMinutes: safeDuration,
      displayMode: kind === 'LECTURE' ? undefined : config.specialPeriods.find((item) => item.id === id)?.displayMode ?? 'per-day'
    });
    current = end;
  };

  startSpecials.forEach((item) => {
    pushTimedRow('MEDITATION', item.name, item.durationMinutes, item.startTime, item.id);
  });

  for (let lecture = 1; lecture <= config.lecturesPerDay; lecture += 1) {
    const lectureStart = current;
    const lectureEnd = lectureStart + Math.max(1, config.lectureDurationMinutes || 0);
    rows.push({
      id: createId(),
      kind: 'LECTURE',
      label: `Lecture ${lecture}`,
      order: order++,
      startTime: formatTime(lectureStart),
      endTime: formatTime(lectureEnd),
      durationMinutes: config.lectureDurationMinutes
    });
    current = lectureEnd;

    config.breaks
      .filter((item) => item.afterLecture === lecture)
      .sort((a, b) => a.label.localeCompare(b.label))
      .forEach((item) => {
        pushTimedRow('BREAK', item.label, item.durationMinutes, undefined, item.id);
      });

    betweenSpecials
      .filter((item) => item.afterLecture === lecture)
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((item) => {
        pushTimedRow('MEDITATION', item.name, item.durationMinutes, item.startTime, item.id);
      });
  }

  endSpecials.forEach((item) => {
    pushTimedRow('MEDITATION', item.name, item.durationMinutes, item.startTime, item.id);
  });

  return rows.map((period, index) => ({
    ...period,
    order: index
  }));
};

export const normalizePeriods = (periods: PeriodRecord[], lecturesPerDay: number): PeriodRecord[] => {
  const next = clone(periods);
  const lecturePeriods = next.filter((period) => period.kind === 'LECTURE');
  const specialPeriods = next.filter((period) => period.kind !== 'LECTURE');

  while (lecturePeriods.length < lecturesPerDay) {
    lecturePeriods.push({
      id: createId(),
      kind: 'LECTURE',
      label: `Period ${lecturePeriods.length + 1}`,
      order: lecturePeriods.length
    });
  }

  if (lecturePeriods.length > lecturesPerDay) {
    lecturePeriods.length = lecturesPerDay;
  }

  const merged = [...specialPeriods, ...lecturePeriods].map((period, index) => ({
    ...period,
    order: index
  }));

  return merged.sort((a, b) => a.order - b.order).map((period, index) => ({
    ...period,
    order: index
  }));
};

export const ensureStorageShape = (raw: SchedulerStorage | null | undefined): SchedulerStorage => {
  if (!raw) {
    return createDefaultStorage();
  }

  const config = raw.config ?? createDefaultConfig();
  const college = getCollege(config.collegeId ?? collegeCatalog[0].id);
  const legacySettings = legacyPeriodsToSettings(config.periods ?? [], config.lecturesPerDay ?? 6);
  const breaks = config.breaks?.length ? config.breaks : legacySettings.breaks;
  const specialPeriods = config.specialPeriods?.length ? config.specialPeriods : legacySettings.specialPeriods;
  const specialPeriodsWithAnthem =
    specialPeriods.length > 0
      ? specialPeriods
      : [
          {
            id: createId(),
            name: 'National Anthem',
            placement: 'start',
            afterLecture: 0,
            startTime: isValidTime(config.dayStartTime) ? config.dayStartTime : '08:45',
            durationMinutes: 10,
            displayMode: 'full-width' as const
          } satisfies SpecialPeriodSetting
        ];
  const normalizedConfig: SchedulerConfig = {
    ...config,
    collegeId: college.id,
    collegeName: college.name,
    division: college.divisions.includes(config.division ?? '') ? (config.division as string) : college.divisions[0],
    workingDays: config.workingDays?.length ? config.workingDays : [...weekdays],
    lecturesPerDay: Math.max(1, Number(config.lecturesPerDay) || 6),
    staffCount: Math.max(0, Number(config.staffCount) || 0),
    subjectCount: Math.max(0, Number(config.subjectCount) || 0),
    lectureDurationMinutes: Math.max(1, Number(config.lectureDurationMinutes) || 50),
    dayStartTime: isValidTime(config.dayStartTime) ? config.dayStartTime : '08:45',
    dayEndTime: isValidTime(config.dayEndTime) ? config.dayEndTime : '15:00',
    breaks,
    specialPeriods: specialPeriodsWithAnthem,
    periods: []
  };

  return {
    config: {
      ...normalizedConfig,
      periods: buildSchedulePeriods(normalizedConfig)
    },
    faculty: raw.faculty?.length
      ? normalizeFacultyLinks(
          raw.faculty.map((member) => ({
            ...member,
            canHandlePractical: member.canHandlePractical ?? true,
            availability: cloneFacultyAvailability(member.availability),
            subjectIds: member.subjectIds ?? []
          })),
          raw.subjects ?? []
        )
      : createDefaultFaculty(),
    subjects: raw.subjects?.length
      ? raw.subjects.map((subject, index) => ({
          ...subject,
          assignedFacultyId: subject.assignedFacultyId ?? null,
          code: subject.code?.trim() ? subject.code : createDefaultSubjectCode(subject.name || 'Subject', index)
        }))
      : createDefaultSubjects(),
    timetable: raw.timetable
      ? {
          ...raw.timetable,
          collegeId: raw.timetable.collegeId ?? normalizedConfig.collegeId,
          collegeName: raw.timetable.collegeName ?? normalizedConfig.collegeName,
          division: raw.timetable.division ?? normalizedConfig.division
        }
      : null
  };
};

export const loadSchedulerStorage = (): SchedulerStorage => {
  if (typeof window === 'undefined') {
    return createDefaultStorage();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const next = createDefaultStorage();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    }
    return ensureStorageShape(JSON.parse(raw) as SchedulerStorage);
  } catch {
    const next = createDefaultStorage();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }
};

export const saveSchedulerStorage = (state: SchedulerStorage) => {
  if (typeof window === 'undefined') {
    return;
  }
  const next = ensureStorageShape(state);
  next.config.periods = buildSchedulePeriods(next.config);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};

export const makeFacultyAvailability = (initial?: Partial<FacultyAvailability>): FacultyAvailability =>
  cloneFacultyAvailability(initial);

export const parseTime = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

export const formatTime = (minutes: number) => {
  const safe = ((minutes % 1440) + 1440) % 1440;
  const hours = Math.floor(safe / 60)
    .toString()
    .padStart(2, '0');
  const mins = Math.floor(safe % 60)
    .toString()
    .padStart(2, '0');
  return `${hours}:${mins}`;
};

export const buildLectureTime = (dayStartTime: string, durationMinutes: number, lectureIndex: number) => {
  const start = parseTime(dayStartTime) + lectureIndex * durationMinutes;
  const end = start + durationMinutes;
  return {
    startTime: formatTime(start),
    endTime: formatTime(end),
    label: `${formatTime(start)} - ${formatTime(end)}`
  };
};

export const hydrateRows = (config: SchedulerConfig) => {
  const ordered = buildSchedulePeriods(config);
  return ordered.map((period, index) => ({
    ...period,
    order: index,
    timeLabel: `${period.startTime ?? '00:00'} - ${period.endTime ?? '00:00'}`,
    durationMinutes: period.durationMinutes ?? 0,
    displayMode: period.displayMode ?? 'per-day'
  }));
};

const subjectSessionUnits = (subject: SubjectRecord) =>
  subject.type === 'Practical' ? Math.max(2, subject.durationSlots || 2) : 1;

const subjectRemainingBlocks = (subject: SubjectRecord) => Math.max(1, Math.ceil(subject.hoursPerWeek / subjectSessionUnits(subject)));

const subjectPreferredDayWeight = (subject: SubjectRecord, day: Weekday) => {
  if (!subject.preferredDays.length) {
    return 0;
  }
  return subject.preferredDays.includes(day) ? 2 : -0.5;
};

const bestFacultyForSubject = (
  faculty: FacultyRecord[],
  subject: SubjectRecord,
  day: Weekday,
  loadState: Record<string, Record<Weekday, number>>
) => {
  const eligible = faculty
    .filter((member) => member.subjectIds.includes(subject.id) || member.id === subject.assignedFacultyId)
    .filter((member) => member.availability[day] !== 'on leave')
    .filter((member) => (loadState[member.id]?.[day] ?? 0) < member.maxLecturesPerDay)
    .filter((member) => (subject.type === 'Practical' ? member.canHandlePractical : true))
    .sort((a, b) => (loadState[a.id]?.[day] ?? 0) - (loadState[b.id]?.[day] ?? 0));

  if (subject.assignedFacultyId) {
    const preferred = eligible.find((member) => member.id === subject.assignedFacultyId);
    if (preferred) {
      return preferred;
    }
  }

  return eligible[0] ?? null;
};

const subjectScore = (subject: SubjectRecord, remainingBlocks: number, day: Weekday, dayIndex: number, totalDays: number) => {
  const spacing = totalDays - dayIndex;
  return remainingBlocks * 4 + subjectPreferredDayWeight(subject, day) + spacing * 0.1;
};

type DraftAssignment = {
  subject: SubjectRecord;
  faculty: FacultyRecord;
  rowSpan: number;
};

const makeEmptyCells = (rowsLength: number): ScheduleCell[] =>
  Array.from({ length: rowsLength }, () => ({ kind: 'EMPTY' as const, status: 'free' as const }));

export const generateTimetable = (
  config: SchedulerConfig,
  faculty: FacultyRecord[],
  subjects: SubjectRecord[],
  generationSeed = Date.now()
): GeneratedTimetable => {
  const rows = hydrateRows(config);
  const remaining = new Map(subjects.map((subject) => [subject.id, subjectRemainingBlocks(subject)]));
  const loadState: Record<string, Record<Weekday, number>> = faculty.reduce(
    (acc, member) => {
      acc[member.id] = weekdays.reduce(
        (dayAcc, day) => {
          dayAcc[day] = 0;
          return dayAcc;
        },
        {} as Record<Weekday, number>
      );
      return acc;
    },
    {} as Record<string, Record<Weekday, number>>
  );

  const warnings: string[] = [];
  const days: TimetableDay[] = config.workingDays.map((day, dayIndex) => {
    const cells = makeEmptyCells(rows.length);

    rows.forEach((row, rowIndex) => {
      if (row.kind === 'BREAK' || row.kind === 'MEDITATION') {
        cells[rowIndex] = {
          kind: 'SPECIAL',
          status: row.kind === 'BREAK' ? 'break' : 'meditation',
          label: row.label,
          timeLabel: row.timeLabel
        };
      }
    });

    const dayRng = pseudoRandom(generationSeed + dayIndex * 97);

    const pickBestAssignment = (rowIndex: number): DraftAssignment | null => {
      const candidates: DraftAssignment[] = [];

      for (const subject of subjects) {
        const blocksLeft = remaining.get(subject.id) ?? 0;
        if (blocksLeft <= 0) {
          continue;
        }

        if (subject.type === 'Practical') {
          const nextRow = rows[rowIndex + 1];
          if (!nextRow || nextRow.kind !== 'LECTURE' || cells[rowIndex + 1].kind !== 'EMPTY') {
            continue;
          }
          if (subject.preferredDays.length > 0 && !subject.preferredDays.includes(day)) {
            continue;
          }
          const facultyMember = bestFacultyForSubject(faculty, subject, day, loadState);
          if (!facultyMember) {
            continue;
          }
          candidates.push({
            subject,
            faculty: facultyMember,
            rowSpan: Math.min(subject.durationSlots || 2, 2)
          });
          continue;
        }

        const facultyMember = bestFacultyForSubject(faculty, subject, day, loadState);
        if (!facultyMember) {
          continue;
        }
        candidates.push({
          subject,
          faculty: facultyMember,
          rowSpan: 1
        });
      }

      if (!candidates.length) {
        return null;
      }

      candidates.sort((a, b) => {
        const scoreA = subjectScore(a.subject, remaining.get(a.subject.id) ?? 0, day, dayIndex, config.workingDays.length);
        const scoreB = subjectScore(b.subject, remaining.get(b.subject.id) ?? 0, day, dayIndex, config.workingDays.length);
        if (scoreA !== scoreB) {
          return scoreB - scoreA;
        }
        return dayRng() - 0.5;
      });

      return candidates[0] ?? null;
    };

    const fillLectureSlots = (rowIndex: number): boolean => {
      let current = rowIndex;

      while (current < rows.length && rows[current].kind !== 'LECTURE') {
        current += 1;
      }

      if (current >= rows.length) {
        return true;
      }

      if (cells[current].kind !== 'EMPTY') {
        return fillLectureSlots(current + 1);
      }

      const assignment = pickBestAssignment(current);
      if (assignment) {
        const { subject, faculty: facultyMember, rowSpan } = assignment;
        const units = subject.type === 'Practical' ? Math.max(2, subject.durationSlots || 2) : 1;
        const remainingBlocks = remaining.get(subject.id) ?? 0;
        if (subject.type === 'Practical') {
          if (current + 1 >= rows.length || rows[current + 1].kind !== 'LECTURE' || cells[current + 1].kind !== 'EMPTY') {
            warnings.push(`Unable to place practical ${subject.name} on ${day}.`);
            return fillLectureSlots(current + 1);
          }
        }

        cells[current] = {
          kind: 'LECTURE',
          status: 'scheduled',
          rowSpan,
          subjectId: subject.id,
          subjectName: subject.name,
          subjectCode: subject.code,
          subjectType: subject.type,
          facultyId: facultyMember.id,
          facultyName: facultyMember.name,
          roomName: subject.type === 'Practical' ? subject.labName || 'Lab' : 'Classroom',
          batch: subject.batch || undefined,
          durationSlots: units,
          timeLabel: rows[current].timeLabel,
          isPractical: subject.type === 'Practical'
        };
        loadState[facultyMember.id][day] += units;
        remaining.set(subject.id, Math.max(0, remainingBlocks - 1));

        if (subject.type === 'Practical') {
          cells[current + 1] = {
            kind: 'LECTURE',
            status: 'scheduled',
            rowSpan: 0,
            hidden: true,
            subjectId: subject.id,
            subjectName: subject.name,
            subjectCode: subject.code,
            subjectType: subject.type,
            facultyId: facultyMember.id,
            facultyName: facultyMember.name,
            roomName: subject.type === 'Practical' ? subject.labName || 'Lab' : 'Classroom',
            batch: subject.batch || undefined,
            durationSlots: units,
            timeLabel: rows[current + 1].timeLabel,
            isPractical: true
          };
          return fillLectureSlots(current + 2);
        }

        return fillLectureSlots(current + 1);
      }

      warnings.push(`No eligible subject found for ${day} ${rows[current].label}. Marked free/self study.`);
      cells[current] = {
        kind: 'LECTURE',
        status: 'free',
        rowSpan: 1,
        subjectName: 'FREE / Self Study',
        subjectCode: 'FREE',
        subjectType: 'Theory',
        facultyName: '—',
        roomName: '—',
        durationSlots: 1,
        timeLabel: rows[current].timeLabel,
        isPractical: false
      };
      return fillLectureSlots(current + 1);
    };

    fillLectureSlots(0);

    return {
      day,
      cells
    };
  });

  const leftoverSubjects = subjects
    .map((subject) => ({
      subject,
      remaining: remaining.get(subject.id) ?? 0
    }))
    .filter((item) => item.remaining > 0);

  leftoverSubjects.forEach((item) => {
    warnings.push(`${item.subject.name} still needs ${item.remaining} more slot(s) this week.`);
  });

  const leftoverFaculty = faculty.filter((member) => {
    const total = weekdays.reduce((sum, day) => sum + (loadState[member.id]?.[day] ?? 0), 0);
    return total > 0 && total > member.maxLecturesPerDay * config.workingDays.length;
  });
  if (leftoverFaculty.length) {
    warnings.push('One or more faculty members exceeded the configured daily workload.');
  }

  return {
    generatedAt: new Date().toISOString(),
    generationSeed,
    collegeId: config.collegeId,
    collegeName: config.collegeName,
    division: config.division,
    rows,
    days,
    substitutions: [],
    warnings
  };
};

export const findSubstitute = (
  timetable: GeneratedTimetable,
  faculty: FacultyRecord[],
  subjects: SubjectRecord[],
  day: Weekday,
  rowIndex: number
) => {
  const daySchedule = timetable.days.find((item) => item.day === day);
  if (!daySchedule) {
    return null;
  }

  const cell = daySchedule.cells[rowIndex];
  if (!cell || cell.kind !== 'LECTURE' || cell.hidden) {
    return null;
  }

  const subject = subjects.find((item) => item.id === cell.subjectId);
  if (!subject) {
    return null;
  }

  const dayLoads: Record<string, number> = {};
  faculty.forEach((member) => {
    dayLoads[member.id] = daySchedule.cells.filter((existing, index) => index !== rowIndex && existing.kind === 'LECTURE' && !existing.hidden && existing.facultyId === member.id).length;
  });

  const candidates = faculty
    .filter((member) => member.availability[day] !== 'on leave')
    .filter((member) => (dayLoads[member.id] ?? 0) < member.maxLecturesPerDay)
    .filter((member) => (subject.type === 'Practical' ? member.canHandlePractical : true))
    .map((member) => {
      const canTeachSubject = member.subjectIds.includes(subject.id) || member.id === subject.assignedFacultyId;
      const alternateSubject = subjects.find(
        (item) => (member.subjectIds.includes(item.id) || member.id === item.assignedFacultyId) && item.type === subject.type
      );
      return {
        member,
        canTeachSubject,
        alternateSubject
      };
    })
    .filter((item) => item.canTeachSubject || item.alternateSubject)
    .sort((a, b) => (dayLoads[a.member.id] ?? 0) - (dayLoads[b.member.id] ?? 0));

  const substitute = candidates[0];
  if (!substitute) {
    return null;
  }

  return {
    substituteFacultyId: substitute.member.id,
    substituteFacultyName: substitute.member.name,
    subjectId: subject.id,
    subjectName: subject.name,
    subjectType: subject.type
  };
};

export const applyAbsence = (
  timetable: GeneratedTimetable,
  faculty: FacultyRecord[],
  subjects: SubjectRecord[],
  day: Weekday,
  facultyId: string
) => {
  const updated = clone(timetable);
  const dayIndex = updated.days.findIndex((item) => item.day === day);
  if (dayIndex < 0) {
    return updated;
  }

  const daySchedule = updated.days[dayIndex];
  const substitutions: SubstitutionRecord[] = [];
  let warningCount = 0;

  daySchedule.cells.forEach((cell, rowIndex) => {
    if (cell.kind !== 'LECTURE' || cell.hidden || cell.facultyId !== facultyId) {
      return;
    }

    const substitute = findSubstitute(updated, faculty, subjects, day, rowIndex);
    const isPracticalBlock = cell.isPractical && cell.rowSpan > 1 && daySchedule.cells[rowIndex + 1]?.kind === 'LECTURE';
    if (substitute) {
      daySchedule.cells[rowIndex] = {
        ...cell,
        facultyId: substitute.substituteFacultyId,
        facultyName: substitute.substituteFacultyName ?? 'Substitute',
        status: 'substituted',
        isAbsent: true,
        substitutionLabel: `${cell.facultyName} → ${substitute.substituteFacultyName}`
      };
      if (isPracticalBlock && daySchedule.cells[rowIndex + 1].kind === 'LECTURE') {
        const nextCell = daySchedule.cells[rowIndex + 1] as Extract<ScheduleCell, { kind: 'LECTURE' }>;
        daySchedule.cells[rowIndex + 1] = {
          ...nextCell,
          facultyId: substitute.substituteFacultyId,
          facultyName: substitute.substituteFacultyName ?? 'Substitute',
          status: 'substituted',
          isAbsent: true,
          substitutionLabel: `${cell.facultyName} → ${substitute.substituteFacultyName}`
        };
      }
      substitutions.push({
        id: createId(),
        day,
        rowIndex,
        originalFacultyId: facultyId,
        originalFacultyName: cell.facultyName,
        substituteFacultyId: substitute.substituteFacultyId,
        substituteFacultyName: substitute.substituteFacultyName,
        subjectId: substitute.subjectId,
        subjectName: substitute.subjectName,
        subjectType: substitute.subjectType,
        status: 'substituted',
        note: `Substituted ${cell.subjectName} with ${substitute.substituteFacultyName}`
      });
      return;
    }

    daySchedule.cells[rowIndex] = {
      ...cell,
      status: 'free',
      facultyId: undefined,
      facultyName: 'FREE / Self Study',
      roomName: '—',
      isAbsent: true,
      substitutionLabel: `${cell.facultyName} absent`
    };
    if (isPracticalBlock && daySchedule.cells[rowIndex + 1].kind === 'LECTURE') {
      const nextCell = daySchedule.cells[rowIndex + 1] as Extract<ScheduleCell, { kind: 'LECTURE' }>;
      daySchedule.cells[rowIndex + 1] = {
        ...nextCell,
        status: 'free',
        facultyId: undefined,
        facultyName: 'FREE / Self Study',
        roomName: '—',
        isAbsent: true,
        substitutionLabel: `${cell.facultyName} absent`
      };
    }
    substitutions.push({
      id: createId(),
      day,
      rowIndex,
      originalFacultyId: facultyId,
      originalFacultyName: cell.facultyName,
      substituteFacultyId: null,
      substituteFacultyName: null,
      subjectId: cell.subjectId ?? '',
      subjectName: cell.subjectName,
      subjectType: cell.subjectType,
      status: 'free',
      note: `No substitute found for ${cell.subjectName} on ${day}; marked self study`
    });
    warningCount += 1;
  });

  updated.substitutions = [...substitutions, ...updated.substitutions];
  if (warningCount > 0) {
    updated.warnings = [...updated.warnings, `${warningCount} slot(s) on ${day} were marked FREE / Self Study because no substitute was available.`];
  }

  return updated;
};

export const weekdayLabel = (day: Weekday) => day;

export const summarizeWorkload = (faculty: FacultyRecord[], timetable: GeneratedTimetable | null) =>
  faculty.map((member) => {
    const total = timetable
      ? timetable.days.reduce(
          (sum, day) =>
            sum +
            day.cells.filter((cell) => cell.kind === 'LECTURE' && !cell.hidden && cell.facultyId === member.id).length,
          0
        )
      : 0;
    return {
      id: member.id,
      name: member.name,
      sessions: total,
      max: member.maxLecturesPerDay
    };
  });

const pseudoRandom = (seed: number) => {
  let value = seed % 2147483647;
  if (value <= 0) {
    value += 2147483646;
  }
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};
