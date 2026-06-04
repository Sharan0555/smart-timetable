'use client';

import { useEffect, useMemo, useReducer, useState } from 'react';
import type { Weekday } from '../../shared/types';
import {
  applyAbsence,
  collegeCatalog,
  createDefaultStorage,
  ensureStorageShape,
  generateTimetable,
  hydrateRows,
  loadSchedulerStorage,
  makeFacultyAvailability,
  normalizePeriods,
  saveSchedulerStorage,
  summarizeWorkload,
  weekdays,
  type BreakSetting,
  type FacultyAvailability,
  type FacultyRecord,
  type GeneratedTimetable,
  type PeriodKind,
  type PeriodRecord,
  type SchedulerConfig,
  type SchedulerStorage,
  type SubjectRecord,
  type SubjectType,
  type SpecialPeriodDisplayMode,
  type SpecialPeriodSetting,
} from '../lib/local-scheduler';

type WorkspaceState = SchedulerStorage;

type WorkspaceAction =
  | { type: 'replace'; payload: WorkspaceState }
  | { type: 'set-config-field'; field: keyof SchedulerConfig; value: SchedulerConfig[keyof SchedulerConfig] }
  | { type: 'set-periods'; payload: PeriodRecord[] }
  | { type: 'add-period'; payload: PeriodRecord }
  | { type: 'update-period'; id: string; updates: Partial<PeriodRecord> }
  | { type: 'move-period'; id: string; direction: 'up' | 'down' }
  | { type: 'remove-period'; id: string }
  | { type: 'add-faculty'; payload: FacultyRecord }
  | { type: 'update-faculty'; id: string; updates: Partial<FacultyRecord> }
  | { type: 'remove-faculty'; id: string }
  | { type: 'add-subject'; payload: SubjectRecord }
  | { type: 'update-subject'; id: string; updates: Partial<SubjectRecord> }
  | { type: 'remove-subject'; id: string }
  | { type: 'set-timetable'; payload: GeneratedTimetable | null };

const makeId = () => (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `id-${Math.random().toString(36).slice(2, 10)}`);

const isClockTime = (value: string) => {
  if (!/^\d{2}:\d{2}$/.test(value)) {
    return false;
  }
  const [hours, minutes] = value.split(':').map(Number);
  return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
};

const createEmptyFaculty = (): FacultyRecord => ({
  id: makeId(),
  name: '',
  subjectIds: [],
  maxLecturesPerDay: 4,
  canHandlePractical: true,
  availability: makeFacultyAvailability()
});

const createEmptySubject = (index?: number, assignedFacultyId: string | null = null): SubjectRecord => ({
  id: makeId(),
  name: '',
  code: typeof index === 'number' ? `SUB${String(index + 1).padStart(2, '0')}` : '',
  type: 'Theory',
  hoursPerWeek: 3,
  labName: '',
  batch: '',
  durationSlots: 2,
  preferredDays: [],
  assignedFacultyId
});

const resizeFacultyRecords = (faculty: FacultyRecord[], targetCount: number) => {
  if (targetCount <= faculty.length) {
    return faculty.slice(0, targetCount);
  }

  const next = [...faculty];
  while (next.length < targetCount) {
    next.push(createEmptyFaculty());
  }
  return next;
};

const resizeSubjectRecords = (subjects: SubjectRecord[], faculty: FacultyRecord[], targetCount: number) => {
  if (targetCount <= subjects.length) {
    return subjects.slice(0, targetCount);
  }

  const next = [...subjects];
  const defaultAssignedFacultyId = faculty[0]?.id ?? null;
  while (next.length < targetCount) {
    next.push(createEmptySubject(next.length, defaultAssignedFacultyId));
  }
  return next;
};

const initialState = (): WorkspaceState => createDefaultStorage();

const reducer = (state: WorkspaceState, action: WorkspaceAction): WorkspaceState => {
  switch (action.type) {
    case 'replace':
      return ensureStorageShape(action.payload);
    case 'set-config-field': {
      const config = { ...state.config, [action.field]: action.value } as SchedulerConfig;
      let faculty = state.faculty;
      let subjects = state.subjects;

      if (action.field === 'collegeId') {
        const college = collegeCatalog.find((item) => item.id === String(action.value)) ?? collegeCatalog[0];
        config.collegeName = college.name;
        config.division = college.divisions.includes(state.config.division) ? state.config.division : college.divisions[0];
      }

      if (action.field === 'division') {
        const college = collegeCatalog.find((item) => item.id === config.collegeId) ?? collegeCatalog[0];
        if (!college.divisions.includes(String(action.value))) {
          config.division = college.divisions[0];
        }
      }

      if (action.field === 'staffCount') {
        const nextCount = Math.max(0, Number(action.value));
        const removedFacultyIds = state.faculty.slice(nextCount).map((member) => member.id);
        faculty = resizeFacultyRecords(state.faculty, nextCount);
        if (removedFacultyIds.length) {
          subjects = state.subjects.map((subject) =>
            removedFacultyIds.includes(subject.assignedFacultyId ?? '') ? { ...subject, assignedFacultyId: null } : subject
          );
        }
        config.staffCount = nextCount;
      }

      if (action.field === 'subjectCount') {
        const nextCount = Math.max(0, Number(action.value));
        subjects = resizeSubjectRecords(state.subjects, faculty, nextCount);
        config.subjectCount = nextCount;
      }

      if (action.field === 'lecturesPerDay') {
        config.lecturesPerDay = Math.max(1, Number(action.value));
      }

      if (action.field === 'lectureDurationMinutes') {
        config.lectureDurationMinutes = Math.max(1, Number(action.value));
      }

      if (action.field === 'dayStartTime') {
        config.dayStartTime = String(action.value);
      }

      if (action.field === 'dayEndTime') {
        config.dayEndTime = String(action.value);
      }

      if (action.field === 'workingDays') {
        config.workingDays = action.value as Weekday[];
      }

      if (action.field === 'breaks') {
        config.breaks = action.value as BreakSetting[];
      }

      if (action.field === 'specialPeriods') {
        config.specialPeriods = action.value as SpecialPeriodSetting[];
      }

      config.periods = hydrateRows(config);
      return { ...state, config, faculty, subjects };
    }
    case 'set-periods':
      return {
        ...state,
        config: {
          ...state.config,
          periods: normalizePeriods(action.payload, state.config.lecturesPerDay)
        }
      };
    case 'add-period':
      return {
        ...state,
        config: {
          ...state.config,
          periods: normalizePeriods([...state.config.periods, action.payload], state.config.lecturesPerDay)
        }
      };
    case 'update-period':
      return {
        ...state,
        config: {
          ...state.config,
          periods: normalizePeriods(
            state.config.periods.map((period) => (period.id === action.id ? { ...period, ...action.updates } : period)),
            state.config.lecturesPerDay
          )
        }
      };
    case 'move-period': {
      const next = [...state.config.periods];
      const index = next.findIndex((period) => period.id === action.id);
      if (index < 0) {
        return state;
      }
      const swapIndex = action.direction === 'up' ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= next.length) {
        return state;
      }
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
      return {
        ...state,
        config: {
          ...state.config,
          periods: normalizePeriods(
            next.map((period, order) => ({
              ...period,
              order
            })),
            state.config.lecturesPerDay
          )
        }
      };
    }
    case 'remove-period':
      return {
        ...state,
        config: {
          ...state.config,
          periods: normalizePeriods(
            state.config.periods.filter((period) => period.id !== action.id),
            state.config.lecturesPerDay
          )
        }
      };
    case 'add-faculty':
      return { ...state, faculty: [action.payload, ...state.faculty] };
    case 'update-faculty':
      return {
        ...state,
        faculty: state.faculty.map((member) => (member.id === action.id ? { ...member, ...action.updates } : member))
      };
    case 'remove-faculty':
      return {
        ...state,
        faculty: state.faculty.filter((member) => member.id !== action.id),
        subjects: state.subjects.map((subject) =>
          subject.assignedFacultyId === action.id ? { ...subject, assignedFacultyId: null } : subject
        )
      };
    case 'add-subject':
      return { ...state, subjects: [action.payload, ...state.subjects] };
    case 'update-subject':
      return {
        ...state,
        subjects: state.subjects.map((subject) => (subject.id === action.id ? { ...subject, ...action.updates } : subject))
      };
    case 'remove-subject':
      return {
        ...state,
        subjects: state.subjects.filter((subject) => subject.id !== action.id),
        faculty: state.faculty.map((member) => ({
          ...member,
          subjectIds: member.subjectIds.filter((subjectId) => subjectId !== action.id)
        }))
      };
    case 'set-timetable':
      return { ...state, timetable: action.payload };
    default:
      return state;
  }
};

const dayOptions = weekdays;

const badgeForKind = (kind: PeriodKind) => (kind === 'BREAK' ? 'warning' : kind === 'MEDITATION' ? 'success' : 'primary');

const createNationalAnthemPeriod = (dayStartTime: string): SpecialPeriodSetting => ({
  id: makeId(),
  name: 'National Anthem',
  placement: 'start',
  afterLecture: 0,
  startTime: dayStartTime,
  durationMinutes: 10,
  displayMode: 'full-width'
});

const specialDisplayModeLabel: Record<SpecialPeriodDisplayMode, string> = {
  'per-day': 'Per day',
  'full-width': 'Full width'
};

const subjectTypeOptions: SubjectType[] = ['Theory', 'Practical'];

const BASE_TIMETABLE_KEY = 'smartSchedulerBaseTimetable';
const DAILY_TIMETABLE_PREFIX = 'smartSchedulerDailyTimetable:';
const SUBSTITUTION_PREFIX = 'substitutions_';

const dailyTimetableKey = (date: string) => `${DAILY_TIMETABLE_PREFIX}${date}`;
const substitutionKey = (date: string) => `${SUBSTITUTION_PREFIX}${date}`;

const loadJson = <T,>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const saveJson = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const removeJson = (key: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
};

export function SchedulerWorkspace({ defaultStep = 0 }: { defaultStep?: number }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [currentStep, setCurrentStep] = useState(defaultStep);
  const [message, setMessage] = useState('');
  const [generationCount, setGenerationCount] = useState(0);
  const [facultyDraft, setFacultyDraft] = useState<FacultyRecord>(createEmptyFaculty());
  const [subjectDraft, setSubjectDraft] = useState<SubjectRecord>(createEmptySubject());
  const [editingFacultyId, setEditingFacultyId] = useState<string | null>(null);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [absenceFacultyId, setAbsenceFacultyId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'faculty' | 'subject'; id: string } | null>(null);
  const [savedFlash, setSavedFlash] = useState<{ type: 'faculty' | 'subject'; id: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApplyingAbsence, setIsApplyingAbsence] = useState(false);
  const [inlineErrors, setInlineErrors] = useState<{ faculty?: string; subject?: string; generate?: string; absence?: string }>({});
  const [summaryOpen, setSummaryOpen] = useState(true);

  useEffect(() => {
    const stored = loadSchedulerStorage();
    const baseTimetable = loadJson<GeneratedTimetable>(BASE_TIMETABLE_KEY);
    const dailyTimetable = loadJson<GeneratedTimetable>(dailyTimetableKey(selectedDate));
    dispatch({
      type: 'replace',
      payload: {
        ...stored,
        timetable: dailyTimetable ?? stored.timetable ?? baseTimetable
      }
    });
    setHydrated(true);
  }, [selectedDate]);

  useEffect(() => {
    if (hydrated) {
      saveSchedulerStorage(state);
    }
  }, [hydrated, state]);

  useEffect(() => {
    if (!savedFlash) {
      return;
    }
    const timer = window.setTimeout(() => setSavedFlash(null), 1400);
    return () => window.clearTimeout(timer);
  }, [savedFlash]);

  const rows = useMemo(() => hydrateRows(state.config), [state.config]);
  const workload = useMemo(() => summarizeWorkload(state.faculty, state.timetable), [state.faculty, state.timetable]);
  const substitutions = state.timetable?.substitutions ?? [];
  const warnings = state.timetable?.warnings ?? [];
  const facultyCount = state.faculty.length;
  const subjectCount = state.subjects.length;
  const selectedCollege = collegeCatalog.find((college) => college.id === state.config.collegeId) ?? collegeCatalog[0];
  const canGenerate = state.config.workingDays.length > 0 && rows.some((period) => period.kind === 'LECTURE');

  const validateConfiguration = () => {
    const errors: string[] = [];
    const college = collegeCatalog.find((item) => item.id === state.config.collegeId);

    if (!college) {
      errors.push('Please select a college.');
    } else if (!college.divisions.includes(state.config.division)) {
      errors.push('Please select a valid division for the chosen college.');
    }

    if (!isClockTime(state.config.dayStartTime)) {
      errors.push('Please enter a valid start time for the first lecture.');
    }

    if (!Number.isFinite(state.config.lectureDurationMinutes) || state.config.lectureDurationMinutes < 15) {
      errors.push('Lecture duration must be at least 15 minutes.');
    }

    if (state.config.lecturesPerDay < 1) {
      errors.push('Number of lectures per day must be at least 1.');
    }

    state.faculty.forEach((member, index) => {
      if (!member.name.trim()) {
        errors.push(`Staff member ${index + 1} needs a name.`);
      }
    });

    state.subjects.forEach((subject, index) => {
      if (!subject.name.trim()) {
        errors.push(`Subject ${index + 1} needs a name.`);
      }
      if (!subject.assignedFacultyId) {
        errors.push(`Subject ${subject.name || index + 1} needs a staff assignment.`);
      } else if (!state.faculty.some((member) => member.id === subject.assignedFacultyId)) {
        errors.push(`Subject ${subject.name || index + 1} is assigned to a staff member that no longer exists.`);
      }
    });

    state.config.breaks.forEach((breakItem, index) => {
      if (!breakItem.label.trim()) {
        errors.push(`Break ${index + 1} needs a label.`);
      }
      if (breakItem.afterLecture < 1 || breakItem.afterLecture >= state.config.lecturesPerDay) {
        errors.push(`Break ${index + 1} must occur after a lecture between 1 and ${state.config.lecturesPerDay - 1}.`);
      }
      if (!Number.isFinite(breakItem.durationMinutes) || breakItem.durationMinutes < 1) {
        errors.push(`Break ${index + 1} needs a valid duration.`);
      }
    });

    state.config.specialPeriods.forEach((period, index) => {
      if (!period.name.trim()) {
        errors.push(`Special period ${index + 1} needs a name.`);
      }
      if (!isClockTime(period.startTime)) {
        errors.push(`Special period ${index + 1} needs a valid time.`);
      }
      if (!Number.isFinite(period.durationMinutes) || period.durationMinutes < 1) {
        errors.push(`Special period ${index + 1} needs a valid duration.`);
      }
      if (period.placement === 'between' && (period.afterLecture < 1 || period.afterLecture >= state.config.lecturesPerDay)) {
        errors.push(`Special period ${index + 1} placed between lectures must occur after a valid lecture.`);
      }
    });

    return errors;
  };

  const persistCurrentTimetable = (timetable: GeneratedTimetable | null) => {
    dispatch({ type: 'set-timetable', payload: timetable });
  };

  const onGenerate = async (reshuffle = false) => {
    setIsGenerating(true);
    setInlineErrors((current) => ({ ...current, generate: undefined }));
    try {
      const validationErrors = validateConfiguration();
      if (validationErrors.length) {
        setInlineErrors((current) => ({ ...current, generate: validationErrors.join(' ') }));
        return;
      }
      const nextSeed = Date.now() + generationCount + (reshuffle ? Math.floor(Math.random() * 1000) : 0);
      const generated = generateTimetable(state.config, state.faculty, state.subjects, nextSeed);
      const timetable = {
        ...generated,
        collegeId: state.config.collegeId,
        collegeName: state.config.collegeName,
        division: state.config.division,
        warnings: [...generated.warnings]
      };
      persistCurrentTimetable(timetable);
      saveJson(BASE_TIMETABLE_KEY, timetable);
      removeJson(dailyTimetableKey(selectedDate));
      setGenerationCount((value) => value + 1);
      setCurrentStep(2);
      setMessage(
        timetable.warnings.length
          ? `Generated timetable with ${timetable.warnings.length} warning(s).`
          : 'Timetable generated successfully.'
      );
    } catch {
      setInlineErrors((current) => ({ ...current, generate: 'Unable to generate timetable right now.' }));
    } finally {
      setIsGenerating(false);
    }
  };

  const onRegenerate = () => {
    void onGenerate(true);
  };

  const onMarkAbsent = async (day: Weekday, facultyId: string) => {
    if (!state.timetable) {
      return;
    }
    setIsApplyingAbsence(true);
    setInlineErrors((current) => ({ ...current, absence: undefined }));
    try {
      const updated = applyAbsence(state.timetable, state.faculty, state.subjects, day, facultyId);
      persistCurrentTimetable(updated);
      saveJson(dailyTimetableKey(selectedDate), updated);
      saveJson(substitutionKey(selectedDate), updated.substitutions);
      setAbsenceFacultyId(facultyId);
      setMessage(`Marked absence for ${day} and processed substitutions.`);
    } catch {
      setInlineErrors((current) => ({ ...current, absence: 'Unable to process substitution right now.' }));
    } finally {
      setIsApplyingAbsence(false);
    }
  };

  const saveFacultyDraft = () => {
    setInlineErrors((current) => ({ ...current, faculty: undefined }));
    if (!facultyDraft.name.trim()) {
      setInlineErrors((current) => ({ ...current, faculty: 'Faculty name is required.' }));
      return;
    }
    const duplicateName = state.faculty.some(
      (member) => member.id !== editingFacultyId && member.name.trim().toLowerCase() === facultyDraft.name.trim().toLowerCase()
    );
    if (duplicateName) {
      setInlineErrors((current) => ({ ...current, faculty: 'A faculty member with this name already exists.' }));
      return;
    }

    const payload: FacultyRecord = {
      ...facultyDraft,
      name: facultyDraft.name.trim(),
      subjectIds: facultyDraft.subjectIds,
      availability: facultyDraft.availability
    };

    if (editingFacultyId) {
      dispatch({ type: 'update-faculty', id: editingFacultyId, updates: payload });
      setSavedFlash({ type: 'faculty', id: editingFacultyId });
      setEditingFacultyId(null);
    } else {
      dispatch({ type: 'add-faculty', payload });
    }

    setFacultyDraft(createEmptyFaculty());
    setMessage('Faculty saved.');
  };

  const saveSubjectDraft = () => {
    setInlineErrors((current) => ({ ...current, subject: undefined }));
    if (!subjectDraft.name.trim()) {
      setInlineErrors((current) => ({ ...current, subject: 'Subject name is required.' }));
      return;
    }
    const normalizedCode = subjectDraft.code.trim()
      ? subjectDraft.code.trim().toUpperCase()
      : subjectDraft.name.trim().replace(/[^a-zA-Z0-9]+/g, ' ').trim().split(/\s+/).map((part) => part.slice(0, 3).toUpperCase()).join('') ||
        `SUB${String(state.subjects.length + 1).padStart(2, '0')}`;
    const duplicateName = state.subjects.some(
      (subject) => subject.id !== editingSubjectId && subject.name.trim().toLowerCase() === subjectDraft.name.trim().toLowerCase()
    );
    const duplicateCode = state.subjects.some(
      (subject) => subject.id !== editingSubjectId && subject.code.trim().toLowerCase() === normalizedCode.toLowerCase()
    );
    if (duplicateName || duplicateCode) {
      setInlineErrors((current) => ({
        ...current,
        subject: duplicateName ? 'A subject with this name already exists.' : 'A subject with this code already exists.'
      }));
      return;
    }

    const payload: SubjectRecord = {
      ...subjectDraft,
      name: subjectDraft.name.trim(),
      code: normalizedCode,
      labName: subjectDraft.type === 'Practical' ? subjectDraft.labName.trim() : '',
      batch: subjectDraft.type === 'Practical' ? subjectDraft.batch.trim() : '',
      durationSlots: subjectDraft.type === 'Practical' ? Math.max(2, subjectDraft.durationSlots || 2) : 1,
      assignedFacultyId: subjectDraft.assignedFacultyId ?? null
    };

    if (editingSubjectId) {
      dispatch({ type: 'update-subject', id: editingSubjectId, updates: payload });
      setSavedFlash({ type: 'subject', id: editingSubjectId });
      setEditingSubjectId(null);
    } else {
      dispatch({ type: 'add-subject', payload });
    }

    setSubjectDraft(createEmptySubject());
    setMessage('Subject saved.');
  };

  const beginEditFaculty = (member: FacultyRecord) => {
    setEditingFacultyId(member.id);
    setFacultyDraft(member);
  };

  const cancelEditFaculty = () => {
    setEditingFacultyId(null);
    setFacultyDraft(createEmptyFaculty());
  };

  const beginEditSubject = (subject: SubjectRecord) => {
    setEditingSubjectId(subject.id);
    setSubjectDraft(subject);
  };

  const cancelEditSubject = () => {
    setEditingSubjectId(null);
    setSubjectDraft(createEmptySubject());
  };

  const deleteFaculty = (id: string) => {
    const member = state.faculty.find((item) => item.id === id);
    if (!member) {
      return;
    }
    setDeleteConfirm({ type: 'faculty', id });
  };

  const deleteSubject = (id: string) => {
    const subject = state.subjects.find((item) => item.id === id);
    if (!subject) {
      return;
    }
    setDeleteConfirm({ type: 'subject', id });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) {
      return;
    }
    if (deleteConfirm.type === 'faculty') {
      dispatch({ type: 'remove-faculty', id: deleteConfirm.id });
      if (editingFacultyId === deleteConfirm.id) {
        cancelEditFaculty();
      }
      setMessage('Faculty deleted.');
    } else {
      dispatch({ type: 'remove-subject', id: deleteConfirm.id });
      if (editingSubjectId === deleteConfirm.id) {
        cancelEditSubject();
      }
      setMessage('Subject deleted.');
    }
    setDeleteConfirm(null);
  };

  const resetDay = () => {
    removeJson(dailyTimetableKey(selectedDate));
    removeJson(substitutionKey(selectedDate));
    const baseTimetable = loadJson<GeneratedTimetable>(BASE_TIMETABLE_KEY);
    if (baseTimetable) {
      persistCurrentTimetable(baseTimetable);
    }
    setAbsenceFacultyId(null);
    setMessage(`Substitutions reset for ${selectedDate}.`);
  };

  const updateAvailability = (
    current: FacultyAvailability,
    day: Weekday,
    value: 'available' | 'on leave'
  ) => ({
    ...current,
    [day]: value
  });

  const renderStep = () => (
    <div className="scheduler-stepper">
      {['Setup', 'Faculty & Subjects', 'Timetable'].map((label, index) => (
        <button
          key={label}
          type="button"
          className={`scheduler-step ${currentStep === index ? 'active' : ''}`}
          onClick={() => setCurrentStep(index)}
        >
          <span>{index + 1}</span>
          {label}
        </button>
      ))}
    </div>
  );

  const periodRows = useMemo(() => rows, [rows]);

  const selectedFacultyForAbsent = absenceFacultyId ? state.faculty.find((member) => member.id === absenceFacultyId) : null;
  const selectedWeekday = useMemo(() => {
    const index = new Date(`${selectedDate}T00:00:00`).getDay();
    return weekdays[(index + 6) % 7];
  }, [selectedDate]);

  return (
    <div className="scheduler-workspace">
      <div className="topbar hero">
        <div>
          <h2>Smart Class Scheduler</h2>
          <p>
            Build the configuration first, manage faculty and subjects inline, then generate a conflict-aware multi-day timetable
            entirely on the client.
          </p>
        </div>
        <div className="scheduler-actions">
          <button
            className="button secondary"
            type="button"
            onClick={() => {
              saveSchedulerStorage(state);
              setMessage('Configuration saved to localStorage.');
            }}
          >
            Save Configuration
          </button>
          <button className="button secondary" type="button" onClick={() => onRegenerate()} disabled={!state.timetable}>
            Regenerate
          </button>
          <button className="button" type="button" onClick={() => window.print()} disabled={!state.timetable}>
            Print / Export PDF
          </button>
        </div>
      </div>

      {renderStep()}

      <div className="scheduler-summary-grid">
        <div className="card">
          <h3>College</h3>
          <div className="value">{selectedCollege.name}</div>
          <p className="muted">{state.config.division}</p>
        </div>
        <div className="card">
          <h3>Division</h3>
          <div className="value">{state.config.division}</div>
          <p className="muted">{selectedCollege.divisions.length} available division(s)</p>
        </div>
        <div className="card">
          <h3>Staff</h3>
          <div className="value">{state.config.staffCount}</div>
          <p className="muted">{facultyCount} staff records configured</p>
        </div>
        <div className="card">
          <h3>Subjects</h3>
          <div className="value">{state.config.subjectCount}</div>
          <p className="muted">{subjectCount} subjects configured</p>
        </div>
        <div className="card">
          <h3>Schedule</h3>
          <div className="value">{state.config.lecturesPerDay}</div>
          <p className="muted">
            {state.config.breaks.length} break(s), {state.config.specialPeriods.length} special period(s)
          </p>
        </div>
      </div>

      {currentStep === 0 ? (
        <section className="scheduler-section grid">
          <div className="grid cards two-up">
            <div className="card form">
              <h3>College & Division</h3>
              <div className="field">
                <label>College</label>
                <select
                  value={state.config.collegeId}
                  onChange={(event) => dispatch({ type: 'set-config-field', field: 'collegeId', value: event.target.value })}
                >
                  {collegeCatalog.map((college) => (
                    <option key={college.id} value={college.id}>
                      {college.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Division</label>
                <select
                  value={state.config.division}
                  onChange={(event) => dispatch({ type: 'set-config-field', field: 'division', value: event.target.value })}
                >
                  {selectedCollege.divisions.map((division) => (
                    <option key={division} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
              </div>
              <p className="muted">
                {selectedCollege.name} · {state.config.division}
              </p>
            </div>

            <div className="card form">
              <h3>Core Schedule</h3>
              <div className="field">
                <label>Number of staff members</label>
                <input
                  type="number"
                  min={0}
                  value={state.config.staffCount}
                  onChange={(event) => dispatch({ type: 'set-config-field', field: 'staffCount', value: Number(event.target.value) })}
                />
              </div>
              <div className="field">
                <label>Number of subjects</label>
                <input
                  type="number"
                  min={0}
                  value={state.config.subjectCount}
                  onChange={(event) => dispatch({ type: 'set-config-field', field: 'subjectCount', value: Number(event.target.value) })}
                />
              </div>
              <div className="field">
                <label>Lectures per day</label>
                <input
                  type="number"
                  min={1}
                  value={state.config.lecturesPerDay}
                  onChange={(event) => dispatch({ type: 'set-config-field', field: 'lecturesPerDay', value: Number(event.target.value) })}
                />
              </div>
              <div className="field">
                <label>Start time of first lecture</label>
                <input
                  type="time"
                  value={state.config.dayStartTime}
                  onChange={(event) => dispatch({ type: 'set-config-field', field: 'dayStartTime', value: event.target.value })}
                />
              </div>
              <div className="field">
                <label>Duration of each lecture period</label>
                <input
                  type="number"
                  min={15}
                  step={5}
                  value={state.config.lectureDurationMinutes}
                  onChange={(event) =>
                    dispatch({ type: 'set-config-field', field: 'lectureDurationMinutes', value: Number(event.target.value) })
                  }
                />
              </div>
              <div className="field">
                <label>Working days</label>
                <div className="chip-row">
                  {dayOptions.map((day) => (
                    <button
                      key={day}
                      type="button"
                      className={`chip ${state.config.workingDays.includes(day) ? 'active' : ''}`}
                      onClick={() => {
                        const next = state.config.workingDays.includes(day)
                          ? state.config.workingDays.filter((item) => item !== day)
                          : [...state.config.workingDays, day];
                        dispatch({ type: 'set-config-field', field: 'workingDays', value: next });
                      }}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid cards two-up">
            <div className="card form">
              <h3>Staff Members</h3>
              <p className="muted">Dynamic fields appear automatically when you change the staff count.</p>
              <div className="stacked-fields">
                {state.faculty.map((member, index) => (
                  <div key={member.id} className="stacked-field-row">
                    <div className="field">
                      <label>Staff {index + 1}</label>
                      <input
                        value={member.name}
                        onChange={(event) =>
                          dispatch({
                            type: 'update-faculty',
                            id: member.id,
                            updates: { name: event.target.value }
                          })
                        }
                        placeholder="Enter staff name"
                      />
                    </div>
                  </div>
                ))}
                {!state.faculty.length ? <p className="muted">Increase the staff count to add staff fields.</p> : null}
              </div>
            </div>

            <div className="card form">
              <h3>Subjects</h3>
              <p className="muted">Each subject needs a name and an assigned staff member.</p>
              <div className="stacked-fields">
                {state.subjects.map((subject, index) => (
                  <div key={subject.id} className="subject-config-row">
                    <div className="field">
                      <label>Subject {index + 1}</label>
                      <input
                        value={subject.name}
                        onChange={(event) =>
                          dispatch({
                            type: 'update-subject',
                            id: subject.id,
                            updates: { name: event.target.value }
                          })
                        }
                        placeholder="Enter subject name"
                      />
                    </div>
                    <div className="field">
                      <label>Assigned staff</label>
                      <select
                        value={subject.assignedFacultyId ?? ''}
                        onChange={(event) =>
                          dispatch({
                            type: 'update-subject',
                            id: subject.id,
                            updates: { assignedFacultyId: event.target.value || null }
                          })
                        }
                      >
                        <option value="">Select staff member</option>
                        {state.faculty.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name || `Staff ${state.faculty.findIndex((item) => item.id === member.id) + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="inline-meta-row">
                      <span className="badge primary">{subject.code}</span>
                      <span className="muted">
                        {subject.type} · {subject.hoursPerWeek} hrs/week
                      </span>
                    </div>
                  </div>
                ))}
                {!state.subjects.length ? <p className="muted">Increase the subject count to add subject fields.</p> : null}
              </div>
            </div>
          </div>

          <div className="grid cards two-up">
            <div className="card form">
              <h3>Break Settings</h3>
              <div className="field">
                <label>Number of breaks</label>
                <input
                  type="number"
                  min={0}
                  value={state.config.breaks.length}
                  onChange={(event) => {
                    const nextCount = Math.max(0, Number(event.target.value));
                    const nextBreaks = [...state.config.breaks];
                    while (nextBreaks.length < nextCount) {
                      nextBreaks.push({
                        id: makeId(),
                        label: `Break ${nextBreaks.length + 1}`,
                        afterLecture: Math.max(1, Math.min(state.config.lecturesPerDay - 1, nextBreaks.length + 1)),
                        durationMinutes: 15
                      });
                    }
                    dispatch({ type: 'set-config-field', field: 'breaks', value: nextBreaks.slice(0, nextCount) });
                  }}
                />
              </div>
              <div className="stacked-fields">
                {state.config.breaks.map((breakItem, index) => (
                  <div key={breakItem.id} className="subject-config-row">
                    <div className="field">
                      <label>Break {index + 1} after lecture</label>
                      <input
                        type="number"
                        min={1}
                        max={Math.max(1, state.config.lecturesPerDay - 1)}
                        value={breakItem.afterLecture}
                        onChange={(event) =>
                          dispatch({
                            type: 'set-config-field',
                            field: 'breaks',
                            value: state.config.breaks.map((item) =>
                              item.id === breakItem.id ? { ...item, afterLecture: Number(event.target.value) } : item
                            )
                          })
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Duration (minutes)</label>
                      <input
                        type="number"
                        min={1}
                        value={breakItem.durationMinutes}
                        onChange={(event) =>
                          dispatch({
                            type: 'set-config-field',
                            field: 'breaks',
                            value: state.config.breaks.map((item) =>
                              item.id === breakItem.id ? { ...item, durationMinutes: Number(event.target.value) } : item
                            )
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
                {!state.config.breaks.length ? <p className="muted">No breaks configured yet.</p> : null}
              </div>
            </div>

            <div className="card form">
              <h3>Special Periods</h3>
              <div className="scheduler-inline-actions">
                <button
                  className="button secondary"
                  type="button"
                  onClick={() =>
                    dispatch({
                      type: 'set-config-field',
                      field: 'specialPeriods',
                      value: (
                        state.config.specialPeriods.some((item) => item.name.trim().toLowerCase() === 'national anthem')
                          ? state.config.specialPeriods.map((item) =>
                              item.name.trim().toLowerCase() === 'national anthem'
                                ? ({
                                    ...item,
                                    placement: 'start',
                                    afterLecture: 0,
                                    startTime: state.config.dayStartTime,
                                    durationMinutes: 10,
                                    displayMode: 'full-width'
                                  } satisfies SpecialPeriodSetting)
                                : item
                            )
                          : [createNationalAnthemPeriod(state.config.dayStartTime), ...state.config.specialPeriods]
                      ) as SpecialPeriodSetting[]
                    })
                  }
                >
                  Add National Anthem
                </button>
              </div>
              <div className="field">
                <label>Number of special periods</label>
                <input
                  type="number"
                  min={0}
                  value={state.config.specialPeriods.length}
                  onChange={(event) => {
                    const nextCount = Math.max(0, Number(event.target.value));
                    const nextPeriods = [...state.config.specialPeriods];
                    while (nextPeriods.length < nextCount) {
                      nextPeriods.push({
                        id: makeId(),
                        name: `Prayer / Assembly ${nextPeriods.length + 1}`,
                        placement: 'start',
                        afterLecture: 0,
                        startTime: state.config.dayStartTime,
                        durationMinutes: 15,
                        displayMode: 'per-day'
                      });
                    }
                    dispatch({ type: 'set-config-field', field: 'specialPeriods', value: nextPeriods.slice(0, nextCount) });
                  }}
                />
              </div>
              <div className="stacked-fields">
                {state.config.specialPeriods.map((period, index) => (
                  <div key={period.id} className="subject-config-row">
                    <div className="field">
                      <label>Period name</label>
                      <input
                        value={period.name}
                        onChange={(event) =>
                          dispatch({
                            type: 'set-config-field',
                            field: 'specialPeriods',
                            value: state.config.specialPeriods.map((item) =>
                              item.id === period.id ? { ...item, name: event.target.value } : item
                            )
                          })
                        }
                        placeholder="Prayer / Assembly"
                      />
                    </div>
                    <div className="field">
                      <label>Placement</label>
                      <select
                        value={period.placement}
                        onChange={(event) =>
                          dispatch({
                            type: 'set-config-field',
                            field: 'specialPeriods',
                            value: state.config.specialPeriods.map((item) =>
                              item.id === period.id
                                ? {
                                    ...item,
                                    placement: event.target.value as SpecialPeriodSetting['placement'],
                                    afterLecture: event.target.value === 'between' ? Math.max(1, item.afterLecture || 1) : item.afterLecture
                                  }
                                : item
                            )
                          })
                        }
                      >
                        <option value="start">Start</option>
                        <option value="between">Between lectures</option>
                        <option value="end">End</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Layout</label>
                      <select
                        value={period.displayMode ?? 'per-day'}
                        onChange={(event) =>
                          dispatch({
                            type: 'set-config-field',
                            field: 'specialPeriods',
                            value: state.config.specialPeriods.map((item) =>
                              item.id === period.id
                                ? {
                                    ...item,
                                    displayMode: event.target.value as SpecialPeriodDisplayMode,
                                    afterLecture: event.target.value === 'full-width' ? 0 : item.afterLecture
                                  }
                                : item
                            )
                          })
                        }
                      >
                        {Object.entries(specialDisplayModeLabel).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {period.placement === 'between' ? (
                      <div className="field">
                        <label>After lecture</label>
                        <input
                          type="number"
                          min={1}
                          max={Math.max(1, state.config.lecturesPerDay - 1)}
                          value={period.afterLecture}
                          onChange={(event) =>
                            dispatch({
                              type: 'set-config-field',
                              field: 'specialPeriods',
                              value: state.config.specialPeriods.map((item) =>
                                item.id === period.id ? { ...item, afterLecture: Number(event.target.value) } : item
                              )
                            })
                          }
                        />
                      </div>
                    ) : (
                      <div className="field">
                        <label>After lecture</label>
                        <input type="number" value={period.afterLecture} disabled />
                      </div>
                    )}
                    <div className="field">
                      <label>Time</label>
                      <input
                        type="time"
                        value={period.startTime}
                        onChange={(event) =>
                          dispatch({
                            type: 'set-config-field',
                            field: 'specialPeriods',
                            value: state.config.specialPeriods.map((item) =>
                              item.id === period.id ? { ...item, startTime: event.target.value } : item
                            )
                          })
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Duration (minutes)</label>
                      <input
                        type="number"
                        min={1}
                        value={period.durationMinutes}
                        onChange={(event) =>
                          dispatch({
                            type: 'set-config-field',
                            field: 'specialPeriods',
                            value: state.config.specialPeriods.map((item) =>
                              item.id === period.id ? { ...item, durationMinutes: Number(event.target.value) } : item
                            )
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
                {!state.config.specialPeriods.length ? <p className="muted">No special periods configured yet.</p> : null}
              </div>
            </div>
          </div>

          <div className="card form">
            <h3>Timetable Preview</h3>
            <p className="muted">This preview reflects the current lecture, break, and special-period structure that will be used to generate the timetable.</p>
              <div className="period-list">
                {periodRows.map((period) => (
                  <div className="period-row" key={period.id}>
                    <div className="period-main">
                      <div className="period-title">
                        <strong>{period.label}</strong>
                        <span className={`badge ${badgeForKind(period.kind)}`}>{period.kind}</span>
                        {period.kind !== 'LECTURE' ? (
                          <span className="badge secondary">{specialDisplayModeLabel[period.displayMode ?? 'per-day']}</span>
                        ) : null}
                      </div>
                      <div className="period-meta">
                        <span>{period.timeLabel}</span>
                      </div>
                    </div>
                  <span className="badge primary">{period.durationMinutes} min</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {currentStep === 1 ? (
        <section className="scheduler-section grid">
          <div className="grid cards two-up">
            <form
              className="card form"
              onSubmit={(event) => {
                event.preventDefault();
                saveFacultyDraft();
              }}
            >
              <h3>{editingFacultyId ? 'Edit Faculty' : 'Add Faculty'}</h3>
              <div className="field">
                <label>Name</label>
                <input
                  value={facultyDraft.name}
                  onChange={(event) => setFacultyDraft((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Faculty name"
                />
              </div>
              <div className="field">
                <label>Subjects they can teach</label>
                <select
                  multiple
                  value={facultyDraft.subjectIds}
                  onChange={(event) =>
                    setFacultyDraft((current) => ({
                      ...current,
                      subjectIds: Array.from(event.target.selectedOptions).map((option) => option.value)
                    }))
                  }
                >
                  {state.subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.code} - {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Max lectures/day</label>
                <input
                  type="number"
                  min={1}
                  value={facultyDraft.maxLecturesPerDay}
                  onChange={(event) =>
                    setFacultyDraft((current) => ({ ...current, maxLecturesPerDay: Number(event.target.value) }))
                  }
                />
              </div>
              <div className="field">
                <label>Practical capable</label>
                <label className="toggle-row">
                  <input
                    type="checkbox"
                    checked={facultyDraft.canHandlePractical}
                    onChange={(event) => setFacultyDraft((current) => ({ ...current, canHandlePractical: event.target.checked }))}
                  />
                  <span>Faculty can handle practical sessions</span>
                </label>
              </div>
              <div className="field">
                <label>Availability by day</label>
                <div className="day-availability-grid">
                  {dayOptions.map((day) => (
                    <div key={day} className="day-availability-pill">
                      <span>{day.slice(0, 3)}</span>
                      <select
                        value={facultyDraft.availability[day]}
                        onChange={(event) =>
                          setFacultyDraft((current) => ({
                            ...current,
                            availability: updateAvailability(current.availability, day, event.target.value as 'available' | 'on leave')
                          }))
                        }
                      >
                        <option value="available">Available</option>
                        <option value="on leave">On leave</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              <div className="scheduler-inline-actions">
                <button className="button" type="submit">
                  {editingFacultyId ? 'Save Faculty' : 'Add Faculty'}
                </button>
                {editingFacultyId ? (
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => {
                      setEditingFacultyId(null);
                      setFacultyDraft(createEmptyFaculty());
                    }}
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>

            <form
              className="card form"
              onSubmit={(event) => {
                event.preventDefault();
                saveSubjectDraft();
              }}
            >
              <h3>{editingSubjectId ? 'Edit Subject' : 'Add Subject'}</h3>
              <div className="field">
                <label>Subject name</label>
                <input
                  value={subjectDraft.name}
                  onChange={(event) => setSubjectDraft((current) => ({ ...current, name: event.target.value }))}
                  placeholder="e.g. Data Structures"
                />
              </div>
              <div className="field">
                <label>Subject code</label>
                <input
                  value={subjectDraft.code}
                  onChange={(event) => setSubjectDraft((current) => ({ ...current, code: event.target.value }))}
                  placeholder="e.g. CS201"
                />
              </div>
              <div className="field">
                <label>Type</label>
                <select
                  value={subjectDraft.type}
                  onChange={(event) =>
                    setSubjectDraft((current) => ({
                      ...current,
                      type: event.target.value as SubjectType,
                      durationSlots: event.target.value === 'Practical' ? Math.max(2, current.durationSlots) : 1
                    }))
                  }
                >
                  {subjectTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Hours / week</label>
                <input
                  type="number"
                  min={1}
                  value={subjectDraft.hoursPerWeek}
                  onChange={(event) => setSubjectDraft((current) => ({ ...current, hoursPerWeek: Number(event.target.value) }))}
                />
              </div>
              <div className="field">
                <label>Assigned staff member</label>
                <select
                  value={subjectDraft.assignedFacultyId ?? ''}
                  onChange={(event) =>
                    setSubjectDraft((current) => ({
                      ...current,
                      assignedFacultyId: event.target.value || null
                    }))
                  }
                >
                  <option value="">Select staff member</option>
                  {state.faculty.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name || 'Unnamed staff'}
                    </option>
                  ))}
                </select>
              </div>
              {subjectDraft.type === 'Practical' ? (
                <>
                  <div className="field">
                    <label>Lab name</label>
                    <input
                      value={subjectDraft.labName}
                      onChange={(event) => setSubjectDraft((current) => ({ ...current, labName: event.target.value }))}
                      placeholder="e.g. Lab A"
                    />
                  </div>
                  <div className="field">
                    <label>Batch</label>
                    <input
                      value={subjectDraft.batch}
                      onChange={(event) => setSubjectDraft((current) => ({ ...current, batch: event.target.value }))}
                      placeholder="Optional batch name"
                    />
                  </div>
                  <div className="field">
                    <label>Duration / slots</label>
                    <input
                      type="number"
                      min={2}
                      value={subjectDraft.durationSlots}
                      onChange={(event) =>
                        setSubjectDraft((current) => ({ ...current, durationSlots: Number(event.target.value) }))
                      }
                    />
                  </div>
                  <div className="field">
                    <label>Preferred days for practicals</label>
                    <div className="chip-row">
                      {dayOptions.map((day) => (
                        <button
                          key={day}
                          type="button"
                          className={`chip ${subjectDraft.preferredDays.includes(day) ? 'active' : ''}`}
                          onClick={() =>
                            setSubjectDraft((current) => ({
                              ...current,
                              preferredDays: current.preferredDays.includes(day)
                                ? current.preferredDays.filter((item) => item !== day)
                                : [...current.preferredDays, day]
                            }))
                          }
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
              <div className="scheduler-inline-actions">
                <button className="button" type="submit">
                  {editingSubjectId ? 'Save Subject' : 'Add Subject'}
                </button>
                {editingSubjectId ? (
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => {
                      setEditingSubjectId(null);
                      setSubjectDraft(createEmptySubject());
                    }}
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </div>

          <div className="grid cards two-up">
            <div className="card form">
              <h3>Faculty Management</h3>
              <div className="table-wrap">
                <table className="scheduler-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Subjects</th>
                      <th>Max / Day</th>
                      <th>Practical</th>
                      <th>Availability</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.faculty.map((member) => {
                      const editing = editingFacultyId === member.id;
                      const subjectNames = state.subjects
                        .filter((subject) => member.subjectIds.includes(subject.id) || subject.assignedFacultyId === member.id)
                        .map((subject) => subject.code || subject.name)
                        .join(', ');
                      return (
                        <tr
                          key={member.id}
                          className={`${
                            editing ? 'editing-row' : ''
                          } ${savedFlash?.type === 'faculty' && savedFlash.id === member.id ? 'saved-row' : ''}`}
                        >
                          <td>
                            {editing ? (
                              <input
                                value={facultyDraft.name}
                                onChange={(event) => setFacultyDraft((current) => ({ ...current, name: event.target.value }))}
                              />
                            ) : (
                              member.name
                            )}
                          </td>
                          <td>
                            {editing ? (
                              <select
                                multiple
                                value={facultyDraft.subjectIds}
                                onChange={(event) =>
                                  setFacultyDraft((current) => ({
                                    ...current,
                                    subjectIds: Array.from(event.target.selectedOptions).map((option) => option.value)
                                  }))
                                }
                              >
                                {state.subjects.map((subject) => (
                                  <option key={subject.id} value={subject.id}>
                                    {subject.code} - {subject.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="muted">{subjectNames || 'None'}</span>
                            )}
                          </td>
                          <td>
                            {editing ? (
                              <input
                                type="number"
                                min={1}
                                value={facultyDraft.maxLecturesPerDay}
                                onChange={(event) =>
                                  setFacultyDraft((current) => ({ ...current, maxLecturesPerDay: Number(event.target.value) }))
                                }
                              />
                            ) : (
                              member.maxLecturesPerDay
                            )}
                          </td>
                          <td>
                            {editing ? (
                              <label className="toggle-row">
                                <input
                                  type="checkbox"
                                  checked={facultyDraft.canHandlePractical}
                                  onChange={(event) =>
                                    setFacultyDraft((current) => ({ ...current, canHandlePractical: event.target.checked }))
                                  }
                                />
                                <span>Can handle practical</span>
                              </label>
                            ) : (
                              <span className={`badge ${member.canHandlePractical ? 'success' : 'warning'}`}>
                                {member.canHandlePractical ? 'Practical ready' : 'Theory only'}
                              </span>
                            )}
                          </td>
                          <td>
                            {editing ? (
                              <div className="mini-day-grid">
                                {dayOptions.map((day) => (
                                  <select
                                    key={day}
                                    value={facultyDraft.availability[day]}
                                    onChange={(event) =>
                                      setFacultyDraft((current) => ({
                                        ...current,
                                        availability: updateAvailability(
                                          current.availability,
                                          day,
                                          event.target.value as 'available' | 'on leave'
                                        )
                                      }))
                                    }
                                  >
                                    <option value="available">{day.slice(0, 3)} On</option>
                                    <option value="on leave">{day.slice(0, 3)} Off</option>
                                  </select>
                                ))}
                              </div>
                            ) : (
                              <div className="chip-row">
                                {dayOptions.map((day) => (
                                  <span key={day} className={`badge ${member.availability[day] === 'available' ? 'success' : 'warning'}`}>
                                    {day.slice(0, 3)} {member.availability[day] === 'available' ? 'On' : 'Off'}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="scheduler-inline-actions">
                              {editing ? (
                                <>
                                  <button className="button button-sm" type="button" onClick={() => void saveFacultyDraft()}>
                                    Save
                                  </button>
                                  <button className="button secondary button-sm" type="button" onClick={cancelEditFaculty}>
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button className="button secondary button-sm" type="button" onClick={() => beginEditFaculty(member)}>
                                    Edit
                                  </button>
                                  <button className="button secondary button-sm" type="button" onClick={() => void deleteFaculty(member.id)}>
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                            {deleteConfirm?.type === 'faculty' && deleteConfirm.id === member.id ? (
                              <div className="inline-confirm">
                                <span>Delete {member.name}?</span>
                                <div className="scheduler-inline-actions">
                                  <button className="button button-sm" type="button" onClick={confirmDelete}>
                                    Yes
                                  </button>
                                  <button className="button secondary button-sm" type="button" onClick={() => setDeleteConfirm(null)}>
                                    No
                                  </button>
                                </div>
                              </div>
                            ) : null}
                            {savedFlash?.type === 'faculty' && savedFlash.id === member.id ? (
                              <span className="badge success saved-flash">Saved ✓</span>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card form">
              <h3>Subject Management</h3>
              <div className="table-wrap">
                <table className="scheduler-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Code</th>
                      <th>Type</th>
                      <th>Hours / Week</th>
                      <th>Assigned Staff</th>
                      <th>Lab / Batch</th>
                      <th>Preferred Days</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.subjects.map((subject) => {
                      const editing = editingSubjectId === subject.id;
                      return (
                        <tr
                          key={subject.id}
                          className={`${
                            editing ? 'editing-row' : ''
                          } ${savedFlash?.type === 'subject' && savedFlash.id === subject.id ? 'saved-row' : ''}`}
                        >
                          <td>
                            {editing ? (
                              <input
                                value={subjectDraft.name}
                                onChange={(event) => setSubjectDraft((current) => ({ ...current, name: event.target.value }))}
                              />
                            ) : (
                              subject.name
                            )}
                          </td>
                          <td>
                            {editing ? (
                              <input
                                value={subjectDraft.code}
                                onChange={(event) => setSubjectDraft((current) => ({ ...current, code: event.target.value }))}
                              />
                            ) : (
                              subject.code
                            )}
                          </td>
                          <td>
                            {editing ? (
                              <select
                                value={subjectDraft.type}
                                onChange={(event) =>
                                  setSubjectDraft((current) => ({
                                    ...current,
                                    type: event.target.value as SubjectType,
                                    durationSlots: event.target.value === 'Practical' ? Math.max(2, current.durationSlots) : 1
                                  }))
                                }
                              >
                                {subjectTypeOptions.map((type) => (
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className={`badge ${subject.type === 'Practical' ? 'warning' : 'primary'}`}>{subject.type}</span>
                            )}
                          </td>
                          <td>
                            {editing ? (
                              <input
                                type="number"
                                min={1}
                                value={subjectDraft.hoursPerWeek}
                                onChange={(event) =>
                                  setSubjectDraft((current) => ({ ...current, hoursPerWeek: Number(event.target.value) }))
                                }
                              />
                            ) : (
                              subject.hoursPerWeek
                            )}
                          </td>
                          <td>
                            {editing ? (
                              <select
                                value={subjectDraft.assignedFacultyId ?? ''}
                                onChange={(event) =>
                                  setSubjectDraft((current) => ({
                                    ...current,
                                    assignedFacultyId: event.target.value || null
                                  }))
                                }
                              >
                                <option value="">Select staff</option>
                                {state.faculty.map((member) => (
                                  <option key={member.id} value={member.id}>
                                    {member.name || 'Unnamed staff'}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="muted">
                                {state.faculty.find((member) => member.id === subject.assignedFacultyId)?.name || 'Unassigned'}
                              </span>
                            )}
                          </td>
                          <td>
                            {editing ? (
                              subjectDraft.type === 'Practical' ? (
                                <div className="stacked-fields">
                                  <input
                                    value={subjectDraft.labName}
                                    onChange={(event) => setSubjectDraft((current) => ({ ...current, labName: event.target.value }))}
                                    placeholder="Lab name"
                                  />
                                  <input
                                    value={subjectDraft.batch}
                                    onChange={(event) => setSubjectDraft((current) => ({ ...current, batch: event.target.value }))}
                                    placeholder="Batch"
                                  />
                                  <input
                                    type="number"
                                    min={2}
                                    value={subjectDraft.durationSlots}
                                    onChange={(event) =>
                                      setSubjectDraft((current) => ({ ...current, durationSlots: Number(event.target.value) }))
                                    }
                                  />
                                </div>
                              ) : (
                                <span className="muted">Theory subject</span>
                              )
                            ) : (
                              <span className="muted">
                                {subject.type === 'Practical'
                                  ? `${subject.labName || 'Lab'} ${subject.batch ? `· ${subject.batch}` : ''}`
                                  : 'Theory'}
                              </span>
                            )}
                          </td>
                          <td>
                            {editing ? (
                              <div className="chip-row">
                                {dayOptions.map((day) => (
                                  <button
                                    key={day}
                                    type="button"
                                    className={`chip ${subjectDraft.preferredDays.includes(day) ? 'active' : ''}`}
                                    onClick={() =>
                                      setSubjectDraft((current) => ({
                                        ...current,
                                        preferredDays: current.preferredDays.includes(day)
                                          ? current.preferredDays.filter((item) => item !== day)
                                          : [...current.preferredDays, day]
                                      }))
                                    }
                                  >
                                    {day.slice(0, 3)}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <span className="muted">{subject.preferredDays.join(', ') || 'Any day'}</span>
                            )}
                          </td>
                          <td>
                            <div className="scheduler-inline-actions">
                              {editing ? (
                                <>
                                  <button className="button button-sm" type="button" onClick={() => void saveSubjectDraft()}>
                                    Save
                                  </button>
                                  <button className="button secondary button-sm" type="button" onClick={cancelEditSubject}>
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button className="button secondary button-sm" type="button" onClick={() => beginEditSubject(subject)}>
                                    Edit
                                  </button>
                                  <button className="button secondary button-sm" type="button" onClick={() => void deleteSubject(subject.id)}>
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                            {deleteConfirm?.type === 'subject' && deleteConfirm.id === subject.id ? (
                              <div className="inline-confirm">
                                <span>Delete {subject.name}?</span>
                                <div className="scheduler-inline-actions">
                                  <button className="button button-sm" type="button" onClick={confirmDelete}>
                                    Yes
                                  </button>
                                  <button className="button secondary button-sm" type="button" onClick={() => setDeleteConfirm(null)}>
                                    No
                                  </button>
                                </div>
                              </div>
                            ) : null}
                            {savedFlash?.type === 'subject' && savedFlash.id === subject.id ? (
                              <span className="badge success saved-flash">Saved ✓</span>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {currentStep === 2 ? (
        <section className="scheduler-section">
          <div className="grid cards two-up">
            <div className="card form">
              <h3>Faculty Attendance</h3>
              <div className="field">
                <label>Select date</label>
                <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
              </div>
              <p className="muted">
                Applying absences to <strong>{selectedWeekday}</strong>. The selected date is stored in{' '}
                <code>substitutions_{selectedDate}</code>.
              </p>
              <div className="list">
                {state.faculty.map((member) => {
                  const isAbsent = absenceFacultyId === member.id;
                  return (
                    <div key={member.id} className="list-item">
                      <div>
                        <strong>{member.name}</strong>
                        <div className="muted">{member.canHandlePractical ? 'Practical-capable' : 'Theory only'}</div>
                      </div>
                      <div className="scheduler-inline-actions">
                        <button
                          className={`button secondary button-sm ${isAbsent ? 'active-chip' : ''}`}
                          type="button"
                          onClick={() => setAbsenceFacultyId(member.id)}
                        >
                          Mark Absent
                        </button>
                        <button
                          className="button button-sm"
                          type="button"
                          onClick={() => void onMarkAbsent(selectedWeekday, member.id)}
                          disabled={isApplyingAbsence}
                        >
                          {isApplyingAbsence && absenceFacultyId === member.id ? 'Applying...' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="scheduler-inline-actions">
                <button className="button secondary button-sm" type="button" onClick={resetDay}>
                  Reset Day
                </button>
              </div>
              {inlineErrors.absence ? <p className="badge danger">{inlineErrors.absence}</p> : null}
            </div>

            <div className="card form">
              <h3>Substitution Summary</h3>
              <p className="muted">
                {selectedDate} session summary for <strong>{selectedWeekday}</strong>
              </p>
              {summaryOpen ? (
                <div className="list">
                  {substitutions.length ? (
                    substitutions.map((substitution) => (
                      <div key={substitution.id} className="list-item">
                        <div>
                          <strong>
                            {substitution.day} - {substitution.subjectName}
                          </strong>
                          <div className="muted">
                            Absent: {substitution.originalFacultyName}
                            {substitution.substituteFacultyName ? ` · Sub: ${substitution.substituteFacultyName}` : ' · Self Study'}
                          </div>
                        </div>
                        <span className={`badge ${substitution.status === 'substituted' ? 'success' : 'warning'}`}>
                          {substitution.status === 'substituted' ? 'Substituted' : 'Free / Self Study'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="muted">No substitutions yet for this day.</p>
                  )}
                </div>
              ) : null}
              <div className="scheduler-inline-actions">
                <button className="button secondary button-sm" type="button" onClick={() => setSummaryOpen((current) => !current)}>
                  {summaryOpen ? 'Hide Summary' : 'Show Summary'}
                </button>
                <button className="button secondary button-sm" type="button" onClick={() => window.print()}>
                  Print Summary
                </button>
                <button className="button secondary button-sm" type="button" onClick={resetDay}>
                  Reset Substitutions
                </button>
              </div>
            </div>
          </div>

          <div className="card form scheduler-generate-card">
            <div>
              <h3>Generate Timetable</h3>
              <p className="muted">
                The generator assigns subjects across all selected working days, respects faculty load limits, inserts specials, and
                re-runs with a new shuffle on demand.
              </p>
            </div>
            <div className="scheduler-inline-actions">
              <button className="button" type="button" onClick={() => void onGenerate(false)} disabled={!canGenerate || isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate Timetable'}
              </button>
              <button className="button secondary" type="button" onClick={() => onRegenerate()} disabled={!state.timetable || isGenerating}>
                Regenerate
              </button>
            </div>
          </div>

          {message ? <p className="badge primary scheduler-message">{message}</p> : null}
          {inlineErrors.generate ? <p className="badge danger scheduler-message">{inlineErrors.generate}</p> : null}
          {inlineErrors.faculty ? <p className="badge danger scheduler-message">{inlineErrors.faculty}</p> : null}
          {inlineErrors.subject ? <p className="badge danger scheduler-message">{inlineErrors.subject}</p> : null}

          {warnings.length ? (
            <div className="card form">
              <h3>Conflict Warnings</h3>
              <div className="list">
                {warnings.map((warning, index) => (
                  <div key={`${warning}-${index}`} className="list-item">
                    <span>{warning}</span>
                    <span className="badge warning">Warning</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {state.timetable ? (
            <>
              <div className="card form timetable-output">
                <div className="topbar" style={{ marginBottom: 0 }}>
                  <div>
                    <h3>Weekly Timetable</h3>
                    <p className="muted">
                      {state.timetable.collegeName} · {state.timetable.division} · Generated{' '}
                      {new Date(state.timetable.generatedAt).toLocaleString()} with seed #{state.timetable.generationSeed}
                    </p>
                  </div>
                  <span className="badge success">Ready to print</span>
                </div>
                <div className="timetable-header-grid">
                  <div className="timetable-header-block">
                    <h4>College & Division</h4>
                    <p>
                      <strong>{state.timetable.collegeName}</strong>
                    </p>
                    <p className="muted">Division: {state.timetable.division}</p>
                  </div>
                  <div className="timetable-header-block">
                    <h4>Staff Assignments</h4>
                    <div className="list compact-list">
                      {state.faculty.map((member) => {
                        const assignedSubjects = state.subjects.filter((subject) => subject.assignedFacultyId === member.id);
                        return (
                          <div key={member.id} className="list-item compact-item">
                            <strong>{member.name || 'Unnamed staff'}</strong>
                            <span className="muted">
                              {assignedSubjects.length
                                ? assignedSubjects.map((subject) => subject.name).join(', ')
                                : 'No assigned subjects'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="timetable-header-block">
                    <h4>Breaks & Special Periods</h4>
                    <div className="list compact-list">
                      {state.config.breaks.map((breakItem) => (
                        <div key={breakItem.id} className="list-item compact-item">
                          <strong>{breakItem.label}</strong>
                          <span className="muted">After lecture {breakItem.afterLecture} · {breakItem.durationMinutes} min</span>
                        </div>
                      ))}
                      {state.config.specialPeriods.map((period) => (
                        <div key={period.id} className="list-item compact-item">
                          <strong>{period.name}</strong>
                          <span className="muted">
                            {period.placement}
                            {period.placement === 'between' ? ` after lecture ${period.afterLecture}` : ''} · {period.startTime} ·{' '}
                            {period.durationMinutes} min · {specialDisplayModeLabel[period.displayMode ?? 'per-day']}
                          </span>
                        </div>
                      ))}
                      {!state.config.breaks.length && !state.config.specialPeriods.length ? (
                        <p className="muted">No breaks or special periods configured.</p>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="table-wrap timetable-scroll">
                  <table className="timetable-grid">
                    <thead>
                      <tr>
                        <th className="row-label">Period</th>
                        {state.config.workingDays.map((day) => (
                          <th key={day}>{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {periodRows.map((row, rowIndex) => {
                        if (row.kind !== 'LECTURE' && row.displayMode === 'full-width') {
                          const isAnthem = row.label.trim().toLowerCase() === 'national anthem';
                          return (
                            <tr key={row.id} className={`special-row full-width-row ${isAnthem ? 'anthem-row' : ''}`}>
                              <th className="row-label anthem-row-label" aria-hidden="true">
                                <span>&nbsp;</span>
                              </th>
                              <td
                                className={`special-cell ${row.kind === 'BREAK' ? 'warning' : 'success'} full-width-cell ${
                                  isAnthem ? 'anthem-cell' : ''
                                }`}
                                colSpan={state.config.workingDays.length}
                              >
                                <strong>{row.label}</strong>
                                {!isAnthem ? <span>{row.timeLabel}</span> : null}
                              </td>
                            </tr>
                          );
                        }

                        return (
                          <tr key={row.id} className={row.kind !== 'LECTURE' ? 'special-row' : ''}>
                            <th className="row-label">
                              <span>{row.label}</span>
                              <small>{row.timeLabel}</small>
                            </th>
                            {state.config.workingDays.map((day) => {
                              const dayData = state.timetable?.days.find((item) => item.day === day);
                              const cell = dayData?.cells[rowIndex];
                              if (!cell) {
                                return <td key={`${day}-${row.id}`} />;
                              }
                              if (cell.kind === 'LECTURE' && cell.hidden) {
                                return null;
                              }
                              if (cell.kind === 'SPECIAL') {
                                return (
                                  <td key={`${day}-${row.id}`} className={`special-cell ${cell.status}`}>
                                    <strong>{cell.label}</strong>
                                    <span>{cell.timeLabel}</span>
                                  </td>
                                );
                              }
                              if (cell.kind !== 'LECTURE') {
                                return <td key={`${day}-${row.id}`} />;
                              }
                              return (
                                <td
                                  key={`${day}-${row.id}`}
                                  rowSpan={cell.rowSpan > 1 ? cell.rowSpan : undefined}
                                  className={`lecture-cell ${cell.status} ${cell.isPractical ? 'practical' : 'theory'}`}
                                >
                                  <div className="cell-body">
                                    <strong>{cell.subjectName}</strong>
                                    <span>{cell.subjectCode}</span>
                                    <span>{cell.facultyName}</span>
                                    <span>{cell.roomName}</span>
                                    {cell.batch ? <span>{cell.batch}</span> : null}
                                  </div>
                                  <div className="scheduler-inline-actions">
                                    <button
                                      className="button secondary"
                                      type="button"
                                      onClick={() => void onMarkAbsent(day, cell.facultyId ?? '')}
                                      disabled={!cell.facultyId || isApplyingAbsence}
                                    >
                                      {isApplyingAbsence ? 'Updating...' : 'Mark Absent'}
                                    </button>
                                    {cell.substitutionLabel ? <span className="badge warning">{cell.substitutionLabel}</span> : null}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid cards two-up">
                <div className="card form">
                  <h3>Substitution Summary</h3>
                  {substitutions.length ? (
                    <div className="list">
                      {substitutions.map((substitution) => (
                        <div key={substitution.id} className="list-item">
                          <div>
                            <strong>
                              {substitution.day} - {substitution.subjectName}
                            </strong>
                            <div className="muted">
                              {substitution.originalFacultyName}
                              {substitution.substituteFacultyName ? ` → ${substitution.substituteFacultyName}` : ' → Self Study'}
                            </div>
                          </div>
                          <span className={`badge ${substitution.status === 'substituted' ? 'success' : 'warning'}`}>
                            {substitution.status === 'substituted' ? 'Substituted' : 'Self Study'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="muted">No substitutions have been processed yet.</p>
                  )}
                </div>

                <div className="card form">
                  <h3>Workload Overview</h3>
                  <div className="list">
                    {workload.map((item) => {
                      const pct = item.max > 0 ? Math.min(100, Math.round((item.sessions / item.max) * 100)) : 0;
                      return (
                        <div key={item.id} className="list-item">
                          <div className="workload-stack">
                            <strong>{item.name}</strong>
                            <div className="workload-track">
                              <div className="workload-fill" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                          <span className={`badge ${pct > 80 ? 'warning' : 'success'}`}>{item.sessions}/{item.max}</span>
                        </div>
                      );
                    })}
                  </div>
                  {selectedFacultyForAbsent ? (
                    <p className="muted">
                      Last absent faculty: <strong>{selectedFacultyForAbsent.name}</strong>
                    </p>
                  ) : null}
                </div>
              </div>
            </>
          ) : (
            <div className="card">
              <p className="muted">No timetable has been generated yet. Click Generate Timetable to build one.</p>
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
