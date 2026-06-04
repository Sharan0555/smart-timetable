// ===== SMART TIMETABLE MANAGEMENT SYSTEM - DATA STORE =====

const AppData = {
  // College Timing Config
  config: {
    collegeName: "NEP 2020 Smart Institution",
    timings: {
      start: "09:30",
      end: "17:00"
    },
    sessions: [
      { id: 0, label: "National Anthem", time: "09:05 AM - 10:00 AM", type: "anthem" },
      { id: 1, label: "Session 1", time: "09:30 - 10:20", type: "teaching" },
      { id: 2, label: "Session 2", time: "10:20 - 11:10", type: "teaching" },
      { id: 3, label: "Meditation", time: "11:10 - 11:20", type: "break" },
      { id: 4, label: "Session 3", time: "11:20 - 12:10", type: "teaching" },
      { id: 5, label: "Session 4", time: "12:10 - 13:00", type: "teaching" },
      { id: 6, label: "Lunch Break", time: "13:00 - 13:45", type: "break" },
      { id: 7, label: "Session 5", time: "13:45 - 14:35", type: "teaching" },
      { id: 8, label: "Session 6", time: "14:35 - 15:25", type: "teaching" },
      { id: 9, label: "Short Break", time: "15:25 - 15:30", type: "break" },
      { id: 10, label: "Session 7", time: "15:30 - 16:20", type: "teaching" },
      { id: 11, label: "AAO/Mentor", time: "16:20 - 17:00", type: "special" }
    ],
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },

  branches: ["CSE-A", "CSE-B", "AI-A", "AI-B", "ECE-A", "ECE-B", "ENTC-A", "ENTC-B"],
  semesters: ["Semester 1", "Semester 3", "Semester 5", "Semester 7"],
  activeBranch: "CSE-A",
  activeSemester: "Semester 1",

  // Faculty Data
  faculty: [
    { id: "F001", name: "Dr. Priya Sharma", subjects: ["S001", "S005"], maxSessions: 18, available: true, onLeave: false, dept: "CS", email: "priya@institution.edu", canTakeLab: true },
    { id: "F002", name: "Prof. Rajan Kumar", subjects: ["S002", "S006"], maxSessions: 16, available: true, onLeave: false, dept: "CS", email: "rajan@institution.edu", canTakeLab: true },
    { id: "F003", name: "Dr. Anitha Reddy", subjects: ["S003"], maxSessions: 20, available: false, onLeave: true, dept: "Math", email: "anitha@institution.edu", canTakeLab: false },
    { id: "F004", name: "Prof. Suresh Patil", subjects: ["S004", "S007"], maxSessions: 18, available: true, onLeave: false, dept: "CS", email: "suresh@institution.edu", canTakeLab: true },
    { id: "F005", name: "Dr. Kavitha Nair", subjects: ["S008", "S009"], maxSessions: 16, available: true, onLeave: false, dept: "AI", email: "kavitha@institution.edu", canTakeLab: true },
    { id: "F006", name: "Prof. Vijay Mehta", subjects: ["S010"], maxSessions: 14, available: true, onLeave: false, dept: "Elective", email: "vijay@institution.edu", canTakeLab: false }
  ],

  // Subject Data (NEP 2020 structure)
  subjects: [
    { id: "S001", code: "21CS301", name: "Full Stack Development", type: "Major", sessions: 4, faculty: "F001", hasPractical: true, lab: "L002", credits: 4 },
    { id: "S002", code: "21CS302", name: "Data Analytics", type: "Major", sessions: 3, faculty: "F002", hasPractical: true, lab: "L001", credits: 4 },
    { id: "S003", code: "21MA301", name: "Engineering Mathematics", type: "Major", sessions: 4, faculty: "F003", hasPractical: false, lab: null, credits: 3 },
    { id: "S004", code: "21CS303", name: "Operating Systems", type: "Major", sessions: 3, faculty: "F004", hasPractical: true, lab: "L003", credits: 4 },
    { id: "S005", code: "21CS304", name: "Machine Learning", type: "Minor", sessions: 3, faculty: "F001", hasPractical: true, lab: "L001", credits: 3 },
    { id: "S006", code: "21CS305", name: "Web Technologies", type: "Minor", sessions: 2, faculty: "F002", hasPractical: false, lab: null, credits: 2 },
    { id: "S007", code: "21CS306", name: "Network Security", type: "Skill", sessions: 2, faculty: "F004", hasPractical: true, lab: "L003", credits: 2 },
    { id: "S008", code: "21AI301", name: "Deep Learning", type: "Elective", sessions: 3, faculty: "F005", hasPractical: true, lab: "L001", credits: 3 },
    { id: "S009", code: "21AI302", name: "NLP Fundamentals", type: "Value", sessions: 2, faculty: "F005", hasPractical: false, lab: null, credits: 2 },
    { id: "S010", code: "21HU301", name: "Professional Ethics", type: "Ability", sessions: 1, faculty: "F006", hasPractical: false, lab: null, credits: 1 }
  ],

  // Lab Data
  labs: [
    { id: "L001", name: "AI Lab", capacity: 30, subjects: ["S002", "S005", "S008"], available: true },
    { id: "L002", name: "Data Mining Lab", capacity: 30, subjects: ["S001"], available: true },
    { id: "L003", name: "Network Security Lab", capacity: 25, subjects: ["S004", "S007"], available: false }
  ],

  // Users
  users: [
    { id: "U001", name: "Admin User", email: "admin@institution.edu", password: "admin123", role: "admin" },
    { id: "U002", name: "Dr. Priya Sharma", email: "priya@institution.edu", password: "faculty123", role: "faculty", facultyId: "F001" },
    { id: "U003", name: "Student User", email: "student@institution.edu", password: "student123", role: "student" }
  ],

  // Generated Timetable (stored as slots)
  timetable: {},
  timetables: {},

  // Notifications
  notifications: [
    { id: "N001", message: "Dr. Anitha Reddy is on leave today. Session 3 & 4 rescheduled.", type: "warning", time: "08:45 AM" },
    { id: "N002", message: "Network Security Lab closed for maintenance.", type: "info", time: "09:00 AM" },
    { id: "N003", message: "New elective 'Cloud Computing' added for next semester.", type: "success", time: "Yesterday" }
  ]
};

// Save/Load from localStorage
function saveData() {
  if (!AppData.timetables) AppData.timetables = {};
  if (!AppData.activeBranch) AppData.activeBranch = AppData.branches?.[0] || "CSE-A";
  if (!AppData.activeSemester) AppData.activeSemester = AppData.semesters?.[0] || "Semester 1";
  AppData.config.sessions = ensureNationalAnthemSession(AppData.config.sessions);
  const scheduleKey = `${AppData.activeBranch}::${AppData.activeSemester}`;
  AppData.timetables[scheduleKey] = AppData.timetable || {};
  localStorage.setItem('timetable_app_data', JSON.stringify(AppData));
  syncUsersToLocalStorage();
}

// ===== USER REGISTRY (email/password + Google) =====

const DEMO_USERS_SEED = [
  { id: "U001", name: "Admin User", email: "admin@institution.edu", password: "admin123", role: "admin" },
  { id: "U002", name: "Dr. Priya Sharma", email: "priya@institution.edu", password: "faculty123", role: "faculty", facultyId: "F001" },
  { id: "U003", name: "Student User", email: "student@institution.edu", password: "student123", role: "student" }
];

function syncUsersToLocalStorage() {
  if (!Array.isArray(AppData.users)) AppData.users = [];
  localStorage.setItem("users", JSON.stringify(AppData.users));
}

function mergeDemoUsers(users) {
  const list = Array.isArray(users) ? [...users] : [];
  const emails = new Set(list.map((u) => (u.email || "").toLowerCase()));
  DEMO_USERS_SEED.forEach((demo) => {
    if (!emails.has(demo.email.toLowerCase())) {
      list.push({ ...demo });
    }
  });
  return list;
}

function loadUsersRegistry() {
  let users = null;
  try {
    const stored = localStorage.getItem("users");
    if (stored) users = JSON.parse(stored);
  } catch {
    users = null;
  }

  if (Array.isArray(users) && users.length) {
    AppData.users = mergeDemoUsers(users);
  } else if (!Array.isArray(AppData.users) || !AppData.users.length) {
    AppData.users = mergeDemoUsers(DEMO_USERS_SEED);
  } else {
    AppData.users = mergeDemoUsers(AppData.users);
  }

  syncUsersToLocalStorage();
}

function findUserByEmail(email) {
  if (!email) return null;
  const normalized = String(email).trim().toLowerCase();
  return (
    AppData.users.find((u) => u.email && u.email.toLowerCase() === normalized) || null
  );
}

function findPasswordUser(email, password, role) {
  const normalized = String(email).trim().toLowerCase();
  return (
    AppData.users.find(
      (u) =>
        u.email &&
        u.email.toLowerCase() === normalized &&
        u.password === password &&
        u.role === role
    ) || null
  );
}

function saveUserToRegistry(user) {
  if (!user || !user.email) return user;
  const normalized = user.email.toLowerCase();
  const index = AppData.users.findIndex((u) => u.email && u.email.toLowerCase() === normalized);
  if (index >= 0) {
    AppData.users[index] = { ...AppData.users[index], ...user };
  } else {
    AppData.users.push(user);
  }
  syncUsersToLocalStorage();
  saveData();
  return AppData.users.find((u) => u.email.toLowerCase() === normalized);
}

function createGoogleUser(profile, role) {
  const user = {
    id: "google_" + profile.sub,
    name: profile.name || profile.email,
    email: profile.email,
    picture: profile.picture || "",
    role,
    loginMethod: "google",
    onLeave: false
  };
  if (role === "faculty") {
    user.department = "";
    user.dept = "";
    user.subjects = [];
    user.onLeave = false;
  }
  return user;
}

function getDefaultBranches() {
  return ["CSE-A", "CSE-B", "AI-A", "AI-B", "ECE-A", "ECE-B", "ENTC-A", "ENTC-B"];
}

function getDefaultSemesters() {
  return ["Semester 1", "Semester 3", "Semester 5", "Semester 7"];
}

function normalizeBranchName(branch) {
  if (!branch) return '';
  const next = String(branch).trim().toUpperCase();
  if (next === 'CSE' || next === 'CSE-A') return 'CSE-A';
  if (next === 'AI' || next === 'AI-A') return 'AI-A';
  if (next === 'ECE' || next === 'ECE-A') return 'ECE-A';
  if (next === 'ENTC' || next === 'ENTC-A') return 'ENTC-A';
  if (['CSE-B', 'AI-B', 'ECE-B', 'ENTC-B'].includes(next)) return next;
  return next;
}

function normalizeSemesterName(semester) {
  if (!semester) return '';
  const next = String(semester).trim().toUpperCase();
  if (next === '1' || next === 'SEM 1' || next === 'SEMESTER 1') return 'Semester 1';
  if (next === '3' || next === 'SEM 3' || next === 'SEMESTER 3') return 'Semester 3';
  if (next === '5' || next === 'SEM 5' || next === 'SEMESTER 5') return 'Semester 5';
  if (next === '7' || next === 'SEM 7' || next === 'SEMESTER 7') return 'Semester 7';
  return semester.startsWith('Semester') ? semester : `Semester ${semester}`;
}

function getScheduleKey(branch, semester) {
  return `${normalizeBranchName(branch)}::${normalizeSemesterName(semester)}`;
}

function migrateOldBranchTables(timetables) {
  const migrated = { ...(timetables || {}) };
  const legacyMap = {
    CSE: 'CSE-A',
    AI: 'AI-A',
    ECE: 'ECE-A',
    ENTC: 'ENTC-A'
  };

  Object.entries(legacyMap).forEach(([legacyKey, newKey]) => {
    if (migrated[legacyKey] && !migrated[newKey]) {
      migrated[newKey] = migrated[legacyKey];
    }
    delete migrated[legacyKey];
  });

  return migrated;
}

function migrateBranchSemesterTables(timetables) {
  const migrated = {};
  Object.entries(timetables || {}).forEach(([key, value]) => {
    if (key.includes('::')) {
      migrated[key] = value;
      return;
    }
    migrated[`${normalizeBranchName(key)}::Semester 1`] = value;
  });
  return migrated;
}

function ensureNationalAnthemSession(sessions) {
  const list = Array.isArray(sessions) ? [...sessions] : [];
  const anthemSession = { id: 0, label: "National Anthem", time: "09:05 AM - 10:00 AM", type: "anthem" };
  const anthemIndex = list.findIndex((session) => String(session?.type || '').toLowerCase() === 'anthem');

  if (anthemIndex >= 0) {
    list[anthemIndex] = { ...anthemSession, ...list[anthemIndex] };
    return list;
  }

  return [anthemSession, ...list];
}

function loadData() {
  const saved = localStorage.getItem('timetable_app_data');
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.assign(AppData, parsed);
  }

  AppData.branches = getDefaultBranches();
  AppData.semesters = getDefaultSemesters();
  AppData.timetables = migrateBranchSemesterTables(migrateOldBranchTables(AppData.timetables));
  AppData.config = AppData.config || {};
  AppData.config.sessions = ensureNationalAnthemSession(AppData.config.sessions);
  AppData.activeBranch = normalizeBranchName(AppData.activeBranch) || AppData.branches[0];
  AppData.activeSemester = normalizeSemesterName(AppData.activeSemester) || AppData.semesters[0];

  if (!AppData.branches.includes(AppData.activeBranch)) {
    AppData.activeBranch = AppData.branches[0];
  }
  if (!AppData.semesters.includes(AppData.activeSemester)) {
    AppData.activeSemester = AppData.semesters[0];
  }
  if (!AppData.timetables || typeof AppData.timetables !== 'object') {
    AppData.timetables = {};
  }
  const activeKey = getScheduleKey(AppData.activeBranch, AppData.activeSemester);
  if (AppData.timetable && Object.keys(AppData.timetable).length > 0 && !AppData.timetables[activeKey]) {
    AppData.timetables[activeKey] = AppData.timetable;
  }
  AppData.timetable = AppData.timetables[activeKey] || AppData.timetable || {};

  // Keep the break labels aligned with the latest timetable layout.
  if (AppData.config?.sessions?.length >= 9) {
    const session3 = AppData.config.sessions.find(s => s.id === 3);
    const session9 = AppData.config.sessions.find(s => s.id === 9);
    if (session3) session3.label = 'Meditation';
    if (session9) session9.label = 'Short Break';
  }

  normalizeFacultyRecords();
  loadUsersRegistry();
}

function createBranchRandom(seedText) {
  let seed = 0;
  for (let i = 0; i < seedText.length; i++) {
    seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0;
  }
  return () => {
    seed = (seed + 0x6D2B79F5) >>> 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate timetable using constraint satisfaction
function generateTimetable(branch = AppData.activeBranch || (AppData.branches?.[0] || "CSE-A"), semester = AppData.activeSemester || (AppData.semesters?.[0] || "Semester 1")) {
  const normalizedBranch = normalizeBranchName(branch) || (AppData.branches?.[0] || "CSE-A");
  const normalizedSemester = normalizeSemesterName(semester) || (AppData.semesters?.[0] || "Semester 1");
  const scheduleKey = getScheduleKey(normalizedBranch, normalizedSemester);
  const days = AppData.config.days;
  const sessions = AppData.config.sessions.filter(s => s.type === "teaching");
  const subjects = [...AppData.subjects];
  const timetable = {};
  const random = createBranchRandom(`${normalizedBranch}-${normalizedSemester}`);
  const shuffle = (items) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Init grid
  days.forEach(day => {
    timetable[day] = {};
    sessions.forEach(s => {
      timetable[day][s.id] = null;
    });
  });

  const facultySessionCount = {};
  const labSessionCount = {};

  shuffle(subjects).forEach(subj => {
    let placed = 0;
    const needed = subj.sessions;
    const shuffledDays = shuffle(days);
    const shuffledSessions = shuffle(sessions);

    for (const day of shuffledDays) {
      if (placed >= needed) break;
      for (const session of shuffledSessions) {
        if (placed >= needed) break;
        if (timetable[day][session.id]) continue;

        // Check faculty clash
        const facultyKey = `${day}-${session.id}-${subj.faculty}`;
        if (facultySessionCount[facultyKey]) continue;

        // Check lab clash if practical
        if (subj.hasPractical && subj.lab) {
          const labKey = `${day}-${session.id}-${subj.lab}`;
          if (labSessionCount[labKey]) continue;
        }

        // Place it
        timetable[day][session.id] = {
          subjectId: subj.id,
          subjectName: subj.name,
          subjectCode: subj.code,
          facultyId: subj.faculty,
          type: subj.type,
          isPractical: !!subj.hasPractical,
          labId: subj.lab || null,
          labName: subj.lab ? getLabName(subj.lab) : null
        };

        facultySessionCount[facultyKey] = true;
        if (subj.hasPractical && subj.lab) {
          labSessionCount[`${day}-${session.id}-${subj.lab}`] = true;
        }
        placed++;
      }
    }
  });

  AppData.activeBranch = normalizedBranch;
  AppData.activeSemester = normalizedSemester;
  AppData.timetables[scheduleKey] = timetable;
  AppData.timetable = timetable;
  saveData();
  return timetable;
}

// Detect conflicts
function detectConflicts() {
  const conflicts = [];
  const days = AppData.config.days;
  const sessions = AppData.config.sessions.filter(s => s.type === "teaching");
  const tt = AppData.timetable;

  if (!tt || Object.keys(tt).length === 0) return conflicts;

  days.forEach(day => {
    const facultyInSession = {};
    sessions.forEach(session => {
      const slot = tt[day] && tt[day][session.id];
      if (slot) {
        const key = `${slot.facultyId}-${session.id}`;
        if (facultyInSession[key]) {
          conflicts.push({
            type: "Faculty Clash",
            day,
            session: session.label,
            detail: `Faculty ${slot.facultyId} assigned to multiple subjects`
          });
        }
        facultyInSession[key] = true;
      }
    });
  });

  return conflicts;
}

// ===== FACULTY SUBSTITUTION SYSTEM =====

function normalizeFacultyRecords() {
  if (!Array.isArray(AppData.faculty)) {
    AppData.faculty = [];
    return;
  }
  AppData.faculty.forEach((f) => {
    if (f.onLeave === undefined) f.onLeave = f.available === false;
    if (f.available === undefined) f.available = !f.onLeave;
    if (f.onLeave) f.available = false;
    if (!f.email) f.email = '';
    if (f.canTakeLab === undefined) {
      const teachesPractical = (f.subjects || []).some((sid) => {
        const subj = AppData.subjects.find((s) => s.id === sid);
        return subj && subj.hasPractical;
      });
      f.canTakeLab = teachesPractical || ['CS', 'AI'].includes(f.dept || f.department);
    }
    if (f.department && !f.dept) f.dept = f.department;
    if (f.dept && !f.department) f.department = f.dept;
  });
}

function isFacultyOnLeave(faculty) {
  if (!faculty) return true;
  if (faculty.onLeave === true) return true;
  return faculty.available === false;
}

function getFacultyById(id) {
  return AppData.faculty.find((f) => f.id === id) || null;
}

function getFacultyDepartment(faculty) {
  return faculty?.dept || faculty?.department || '';
}

function getCurrentDay() {
  const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = dayMap[new Date().getDay()];
  if (AppData.config.days.includes(today)) return today;
  return AppData.config.days[0];
}

function getSessionByTimeSlot(timeSlot) {
  return AppData.config.sessions.find((s) => String(s.id) === String(timeSlot)) || null;
}

function getSlotType(slot) {
  if (!slot) return 'lecture';
  if (slot.type && String(slot.type).toLowerCase() === 'lab') return 'lab';
  if (slot.isPractical) return 'lab';
  return 'lecture';
}

function iterAllTimetableSlots(callback) {
  const branches = AppData.branches || getDefaultBranches();
  const semesters = AppData.semesters || getDefaultSemesters();
  if (!AppData.timetables) AppData.timetables = {};

  const visitedKeys = new Set();

  const walkTimetable = (tt, branch, semester, key) => {
    if (!tt || visitedKeys.has(key)) return;
    visitedKeys.add(key);
    const normBranch = normalizeBranchName(branch);
    const normSemester = normalizeSemesterName(semester);

    Object.entries(tt).forEach(([day, daySlots]) => {
      Object.entries(daySlots || {}).forEach(([timeSlot, slot]) => {
        if (!slot || !slot.subjectId) return;
        callback({
          branch: normBranch,
          semester: normSemester,
          scheduleKey: key,
          day,
          timeSlot,
          slot
        });
      });
    });
  };

  branches.forEach((branch) => {
    semesters.forEach((semester) => {
      const key = getScheduleKey(branch, semester);
      walkTimetable(AppData.timetables[key], branch, semester, key);
    });
  });

  // Include legacy/active timetable if it was stored only on AppData.timetable
  const activeKey = getScheduleKey(AppData.activeBranch, AppData.activeSemester);
  if (AppData.timetable && Object.keys(AppData.timetable).length > 0) {
    walkTimetable(AppData.timetable, AppData.activeBranch, AppData.activeSemester, activeKey);
  }
}

function getBusyFacultyIdsAtSlot(day, timeSlot, excludeRef) {
  const busy = new Set();
  iterAllTimetableSlots(({ branch, semester, day: slotDay, timeSlot: slotTime, slot }) => {
    if (slotDay !== day || String(slotTime) !== String(timeSlot)) return;
    if (
      excludeRef &&
      excludeRef.branch === branch &&
      excludeRef.semester === semester &&
      excludeRef.day === day &&
      String(excludeRef.timeSlot) === String(timeSlot)
    ) {
      return;
    }
    if (slot.facultyId) busy.add(slot.facultyId);
  });
  return busy;
}

function getFreeFacultyForSlot(day, timeSlot, options = {}) {
  const {
    absentFacultyId = null,
    slotType = 'lecture',
    excludeRef = null
  } = options;

  const busyIds = getBusyFacultyIdsAtSlot(day, timeSlot, excludeRef);
  if (absentFacultyId) busyIds.add(absentFacultyId);

  const absentFaculty = absentFacultyId ? getFacultyById(absentFacultyId) : null;
  const absentDept = absentFaculty ? getFacultyDepartment(absentFaculty) : '';

  const free = AppData.faculty.filter((f) => {
    if (busyIds.has(f.id)) return false;
    if (isFacultyOnLeave(f)) return false;
    if (slotType === 'lab' && !f.canTakeLab) return false;
    return true;
  });

  return free.sort((a, b) => {
    const aSame = getFacultyDepartment(a) === absentDept ? 0 : 1;
    const bSame = getFacultyDepartment(b) === absentDept ? 0 : 1;
    if (aSame !== bSame) return aSame - bSame;
    return a.name.localeCompare(b.name);
  });
}

function findSubstitute(absentFacultyId, day, timeSlot, slotType = 'lecture') {
  const free = getFreeFacultyForSlot(day, timeSlot, { absentFacultyId, slotType });
  return free.length ? free[0] : null;
}

function scanAffectedSlots(absentFacultyId, day) {
  const affected = [];

  iterAllTimetableSlots(({ branch, semester, day: slotDay, timeSlot, slot }) => {
    if (slotDay !== day) return;
    if (slot.facultyId !== absentFacultyId) return;

    const session = getSessionByTimeSlot(timeSlot);
    const slotType = getSlotType(slot);
    const division = `${branch}${semester !== 'Semester 1' ? ' · ' + semester : ''}`;

    affected.push({
      branch,
      semester,
      division,
      day,
      timeSlot,
      timeLabel: session ? `${session.label} (${session.time})` : String(timeSlot),
      subject: slot.subjectName || getSubject(slot.subjectId)?.name || 'Unknown',
      subjectId: slot.subjectId,
      facultyId: slot.facultyId,
      type: slotType,
      suggestedSubstitute: findSubstitute(absentFacultyId, day, timeSlot, slotType),
      freeFaculty: getFreeFacultyForSlot(day, timeSlot, {
        absentFacultyId,
        slotType,
        excludeRef: { branch, semester, day, timeSlot }
      })
    });
  });

  affected.sort((a, b) => {
    if (a.division !== b.division) return a.division.localeCompare(b.division);
    return String(a.timeSlot).localeCompare(String(b.timeSlot), undefined, { numeric: true });
  });

  return affected;
}

function loadSubstitutionHistory() {
  try {
    const raw = localStorage.getItem('substitutionHistory');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSubstitutionHistoryStack(stack) {
  localStorage.setItem('substitutionHistory', JSON.stringify(stack));
}

function pushSubstitutionHistory(entry) {
  const stack = loadSubstitutionHistory();
  stack.push(entry);
  saveSubstitutionHistoryStack(stack);
}

function getLastSubstitutionEntry() {
  const stack = loadSubstitutionHistory();
  return stack.length ? stack[stack.length - 1] : null;
}

function formatNotifTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function confirmSubstitutions(assignments, absentFacultyId) {
  if (!AppData.timetables) AppData.timetables = {};

  const absentFaculty = getFacultyById(absentFacultyId);
  const historyEntry = {
    id: 'SUB' + Date.now(),
    timestamp: new Date().toISOString(),
    absentFacultyId,
    absentFacultyName: absentFaculty ? absentFaculty.name : absentFacultyId,
    changes: []
  };

  const notifications = [];
  const batchGroupId = 'BATCH' + Date.now();

  assignments.forEach((assignment) => {
    const {
      branch,
      semester,
      day,
      timeSlot,
      substituteFacultyId,
      substituteFacultyName,
      manualFacultyName
    } = assignment;

    const key = getScheduleKey(branch, semester);
    if (!AppData.timetables[key]) AppData.timetables[key] = {};
    if (!AppData.timetables[key][day]) AppData.timetables[key][day] = {};

    const slot = AppData.timetables[key][day][timeSlot];
    if (!slot) return;

    const originalFacultyId = slot.facultyId;
    const session = getSessionByTimeSlot(timeSlot);
    const timeLabel = session ? session.time : String(timeSlot);

    const previousFacultyName = slot.facultyName || getFacultyName(originalFacultyId);
    let newFacultyName = substituteFacultyName;

    historyEntry.changes.push({
      branch,
      semester,
      day,
      timeSlot,
      originalFacultyId,
      originalFacultyName: previousFacultyName,
      division: `${branch}${semester !== 'Semester 1' ? ' · ' + semester : ''}`
    });

    if (substituteFacultyId) {
      const sub = getFacultyById(substituteFacultyId);
      newFacultyName = sub ? sub.name : newFacultyName || 'Substitute';
      slot.facultyId = substituteFacultyId;
      slot.facultyName = newFacultyName;
      slot.substitutedFrom = originalFacultyId;
      delete slot.substituteName;
    } else if (manualFacultyName) {
      newFacultyName = manualFacultyName.trim();
      slot.facultyName = newFacultyName;
      slot.substituteName = newFacultyName;
      slot.substitutedFrom = originalFacultyId;
    }

    const absentName = getFacultyName(absentFacultyId);
    const divisionLabel = `${branch}${semester !== 'Semester 1' ? ' · ' + semester : ''}`;
    notifications.push({
      id: 'N' + Date.now() + Math.random().toString(36).slice(2, 7),
      message: `${divisionLabel} | ${timeLabel}: ${absentName} → ${newFacultyName} for ${slot.subjectName || 'class'} on ${assignment.dateLabel || day}`,
      type: 'warning',
      time: formatNotifTime()
    });

    if (substituteFacultyId) {
      appendSubstitutionHistorySlotEntry({
        id: 'HIST' + Date.now() + Math.random().toString(36).slice(2, 6),
        batchGroupId,
        slotId: buildSlotId(branch, semester, day, timeSlot),
        timestamp: new Date().toISOString(),
        dateIso: assignment.dateIso || new Date().toISOString().split('T')[0],
        dateLabel: assignment.dateLabel || day,
        day,
        branch,
        semester,
        division: divisionLabel,
        timeSlot,
        timeLabel,
        subject: slot.subjectName || 'Class',
        subjectId: slot.subjectId,
        originalFacultyId,
        originalFacultyName: previousFacultyName,
        substituteFacultyId,
        substituteFacultyName: newFacultyName
      });
    }
  });

  if (absentFaculty) {
    absentFaculty.available = false;
    absentFaculty.onLeave = true;
  }

  if (historyEntry.changes.length) {
    historyEntry.recordType = 'batch';
    historyEntry.status = 'Active';
    historyEntry.dateIso = assignments[0]?.dateIso;
    historyEntry.dateLabel = assignments[0]?.dateLabel;
    pushSubstitutionHistory(historyEntry);
  }

  const activeKey = getScheduleKey(AppData.activeBranch, AppData.activeSemester);
  if (AppData.timetables[activeKey]) {
    AppData.timetable = AppData.timetables[activeKey];
  }

  if (!AppData.notifications) AppData.notifications = [];
  notifications.forEach((n) => AppData.notifications.unshift(n));

  saveData();
  return { success: true, notifications, historyEntry };
}

function undoLastSubstitution() {
  const stack = loadSubstitutionHistory();
  if (!stack.length) return { success: false, message: 'No substitution to undo.' };

  const lastSlot = [...stack].reverse().find((e) => e.recordType === 'slot' && e.status === 'Active');
  if (lastSlot && lastSlot.batchGroupId) {
    const group = stack.filter((e) => e.batchGroupId === lastSlot.batchGroupId && e.recordType === 'slot' && e.status === 'Active');
    let undone = 0;
    group.forEach((item) => {
      const res = undoSubstitution(item.id);
      if (res.success) undone++;
    });
    if (undone) {
      return { success: true, message: `Restored ${undone} slot(s) from the last substitution batch.` };
    }
  }

  const entry = stack.pop();
  if (!entry || !entry.changes) {
    saveSubstitutionHistoryStack(stack);
    return { success: false, message: 'No substitution batch to undo.' };
  }
  saveSubstitutionHistoryStack(stack);

  entry.changes.forEach((change) => {
    const key = getScheduleKey(change.branch, change.semester);
    const slot = AppData.timetables?.[key]?.[change.day]?.[change.timeSlot];
    if (!slot) return;

    slot.facultyId = change.originalFacultyId;
    slot.facultyName = change.originalFacultyName;
    delete slot.substitutedFrom;
    delete slot.substituteName;
  });

  const absentFaculty = getFacultyById(entry.absentFacultyId);
  if (absentFaculty) {
    absentFaculty.available = true;
    absentFaculty.onLeave = false;
  }

  const activeKey = getScheduleKey(AppData.activeBranch, AppData.activeSemester);
  if (AppData.timetables[activeKey]) {
    AppData.timetable = AppData.timetables[activeKey];
  }

  saveData();
  return {
    success: true,
    message: `Restored ${entry.changes.length} slot(s) for ${entry.absentFacultyName || entry.absentFacultyId}.`
  };
}

function hasUndoableSubstitution() {
  return loadSubstitutionHistory().length > 0;
}

// --- Leave & Substitution section API (aliases + per-slot history) ---

const MORNING_SESSION_IDS = new Set([1, 2, 4, 5]);
const AFTERNOON_SESSION_IDS = new Set([7, 8, 10]);

function buildSlotId(branch, semester, day, timeSlot) {
  return `${getScheduleKey(branch, semester)}::${day}::${timeSlot}`;
}

function parseSlotId(slotId) {
  const parts = String(slotId).split('::');
  if (parts.length < 4) return null;
  const timeSlot = parts.pop();
  const day = parts.pop();
  const semester = parts.pop();
  const branch = parts.join('::');
  return { branch, semester, day, timeSlot, scheduleKey: `${branch}::${semester}` };
}

function resolveLeaveScheduleDay(dateChoice, customDateValue) {
  const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const validDays = AppData.config.days || [];
  let target = new Date();

  if (dateChoice === 'tomorrow') {
    target.setDate(target.getDate() + 1);
  } else if (dateChoice === 'pick' && customDateValue) {
    target = new Date(`${customDateValue}T12:00:00`);
    if (Number.isNaN(target.getTime())) target = new Date();
  }

  let dayName = dayMap[target.getDay()];
  if (!validDays.includes(dayName)) {
    const idx = validDays.indexOf(getCurrentDay());
    dayName = validDays[idx >= 0 ? idx : 0];
  }

  return {
    day: dayName,
    dateIso: target.toISOString().split('T')[0],
    dateLabel: target.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  };
}

function slotMatchesLeavePeriods(timeSlot, periods) {
  const selected = Array.isArray(periods) && periods.length ? periods : ['full'];
  if (selected.includes('full')) return true;
  const sessionId = Number(timeSlot);
  if (selected.includes('morning') && MORNING_SESSION_IDS.has(sessionId)) return true;
  if (selected.includes('afternoon') && AFTERNOON_SESSION_IDS.has(sessionId)) return true;
  return false;
}

function getFacultyBusyAtSlot(day, timeSlot) {
  return Array.from(getBusyFacultyIdsAtSlot(day, timeSlot));
}

function getSuggestedSubstitutes(absentFacultyId, day, timeSlot, slotType = 'lecture', excludeRef = null) {
  return getFreeFacultyForSlot(day, timeSlot, {
    absentFacultyId,
    slotType: slotType || 'lecture',
    excludeRef
  });
}

function getAffectedSlots(facultyId, day, periods = ['full']) {
  return scanAffectedSlots(facultyId, day)
    .filter((slot) => slotMatchesLeavePeriods(slot.timeSlot, periods))
    .map((slot) => {
      const slotId = buildSlotId(slot.branch, slot.semester, slot.day, slot.timeSlot);
      const excludeRef = {
        branch: slot.branch,
        semester: slot.semester,
        day: slot.day,
        timeSlot: slot.timeSlot
      };
      const substitutes = getSuggestedSubstitutes(
        facultyId,
        slot.day,
        slot.timeSlot,
        slot.type,
        excludeRef
      );
      const session = getSessionByTimeSlot(slot.timeSlot);
      return {
        id: slotId,
        slotId,
        branch: slot.branch,
        semester: slot.semester,
        division: slot.division,
        day: slot.day,
        timeSlot: slot.timeSlot,
        timeLabel: session ? session.time : slot.timeLabel,
        subject: slot.subject,
        subjectId: slot.subjectId,
        facultyId: slot.facultyId,
        type: slot.type,
        absentFacultyId: facultyId,
        absentFacultyName: getFacultyName(facultyId),
        suggestedSubstitute: substitutes[0] || null,
        suggestedSubstitutes: substitutes
      };
    });
}

function normalizeSubstitutionHistoryStore(raw) {
  if (!Array.isArray(raw)) return [];
  const flat = [];
  raw.forEach((item) => {
    if (item && item.recordType === 'slot') {
      flat.push(item);
      return;
    }
    if (item && Array.isArray(item.changes)) {
      item.changes.forEach((change, index) => {
        flat.push({
          recordType: 'slot',
          id: `${item.id}_${index}`,
          batchId: item.id,
          status: item.status === 'Undone' ? 'Undone' : 'Active',
          timestamp: item.timestamp,
          dateIso: item.dateIso,
          dateLabel: item.dateLabel,
          day: change.day,
          branch: change.branch,
          semester: change.semester,
          division: change.division,
          timeSlot: change.timeSlot,
          timeLabel: change.timeLabel,
          subject: change.subject,
          subjectId: change.subjectId,
          originalFacultyId: change.originalFacultyId,
          originalFacultyName: change.originalFacultyName,
          substituteFacultyId: change.substituteFacultyId,
          substituteFacultyName: change.substituteFacultyName,
          slotId: buildSlotId(change.branch, change.semester, change.day, change.timeSlot)
        });
      });
      flat.push({ recordType: 'batch', ...item });
    }
  });
  return flat;
}

function loadSubstitutionHistoryEntries() {
  return normalizeSubstitutionHistoryStore(loadSubstitutionHistory());
}

function saveSubstitutionHistoryRaw(entries) {
  saveSubstitutionHistoryStack(entries);
}

function appendSubstitutionHistorySlotEntry(entry) {
  const stack = loadSubstitutionHistory();
  stack.push({ recordType: 'slot', status: 'Active', ...entry });
  saveSubstitutionHistoryRaw(stack);
}

function getSubstitutionHistoryLog(limit = 10) {
  return loadSubstitutionHistory()
    .filter((e) => e.recordType === 'slot')
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
}

function getTimetableSlotRef(branch, semester, day, timeSlot) {
  const key = getScheduleKey(branch, semester);
  if (!AppData.timetables[key]) AppData.timetables[key] = {};
  if (!AppData.timetables[key][day]) AppData.timetables[key][day] = {};
  return AppData.timetables[key][day][timeSlot];
}

function pushLeaveSubstitutionNotification({
  division,
  timeLabel,
  absentName,
  substituteName,
  subject,
  dateLabel
}) {
  if (!AppData.notifications) AppData.notifications = [];
  AppData.notifications.unshift({
    id: 'N' + Date.now() + Math.random().toString(36).slice(2, 7),
    message: `${division} | ${timeLabel}: ${absentName} → ${substituteName} for ${subject} on ${dateLabel}`,
    type: 'warning',
    time: formatNotifTime()
  });
}

function confirmSubstitution(slotId, newFacultyId, originalFacultyId, meta = {}) {
  const parsed = parseSlotId(slotId);
  if (!parsed) return { success: false, message: 'Invalid slot reference.' };

  const slot = getTimetableSlotRef(parsed.branch, parsed.semester, parsed.day, parsed.timeSlot);
  if (!slot) return { success: false, message: 'Timetable slot not found.' };

  const sub = getFacultyById(newFacultyId);
  if (!sub) return { success: false, message: 'Substitute faculty not found.' };

  const session = getSessionByTimeSlot(parsed.timeSlot);
  const timeLabel = session ? session.time : String(parsed.timeSlot);
  const division = `${parsed.branch}${parsed.semester !== 'Semester 1' ? ' · ' + parsed.semester : ''}`;
  const originalName = slot.facultyName || getFacultyName(originalFacultyId || slot.facultyId);
  const prevFacultyId = slot.facultyId;

  slot.facultyId = newFacultyId;
  slot.facultyName = sub.name;
  slot.substitutedFrom = originalFacultyId || prevFacultyId;
  delete slot.substituteName;

  const historyId = 'HIST' + Date.now() + Math.random().toString(36).slice(2, 6);
  appendSubstitutionHistorySlotEntry({
    id: historyId,
    slotId,
    timestamp: new Date().toISOString(),
    dateIso: meta.dateIso || new Date().toISOString().split('T')[0],
    dateLabel: meta.dateLabel || meta.day || parsed.day,
    day: parsed.day,
    branch: parsed.branch,
    semester: parsed.semester,
    division,
    timeSlot: parsed.timeSlot,
    timeLabel,
    subject: slot.subjectName || meta.subject || 'Class',
    subjectId: slot.subjectId,
    originalFacultyId: originalFacultyId || prevFacultyId,
    originalFacultyName: originalName,
    substituteFacultyId: newFacultyId,
    substituteFacultyName: sub.name
  });

  pushLeaveSubstitutionNotification({
    division,
    timeLabel,
    absentName: getFacultyName(originalFacultyId || prevFacultyId),
    substituteName: sub.name,
    subject: slot.subjectName || 'Class',
    dateLabel: meta.dateLabel || parsed.day
  });

  const activeKey = getScheduleKey(AppData.activeBranch, AppData.activeSemester);
  if (AppData.timetables[activeKey]) AppData.timetable = AppData.timetables[activeKey];

  if (meta.markAbsentOnLeave && originalFacultyId) {
    const absent = getFacultyById(originalFacultyId);
    if (absent) {
      absent.available = false;
      absent.onLeave = true;
    }
  }

  saveData();
  return { success: true, historyId };
}

function undoSubstitution(historyEntryId) {
  const stack = loadSubstitutionHistory();
  const index = stack.findIndex((e) => e.id === historyEntryId && e.recordType === 'slot');
  if (index < 0) {
    return { success: false, message: 'Substitution record not found.' };
  }

  const entry = stack[index];
  if (entry.status === 'Undone') {
    return { success: false, message: 'This substitution was already undone.' };
  }

  const parsed = parseSlotId(entry.slotId);
  if (!parsed) return { success: false, message: 'Invalid slot in history.' };

  const slot = getTimetableSlotRef(parsed.branch, parsed.semester, parsed.day, parsed.timeSlot);
  if (slot) {
    slot.facultyId = entry.originalFacultyId;
    slot.facultyName = entry.originalFacultyName;
    delete slot.substitutedFrom;
    delete slot.substituteName;
  }

  entry.status = 'Undone';
  stack[index] = entry;
  saveSubstitutionHistoryRaw(stack);

  const activeKey = getScheduleKey(AppData.activeBranch, AppData.activeSemester);
  if (AppData.timetables[activeKey]) AppData.timetable = AppData.timetables[activeKey];

  saveData();
  return { success: true, message: 'Substitution undone for this slot.' };
}

// Get faculty name by id
function getFacultyName(id) {
  const f = AppData.faculty.find(f => f.id === id);
  return f ? f.name : "Unknown";
}

// Get subject by id
function getSubject(id) {
  return AppData.subjects.find(s => s.id === id);
}

// Get lab name by id
function getLabName(id) {
  const lab = AppData.labs.find(l => l.id === id);
  return lab ? lab.name : "Unknown";
}

// Workload per faculty
function getFacultyWorkload() {
  const workload = {};
  AppData.faculty.forEach(f => {
    workload[f.id] = { name: f.name, sessions: 0, max: f.maxSessions };
  });

  const tt = AppData.timetable;
  if (tt) {
    Object.values(tt).forEach(daySlots => {
      Object.values(daySlots).forEach(slot => {
        if (slot && workload[slot.facultyId]) {
          workload[slot.facultyId].sessions++;
        }
      });
    });
  }
  return workload;
}

// Initialize
loadData();
if (!AppData.timetable || Object.keys(AppData.timetable).length === 0) {
  generateTimetable(AppData.activeBranch, AppData.activeSemester);
}
