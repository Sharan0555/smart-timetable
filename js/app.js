// ===== SMART TIMETABLE MANAGEMENT SYSTEM - MAIN JS =====

// ===== ICONS (defined first — used throughout) =====
const icons = {
  grid: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  book: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  flask: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 3h6m-5 0v6L4.5 19A2 2 0 0 0 6.19 22h11.62a2 2 0 0 0 1.69-3L14 9V3"/><line x1="6" y1="14" x2="18" y2="14"/></svg>`,
  alert: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  bell: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  refresh: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
  download: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  plus: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  trash: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
  logout: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  chat: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
};

let currentUser = null;
let signupRole = 'student';
let pendingGoogleProfile = null;

// TODO: Replace with your Google Client ID from console.cloud.google.com
// Create project → Enable "Google Identity" API → OAuth 2.0 Credentials
// Authorized JS origins: http://localhost:8080, http://127.0.0.1:5500, https://smartclassscheduler.netlify.app
const GOOGLE_CLIENT_ID = "341867545002-i2jeif88kpp8ivqklrgavq32p0thpruf.apps.googleusercontent.com";

// ===== AUTH =====
function initAuth() {
  const roleTabs = document.querySelectorAll('.role-tab');
  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      roleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('login-role').value = tab.dataset.role;
    });
  });
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  initGoogleSignIn();
}

function decodeJWT(token) {
  const payload = token.split(".")[1];
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
}

function isGoogleClientConfigured() {
  return (
    GOOGLE_CLIENT_ID &&
    !GOOGLE_CLIENT_ID.includes("PASTE_YOUR_CLIENT_ID_HERE")
  );
}

function initGoogleSignIn() {
  const btnHost = document.getElementById("google-btn");
  const hint = document.getElementById("google-config-hint");
  if (!btnHost) return;

  const tryInit = () => {
    if (!window.google?.accounts?.id) {
      setTimeout(tryInit, 120);
      return;
    }

    if (!isGoogleClientConfigured()) {
      btnHost.innerHTML = "";
      if (hint) hint.style.display = "block";
      return;
    }

    if (hint) hint.style.display = "none";

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
      auto_select: false
    });

    google.accounts.id.renderButton(btnHost, {
      theme: "outline",
      size: "large",
      width: 280,
      text: "continue_with"
    });
  };

  tryInit();
}

function handleGoogleLogin(response) {
  if (!response?.credential) {
    showLoginError("Google sign-in did not return a credential.");
    return;
  }

  let payload;
  try {
    payload = decodeJWT(response.credential);
  } catch {
    showLoginError("Could not read Google sign-in response.");
    return;
  }

  const profile = {
    sub: payload.sub,
    name: payload.name || payload.email,
    email: payload.email,
    picture: payload.picture || ""
  };

  if (!profile.email) {
    showLoginError("Google account has no email address.");
    return;
  }

  const existing = findUserByEmail(profile.email);
  if (existing) {
    const sessionUser = {
      ...existing,
      name: existing.name || profile.name,
      picture: profile.picture || existing.picture || "",
      loginMethod: existing.loginMethod || "google"
    };
    saveUserToRegistry(sessionUser);
    completeLogin(sessionUser);
    return;
  }

  pendingGoogleProfile = profile;
  showRoleSelector(profile);
}

function showRoleSelector(profile) {
  const loginPanel = document.getElementById("auth-login-panel");
  const roleStep = document.getElementById("google-role-step");
  if (!roleStep) return;

  if (loginPanel) loginPanel.style.display = "none";

  const safeName = profile.name || "there";
  roleStep.style.display = "block";
  roleStep.setAttribute("aria-hidden", "false");
  roleStep.innerHTML = `
    <div class="google-role-card">
      ${profile.picture ? `<img src="${profile.picture}" alt="" class="google-role-avatar" referrerpolicy="no-referrer">` : ""}
      <h2>Welcome, ${safeName}!</h2>
      <p>Select your role to continue:</p>
      <div class="google-role-options">
        <button type="button" class="google-role-option" onclick="completeGoogleSignup('admin')">
          <span class="google-role-icon">${icons.grid}</span>
          <strong>Admin</strong>
          <span>Manage timetables &amp; faculty</span>
        </button>
        <button type="button" class="google-role-option" onclick="completeGoogleSignup('faculty')">
          <span class="google-role-icon">${icons.users}</span>
          <strong>Faculty</strong>
          <span>View schedule &amp; leave</span>
        </button>
        <button type="button" class="google-role-option" onclick="completeGoogleSignup('student')">
          <span class="google-role-icon">${icons.book}</span>
          <strong>Student</strong>
          <span>View class timetable</span>
        </button>
      </div>
      <button type="button" class="auth-link" onclick="cancelGoogleRoleSelection()">← Back to login</button>
    </div>
  `;
}

function cancelGoogleRoleSelection() {
  pendingGoogleProfile = null;
  const loginPanel = document.getElementById("auth-login-panel");
  const roleStep = document.getElementById("google-role-step");
  if (loginPanel) loginPanel.style.display = "block";
  if (roleStep) {
    roleStep.style.display = "none";
    roleStep.setAttribute("aria-hidden", "true");
    roleStep.innerHTML = "";
  }
}

function completeGoogleSignup(role) {
  if (!pendingGoogleProfile) return;
  if (!["admin", "faculty", "student"].includes(role)) return;

  const user = createGoogleUser(pendingGoogleProfile, role);
  const saved = saveUserToRegistry(user);
  pendingGoogleProfile = null;

  const loginPanel = document.getElementById("auth-login-panel");
  const roleStep = document.getElementById("google-role-step");
  if (loginPanel) loginPanel.style.display = "block";
  if (roleStep) {
    roleStep.style.display = "none";
    roleStep.setAttribute("aria-hidden", "true");
    roleStep.innerHTML = "";
  }

  completeLogin(saved || user);
}

function persistCurrentUser(user) {
  currentUser = user;
  sessionStorage.setItem("current_user", JSON.stringify(user));
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function loadStoredCurrentUser() {
  try {
    const fromSession = sessionStorage.getItem("current_user");
    if (fromSession) return JSON.parse(fromSession);
    const fromLocal = localStorage.getItem("currentUser");
    if (fromLocal) {
      const user = JSON.parse(fromLocal);
      sessionStorage.setItem("current_user", JSON.stringify(user));
      return user;
    }
  } catch {
    return null;
  }
  return null;
}

function completeLogin(user) {
  persistCurrentUser(user);
  launchApp();
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const role = document.getElementById('login-role').value;

  const user = findPasswordUser(email, password, role);
  if (!user) {
    showLoginError('Invalid credentials. Check your email, password, and role.');
    return;
  }
  completeLogin({ ...user, loginMethod: user.loginMethod || 'password' });
}

function showLoginError(msg) {
  let err = document.getElementById('login-error');
  if (!err) {
    err = document.createElement('p');
    err.id = 'login-error';
    err.style.cssText = 'color:#D95F5F;font-size:13px;text-align:center;margin-top:8px;';
    document.getElementById('login-form').appendChild(err);
  }
  err.textContent = msg;
  setTimeout(() => err.remove(), 4000);
}

function launchApp() {
  document.getElementById('auth-page').style.display = 'none';
  const app = document.getElementById('app');
  app.style.display = 'block';
  buildNav();
  updateUserBar();
  navigateTo('dashboard');
  renderNotifBadge();
}

function logout() {
  if (window.google?.accounts?.id) {
    google.accounts.id.disableAutoSelect();
  }
  currentUser = null;
  pendingGoogleProfile = null;
  sessionStorage.removeItem('current_user');
  localStorage.removeItem('currentUser');
  document.getElementById('app').style.display = 'none';
  document.getElementById('auth-page').style.display = 'flex';
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  cancelGoogleRoleSelection();
  initGoogleSignIn();
}

function getActiveBranch() {
  return AppData.activeBranch || AppData.branches?.[0] || 'CSE-A';
}

function getActiveSemester() {
  return AppData.activeSemester || AppData.semesters?.[0] || 'Semester 1';
}

function getScheduleKey(branch = getActiveBranch(), semester = getActiveSemester()) {
  return `${branch}::${semester}`;
}

function getLabById(id) {
  return AppData.labs.find(lab => lab.id === id);
}

function getLabsForSubject(subjectId) {
  const subj = getSubject(subjectId);
  const availableLabs = AppData.labs.filter(lab => lab.available);
  if (!subj || !subj.hasPractical) return [];

  const mappedLabs = availableLabs.filter(lab => (lab.subjects || []).includes(subjectId));
  return mappedLabs.length ? mappedLabs : availableLabs;
}

function switchTimetableBranch(branch) {
  if (!branch) return;
  if (!AppData.branches.includes(branch)) return;

  AppData.activeBranch = branch;
  syncActiveSchedule();

  renderTimetable();
}

function switchTimetableSemester(semester) {
  if (!semester) return;
  if (!AppData.semesters.includes(semester)) return;

  AppData.activeSemester = semester;
  syncActiveSchedule();

  renderTimetable();
}

function syncActiveSchedule() {
  if (!AppData.timetables) AppData.timetables = {};
  const key = getScheduleKey();
  const schedule = AppData.timetables[key];
  if (!schedule || Object.keys(schedule).length === 0) {
    generateTimetable(getActiveBranch(), getActiveSemester());
    return;
  }

  AppData.timetable = schedule;
  saveData();
}

function showSignup() {
  signupRole = 'student';
  openModal('Sign Up', `
    <div style="display:flex;flex-direction:column;gap:12px;">
      <div class="form-group">
        <label>I am signing up as</label>
        <div class="role-select">
          <button type="button" class="role-option" data-role="faculty" onclick="setSignupRole('faculty')">
            <strong>Faculty</strong>
            <span>Create a faculty account with Gmail.</span>
          </button>
          <button type="button" class="role-option active" data-role="student" onclick="setSignupRole('student')">
            <strong>Student</strong>
            <span>Create a student account with Gmail.</span>
          </button>
        </div>
        <input type="hidden" id="signup-role" value="student">
      </div>
      <div class="form-group"><label>Full Name</label><input class="form-control" id="signup-name" placeholder="Your full name"></div>
      <div class="form-group"><label>Gmail Address</label><input class="form-control" id="signup-email" type="email" placeholder="yourname@gmail.com"></div>
      <div class="form-group"><label>Password</label><input class="form-control" id="signup-password" type="password" placeholder="Create a password"></div>
      <div class="form-group"><label>Confirm Password</label><input class="form-control" id="signup-confirm" type="password" placeholder="Repeat your password"></div>
      <p class="auth-note">Only Gmail addresses are allowed. Admin accounts cannot be created from this screen.</p>
      <div style="display:flex;gap:8px;margin-top:4px;">
        <button class="btn btn-solid" style="flex:1" onclick="confirmSignup()">Create Account</button>
        <button class="btn btn-outline" style="flex:1" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function setSignupRole(role) {
  signupRole = role === 'faculty' ? 'faculty' : 'student';
  const roleInput = document.getElementById('signup-role');
  if (roleInput) roleInput.value = signupRole;
  document.querySelectorAll('.role-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === signupRole);
  });
}

function confirmSignup() {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm').value;
  const role = document.getElementById('signup-role').value;

  if (!['faculty', 'student'].includes(role)) {
    showToast('Only faculty and student accounts can be created here.', 'warn');
    return;
  }
  if (!name) {
    showToast('Please enter your full name.', 'warn');
    return;
  }
  if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
    showToast('Please use a valid Gmail address.', 'warn');
    return;
  }
  if (password.length < 6) {
    showToast('Password must be at least 6 characters.', 'warn');
    return;
  }
  if (password !== confirmPassword) {
    showToast('Passwords do not match.', 'warn');
    return;
  }
  if (AppData.users.some(user => user.email.toLowerCase() === email)) {
    showToast('An account with this Gmail already exists.', 'warn');
    return;
  }

  const nextId = 'U' + String(AppData.users.length + 1).padStart(3, '0');
  const newUser = { id: nextId, name, email, password, role };

  saveUserToRegistry(newUser);
  closeModal();

  showToast('Account created successfully!', 'success');
  completeLogin({ ...newUser, loginMethod: 'password' });
}

// ===== NAV =====
const navItems = {
  admin: [
    { id: 'dashboard', icon: icons.grid, label: 'Dashboard', section: 'General' },
    { id: 'timetable', icon: icons.calendar, label: 'Timetable', section: 'General' },
    { id: 'faculty', icon: icons.users, label: 'Faculty', section: 'Management' },
    { id: 'subjects', icon: icons.book, label: 'Subjects', section: 'Management' },
    { id: 'labs', icon: icons.flask, label: 'Labs', section: 'Management' },
    { id: 'conflicts', icon: icons.alert, label: 'Conflict Detector', section: 'Tools' },
    { id: 'notifications', icon: icons.bell, label: 'Notifications', section: 'Tools' },
  ],
  faculty: [
    { id: 'dashboard', icon: icons.grid, label: 'My Dashboard', section: 'General' },
    { id: 'timetable', icon: icons.calendar, label: 'My Timetable', section: 'General' },
    { id: 'notifications', icon: icons.bell, label: 'Notifications', section: 'General' },
  ],
  student: [
    { id: 'dashboard', icon: icons.grid, label: 'Dashboard', section: 'General' },
    { id: 'timetable', icon: icons.calendar, label: 'Class Timetable', section: 'General' },
    { id: 'subjects', icon: icons.book, label: 'Subjects', section: 'General' },
    { id: 'notifications', icon: icons.bell, label: 'Notifications', section: 'General' },
  ]
};

function buildNav() {
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = '';
  const role = currentUser.role;
  const items = navItems[role] || navItems.student;

  let lastSection = '';
  items.forEach(item => {
    if (item.section !== lastSection) {
      const label = document.createElement('div');
      label.className = 'nav-section-label';
      label.textContent = item.section;
      nav.appendChild(label);
      lastSection = item.section;
    }
    const btn = document.createElement('button');
    btn.className = 'nav-item';
    btn.dataset.page = item.id;
    btn.innerHTML = `${item.icon}<span>${item.label}</span>`;
    btn.addEventListener('click', () => navigateTo(item.id));
    nav.appendChild(btn);
  });
}

function updateUserBar() {
  const avatarEl = document.getElementById('user-avatar');
  if (currentUser.picture) {
    avatarEl.innerHTML = `<img src="${currentUser.picture}" alt="" class="user-avatar-img" referrerpolicy="no-referrer">`;
  } else {
    const initials = currentUser.name
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    avatarEl.textContent = initials;
  }
  document.getElementById('user-name').textContent = currentUser.name;
  document.getElementById('user-role').textContent = currentUser.role;
}

function navigateTo(pageId) {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });
  document.querySelectorAll('.section-page').forEach(page => {
    page.classList.toggle('active', page.id === `page-${pageId}`);
  });

  const titles = {
    dashboard: ['Dashboard', 'Welcome back, ' + currentUser.name],
    timetable: ['Timetable', 'NEP 2020 Weekly Schedule'],
    faculty: ['Faculty Management', 'Manage faculty records and workload'],
    subjects: ['Subject Management', 'NEP 2020 course structure'],
    labs: ['Lab Management', 'Laboratory availability and assignments'],
    conflicts: ['Conflict Detector', 'Real-time schedule conflict analysis'],
    notifications: ['Notifications', 'Latest updates and alerts']
  };

  const [title, sub] = titles[pageId] || ['Page', ''];
  document.getElementById('topbar-title').textContent = title;
  document.getElementById('topbar-sub').textContent = sub;

  // Render page content
  renderPage(pageId);
}

function renderPage(id) {
  switch (id) {
    case 'dashboard': renderDashboard(); break;
    case 'timetable': renderTimetable(); break;
    case 'faculty': renderFaculty(); break;
    case 'subjects': renderSubjects(); break;
    case 'labs': renderLabs(); break;
    case 'conflicts': renderConflicts(); break;
    case 'notifications': renderNotifications(); break;
  }
}

// ===== DASHBOARD =====
function renderDashboard() {
  const el = document.getElementById('page-dashboard');
  const workload = getFacultyWorkload();
  const wItems = Object.values(workload);
  const absentFaculty = AppData.faculty.filter(f => !f.available).length;
  const unavailLabs = AppData.labs.filter(l => !l.available).length;

  el.innerHTML = `
    <div class="page-title" style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div>
        <h2>Good Morning! 🌤️</h2>
        <p>${new Date().toLocaleDateString('en-IN', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</p>
      </div>
      ${currentUser.role === 'admin' ? `
        <button class="btn btn-outline" onclick="undoLastSubstitutionAction()"
          ${hasUndoableSubstitution() ? '' : 'disabled style="opacity:0.5;cursor:not-allowed;"'}>
          Undo Last Substitution
        </button>` : ''}
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon blue">${icons.users}</div>
          <span class="stat-badge up">Active</span>
        </div>
        <div class="stat-value">${AppData.faculty.filter(f=>f.available).length}</div>
        <div class="stat-label">Faculty Available Today</div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon green">${icons.book}</div>
          <span class="stat-badge up">NEP 2020</span>
        </div>
        <div class="stat-value">${AppData.subjects.length}</div>
        <div class="stat-label">Total Subjects</div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon orange">${icons.flask}</div>
          <span class="stat-badge warn">${unavailLabs} Closed</span>
        </div>
        <div class="stat-value">${AppData.labs.length}</div>
        <div class="stat-label">Laboratories</div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon red">${icons.alert}</div>
          <span class="stat-badge ${absentFaculty > 0 ? 'warn' : 'up'}">${absentFaculty > 0 ? 'Action' : 'Clear'}</span>
        </div>
        <div class="stat-value">${absentFaculty}</div>
        <div class="stat-label">Faculty on Leave</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <div><h3>Faculty Workload</h3><p>Sessions assigned this week</p></div>
        </div>
        <div class="card-body">
          <div class="workload-list">
            ${wItems.map(w => {
              const pct = Math.round((w.sessions / w.max) * 100);
              const cls = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';
              return `<div class="workload-item">
                <div class="workload-info">
                  <span class="workload-name">${w.name}</span>
                  <span class="workload-count">${w.sessions}/${w.max} sessions</span>
                </div>
                <div class="workload-bar"><div class="workload-fill ${cls}" style="width:${pct}%"></div></div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div><h3>Recent Notifications</h3><p>Latest updates</p></div>
          <button class="btn btn-outline" onclick="navigateTo('notifications')" style="font-size:12px;padding:6px 12px;">View All</button>
        </div>
        <div class="card-body">
          <div class="notif-list">
            ${AppData.notifications.map(n => `
              <div class="notif-item ${n.type}">
                <div class="notif-dot"></div>
                <span class="notif-msg">${n.message}</span>
                <span class="notif-time">${n.time}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <div class="card mt-24">
      <div class="card-header">
        <div><h3>Quick Schedule Summary</h3><p>Today's overview</p></div>
      </div>
      <div class="card-body">
        <div class="schedule-summary">
          <div class="summary-item"><div class="s-val">7</div><div class="s-label">Teaching Sessions</div></div>
          <div class="summary-item"><div class="s-val">09:30</div><div class="s-label">College Start</div></div>
          <div class="summary-item"><div class="s-val">17:00</div><div class="s-label">College End</div></div>
        </div>
      </div>
    </div>
  `;
}

// ===== TIMETABLE =====
function renderTimetable(selectedDay = 'all') {
  const el = document.getElementById('page-timetable');
  const activeBranch = getActiveBranch();
  const activeSemester = getActiveSemester();
  const tt = AppData.timetables?.[getScheduleKey(activeBranch, activeSemester)] || AppData.timetable || {};
  AppData.activeBranch = activeBranch;
  AppData.activeSemester = activeSemester;
  AppData.timetable = tt;
  const sessions = typeof ensureNationalAnthemSession === 'function'
    ? ensureNationalAnthemSession(AppData.config.sessions)
    : AppData.config.sessions;
  const days = AppData.config.days;

  const canEdit = currentUser.role === 'admin';

  el.innerHTML = `
    <div class="page-title">
      <h2>Weekly Timetable</h2>
      <p>Paper-style academic schedule formatted to match the department timetable layout for ${activeBranch}, ${activeSemester}</p>
    </div>

    <div class="tt-controls">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:12px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.6px;">Branch</span>
        <select class="select-control" id="branch-select" onchange="switchTimetableBranch(this.value)">
          ${AppData.branches.map(branch => `<option value="${branch}" ${branch === activeBranch ? 'selected' : ''}>${branch}</option>`).join('')}
        </select>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:12px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.6px;">Semester</span>
        <select class="select-control" id="semester-select" onchange="switchTimetableSemester(this.value)">
          ${AppData.semesters.map(semester => `<option value="${semester}" ${semester === activeSemester ? 'selected' : ''}>${semester}</option>`).join('')}
        </select>
      </div>
      ${canEdit ? `<button class="btn btn-solid" onclick="doGenerateTimetable()">
        ${icons.refresh} Regenerate
      </button>` : ''}
      <button class="btn btn-outline" onclick="printTimetable()">
        ${icons.download} Export
      </button>
      <div style="flex:1"></div>
      <span style="font-size:12px;color:var(--text3)">Total: ${AppData.subjects.length} subjects, ${days.length} days</span>
    </div>

    <div class="paper-sheet">
      <div class="paper-top">
        <div class="paper-branding">
          <div class="paper-seal">
            <div class="paper-seal-inner">
              <img class="logo-mark" src="public/assets/college-logo.jpeg" alt="Shri Siddheshwar Women's College of Engineering, Solapur logo">
            </div>
          </div>
          <div class="paper-institute">
            <div class="paper-institute-line">Shri Siddheshwar Devsthan, Solapur.</div>
            <div class="paper-institute-title">Shree Siddheshwar Women&apos;s College of Engineering, Solapur</div>
            <div class="paper-institute-subtitle">Approved by AICTE, New Delhi, Recognised by Govt. of Maharashtra &amp; Affiliated to DBATU, Lonere</div>
            <div class="paper-institute-contact">E-mail: office@sswcoec.edu.in | Website: www.sswcoec.edu.in | Phone 0217-2627227</div>
            <div class="paper-institute-address">T.P.S. II, Final Plot No. 74, BhawaniPeth, RupaBhawani Road, Solapur – 413002</div>
          </div>
        </div>
        <div class="paper-title-block">
          <div class="paper-title-main">TIME TABLE</div>
          <div class="paper-title-meta">${activeBranch} · ${activeSemester}</div>
        </div>
      </div>

      <div class="tt-scroll">
        <table class="paper-table">
          <thead>
            <tr>
              <th class="paper-time-head">Day / Time</th>
              ${days.map(d => `<th>${d.slice(0, 3)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${sessions.map(session => {
              if (session.type === 'anthem') {
                return `<tr class="paper-anthem-row">
                  <th class="paper-time-cell paper-anthem-time-cell">
                    <span class="paper-session-name">&nbsp;</span>
                  </th>
                  <td class="paper-anthem-cell" colspan="${days.length}">
                    <span class="paper-anthem-label">${session.label}</span>
                  </td>
                </tr>`;
              }

              if (session.type === 'break') {
                return `<tr class="paper-break-row">
                  <th class="paper-time-cell">
                    <span class="paper-session-name">${session.label}</span>
                    <span class="paper-session-time">${session.time}</span>
                  </th>
                  <td class="paper-break-cell" colspan="${days.length}">
                    <span class="paper-break-label">${session.label}</span>
                  </td>
                </tr>`;
              }

              if (session.type === 'special') {
                return `<tr class="paper-special-row">
                  <th class="paper-time-cell">
                    <span class="paper-session-name">${session.label}</span>
                    <span class="paper-session-time">${session.time}</span>
                  </th>
                  ${days.map(day => {
                    const specialSlot = tt && tt[day] && tt[day][session.id];
                    const specialText = (specialSlot && (specialSlot.text || specialSlot.label || specialSlot.value)) || 'AAO / Mentor';
                    return `<td class="paper-slot-cell">
                      <div class="paper-special-chip ${canEdit ? 'editable' : ''}" ${canEdit ? `onclick="showEditSpecialSlot('${day}','${session.id}')"` : ''} title="${canEdit ? 'Click to edit special slot' : specialText}">
                        ${specialText}
                      </div>
                    </td>`;
                  }).join('')}
                </tr>`;
              }

              return `<tr>
                <th class="paper-time-cell">
                  <span class="paper-session-name">${session.label}</span>
                  <span class="paper-session-time">${session.time}</span>
                </th>
                ${days.map(day => {
                  const slot = tt && tt[day] && tt[day][session.id];
                  if (slot) {
                    const subj = getSubject(slot.subjectId);
                    const typeClass = 'paper-chip-' + (slot.type || 'major').toLowerCase();
                    const fName = slot.facultyName || getFacultyName(slot.facultyId);
                    const shortFName = fName.split(' ').slice(-1)[0];
                    const labName = slot.labName || (slot.labId ? getLabById(slot.labId)?.name : null) || (subj && subj.lab ? getLabById(subj.lab)?.name : null);
                    return `<td class="paper-slot-cell">
                      <div class="paper-slot ${typeClass}" onclick="showSlotDetail('${day}','${session.id}','${slot.subjectId}')" title="${slot.subjectName} — ${fName}${labName ? ` • ${labName}` : ''}">
                        <div class="paper-slot-code">${subj ? subj.code : ''}</div>
                        <div class="paper-slot-name">${slot.subjectName}</div>
                        <div class="paper-slot-faculty">${shortFName}</div>
                        ${labName ? `<div class="paper-slot-lab">${labName}</div>` : ''}
                      </div>
                    </td>`;
                  }
                  return `<td class="paper-slot-cell">
                    ${canEdit ? `<div class="paper-empty-slot" onclick="showAddSlot('${day}','${session.id}')">+</div>` : '<div class="paper-empty-slot static">—</div>'}
                  </td>`;
                }).join('')}
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function doGenerateTimetable() {
  generateTimetable(getActiveBranch(), getActiveSemester());
  renderTimetable();
  showToast('Timetable regenerated successfully!', 'success');
}

function printTimetable() {
  window.print();
}

function showEditSpecialSlot(day, sessionId) {
  const current = AppData.timetable?.[day]?.[sessionId];
  const currentText = (current && (current.text || current.label || current.value)) || 'AAO / Mentor';

  openModal('Edit Special Slot', `
    <div style="display:flex;flex-direction:column;gap:12px;">
      <div class="form-group">
        <label>Day</label>
        <input class="form-control" value="${day}" readonly>
      </div>
      <div class="form-group">
        <label>Special Text</label>
        <textarea class="form-control" id="special-slot-text" rows="4" placeholder="Enter anything you want here...">${currentText}</textarea>
      </div>
      <p class="auth-note" style="text-align:left;margin-top:0;">Leave it as AAO / Mentor or replace it with any custom note, activity, or event.</p>
      <div style="display:flex;gap:8px;margin-top:4px;">
        <button class="btn btn-solid" style="flex:1" onclick="confirmSpecialSlot('${day}','${sessionId}')">Save</button>
        <button class="btn btn-outline" style="flex:1" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function confirmSpecialSlot(day, sessionId) {
  const text = document.getElementById('special-slot-text').value.trim();
  if (!AppData.timetable) AppData.timetable = {};
  if (!AppData.timetable[day]) AppData.timetable[day] = {};
  AppData.timetable[day][sessionId] = {
    type: 'SPECIAL',
    label: text || 'AAO / Mentor',
    text: text || 'AAO / Mentor'
  };
  if (!AppData.timetables) AppData.timetables = {};
  AppData.timetables[getScheduleKey()] = AppData.timetable;
  saveData();
  closeModal();
  renderTimetable();
  showToast('Special slot updated.', 'success');
}

function showSlotDetail(day, sessionId, subjectId) {
  const slot = AppData.timetable?.[day]?.[sessionId];
  const subj = getSubject(subjectId || slot?.subjectId);
  const session = AppData.config.sessions.find(s => s.id == sessionId);
  if (!subj || !session || !slot) return;
  const fac = slot.facultyId ? AppData.faculty.find(f => f.id === slot.facultyId) : AppData.faculty.find(f => f.id === subj.faculty);
  const lab = slot.labId ? getLabById(slot.labId) : (subj.lab ? getLabById(subj.lab) : null);

  openModal('Slot Details', `
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:var(--primary-pale);border-radius:10px;padding:16px;">
        <div style="font-size:12px;color:var(--text3);margin-bottom:4px;">${subj.code}</div>
        <div style="font-size:18px;font-weight:700;color:var(--primary)">${subj.name}</div>
        <div style="font-size:13px;color:var(--text2);margin-top:4px;">${subj.type} Course · ${subj.credits} Credits</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div><div style="font-size:11px;color:var(--text3);font-weight:600;margin-bottom:3px;">DAY</div><div style="font-size:14px;font-weight:600;">${day}</div></div>
        <div><div style="font-size:11px;color:var(--text3);font-weight:600;margin-bottom:3px;">TIME</div><div style="font-size:14px;font-weight:600;">${session.time}</div></div>
        <div><div style="font-size:11px;color:var(--text3);font-weight:600;margin-bottom:3px;">FACULTY</div><div style="font-size:14px;font-weight:600;">${slot.facultyName || (fac ? fac.name : 'N/A')}${slot.substitutedFrom ? ' <span style="font-size:11px;color:var(--warn);">(substitute)</span>' : ''}</div></div>
        <div><div style="font-size:11px;color:var(--text3);font-weight:600;margin-bottom:3px;">VENUE</div><div style="font-size:14px;font-weight:600;">${lab ? lab.name : 'Classroom'}</div></div>
      </div>
      ${currentUser.role === 'admin' ? `
        <div style="display:flex;gap:8px;margin-top:4px;">
          <button class="btn btn-danger" style="flex:1" onclick="deleteSlot('${day}','${sessionId}');closeModal()">Remove Slot</button>
          <button class="btn btn-outline" style="flex:1" onclick="closeModal()">Close</button>
        </div>` : `<button class="btn btn-outline" style="width:100%" onclick="closeModal()">Close</button>`}
    </div>
  `);
}

function deleteSlot(day, sessionId) {
  if (AppData.timetable[day]) {
    AppData.timetable[day][sessionId] = null;
    saveData();
    renderTimetable();
    showToast('Slot removed.', 'info');
  }
}

function showAddSlot(day, sessionId) {
  const subjOptions = AppData.subjects.map(s => `<option value="${s.id}">${s.code} — ${s.name}</option>`).join('');
  openModal('Add Slot', `
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div class="form-group">
        <label>Day</label>
        <input class="form-control" value="${day}" readonly>
      </div>
      <div class="form-group">
        <label>Session</label>
        <input class="form-control" value="${AppData.config.sessions.find(s=>s.id==sessionId)?.time}" readonly>
      </div>
      <div class="form-group">
        <label>Subject</label>
        <select class="form-control" id="add-slot-subject" onchange="updateAddSlotFacultyOptions(this.value)">${subjOptions}</select>
      </div>
      <div class="form-group" id="add-slot-faculty-group">
        <label>Faculty</label>
        <select class="form-control" id="add-slot-faculty"></select>
        <div class="auth-note" id="add-slot-faculty-note" style="text-align:left;margin-top:8px;">Select the faculty member for this slot.</div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-solid" style="flex:1" onclick="confirmAddSlot('${day}','${sessionId}')">Add Slot</button>
        <button class="btn btn-outline" style="flex:1" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);

  const firstSubject = AppData.subjects[0]?.id || '';
  updateAddSlotFacultyOptions(firstSubject);
}

function updateAddSlotFacultyOptions(subjectId) {
  const subject = getSubject(subjectId);
  const facultySelect = document.getElementById('add-slot-faculty');
  const facultyNote = document.getElementById('add-slot-faculty-note');
  if (!facultySelect) return;

  const defaultFacultyId = subject?.faculty || AppData.faculty[0]?.id || '';
  facultySelect.innerHTML = AppData.faculty.length
    ? AppData.faculty
        .map(faculty => `<option value="${faculty.id}" ${faculty.id === defaultFacultyId ? 'selected' : ''}>${faculty.name} (${faculty.dept})</option>`)
        .join('')
    : '<option value="">No faculty available</option>';
  facultySelect.value = defaultFacultyId;
  if (facultyNote) {
    facultyNote.textContent = subject
      ? `Faculty for ${subject.name || 'this subject'} can be changed here.`
      : 'Select a subject first to suggest a faculty member.';
  }
}

function confirmAddSlot(day, sessionId) {
  const subjectId = document.getElementById('add-slot-subject').value;
  const subj = getSubject(subjectId);
  if (!subj) return;
  const facultyId = document.getElementById('add-slot-faculty')?.value || subj.faculty || '';
  const faculty = facultyId ? AppData.faculty.find(f => f.id === facultyId) : AppData.faculty.find(f => f.id === subj.faculty);

  if (!AppData.timetable[day]) AppData.timetable[day] = {};
  AppData.timetable[day][sessionId] = {
    subjectId: subj.id,
    subjectName: subj.name,
    subjectCode: subj.code,
    facultyId: faculty ? faculty.id : subj.faculty,
    facultyName: faculty ? faculty.name : getFacultyName(subj.faculty),
    type: subj.type,
    isPractical: !!subj.hasPractical,
    labId: null,
    labName: null
  };
  saveData();
  closeModal();
  renderTimetable();
  showToast('Slot added successfully!', 'success');
}

// ===== FACULTY =====
function renderFaculty() {
  const el = document.getElementById('page-faculty');
  el.innerHTML = `
    <div class="page-title">
      <h2>Faculty Management</h2>
      <p>Manage faculty records, workload and availability</p>
    </div>
    <div class="tt-controls">
      ${currentUser.role === 'admin' ? `<button class="btn btn-solid" onclick="showAddFaculty()">${icons.plus} Add Faculty</button>` : ''}
      ${currentUser.role === 'admin' ? `<button class="btn btn-outline" onclick="undoLastSubstitutionAction()"
        ${hasUndoableSubstitution() ? '' : 'disabled style="opacity:0.5;cursor:not-allowed;"'}>Undo Last Substitution</button>` : ''}
      <div class="search-bar">${icons.search}<input type="text" placeholder="Search faculty..." id="faculty-search" oninput="filterFaculty(this.value)"></div>
    </div>
    <div class="card">
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr>
            <th>Faculty</th><th>ID</th><th>Department</th><th>Subjects</th>
            <th>Workload</th><th>Status</th>${currentUser.role === 'admin' ? '<th>Actions</th>' : ''}
          </tr></thead>
          <tbody id="faculty-tbody">
            ${renderFacultyRows(AppData.faculty)}
          </tbody>
        </table>
      </div>
    </div>
    ${currentUser.role === 'admin' ? '<div id="leave-substitution-root" class="mt-24"></div>' : ''}
  `;

  if (currentUser.role === 'admin') {
    renderLeaveSubstitutionSection();
  }
}

function renderFacultyRows(list) {
  const wl = getFacultyWorkload();
  return list.map(f => {
    const w = wl[f.id] || { sessions: 0, max: f.maxSessions };
    const pct = Math.round((w.sessions / w.max) * 100);
    const wlClass = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';
    const subjNames = f.subjects.map(sid => {
      const s = AppData.subjects.find(s => s.id === sid);
      return s ? `<span class="badge badge-major" style="margin:1px">${s.code}</span>` : '';
    }).join(' ');

    return `<tr>
      <td><div style="font-weight:600">${f.name}</div></td>
      <td><code style="background:var(--surface2);padding:2px 7px;border-radius:4px;font-size:12px">${f.id}</code></td>
      <td>${f.dept || f.department || '—'}</td>
      <td>${subjNames}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px;min-width:120px">
          <div class="workload-bar" style="flex:1;height:5px"><div class="workload-fill ${wlClass}" style="width:${pct}%"></div></div>
          <span style="font-size:12px;color:var(--text2)">${w.sessions}/${w.max}</span>
        </div>
      </td>
      <td><span class="badge ${(typeof isFacultyOnLeave === 'function' ? !isFacultyOnLeave(f) : f.available) ? 'badge-active' : 'badge-inactive'}">${(typeof isFacultyOnLeave === 'function' ? !isFacultyOnLeave(f) : f.available) ? 'Available' : 'On Leave'}</span></td>
      ${currentUser.role === 'admin' ? `<td><div class="action-btns">
        <button class="btn-icon" onclick="toggleFacultyAvail('${f.id}')" title="Toggle Availability">${icons.refresh}</button>
        <button class="btn-icon delete" onclick="deleteFaculty('${f.id}')" title="Delete">${icons.trash}</button>
      </div></td>` : ''}
    </tr>`;
  }).join('');
}

function filterFaculty(q) {
  const query = q.toLowerCase();
  const filtered = AppData.faculty.filter(f => {
    const dept = (f.dept || f.department || '').toLowerCase();
    return f.name.toLowerCase().includes(query) || dept.includes(query);
  });
  document.getElementById('faculty-tbody').innerHTML = renderFacultyRows(filtered);
}

function toggleFacultyAvail(id) {
  const f = AppData.faculty.find(f => f.id === id);
  if (!f) return;

  if (typeof isFacultyOnLeave === 'function' && isFacultyOnLeave(f)) {
    f.available = true;
    f.onLeave = false;
    saveData();
    renderFaculty();
    if (document.getElementById('page-dashboard')?.classList.contains('active')) renderDashboard();
    if (document.getElementById('page-conflicts')?.classList.contains('active')) renderConflicts();
    showToast(`${f.name} marked as Available`, 'success');
    return;
  }

  triggerAbsenceFlow(id);
}

// ===== FACULTY SUBSTITUTION FLOW =====
let pendingAbsenceFacultyId = null;

function triggerAbsenceFlow(facultyId) {
  const faculty = getFacultyById(facultyId);
  if (!faculty) {
    showToast('Faculty not found.', 'warn');
    return;
  }

  const day = getCurrentDay();
  const affected = scanAffectedSlots(facultyId, day);

  if (!affected.length) {
    faculty.available = false;
    faculty.onLeave = true;
    saveData();
    renderFaculty();
    if (document.getElementById('page-conflicts')?.classList.contains('active')) renderConflicts();
    showToast(`${faculty.name} marked on leave. No classes scheduled today.`, 'info');
    return;
  }

  pendingAbsenceFacultyId = facultyId;
  renderSubstitutionModal(affected, facultyId, day);
}

function renderSubstitutionModal(affectedSlots, absentFacultyId, day) {
  const absentFaculty = getFacultyById(absentFacultyId);
  const absentName = absentFaculty ? absentFaculty.name : absentFacultyId;

  const rowsHtml = affectedSlots.map((slot, index) => {
    const suggested = slot.suggestedSubstitute;
    const freeList = slot.freeFaculty || [];
    const noSubstitute = !suggested && freeList.length === 0;

    const optionsHtml = freeList.length
      ? freeList.map((f) => {
          const dept = f.dept || f.department || '';
          const selected = suggested && f.id === suggested.id ? 'selected' : '';
          return `<option value="${f.id}" ${selected}>${f.name} (${dept})</option>`;
        }).join('')
      : '';

    const badge = noSubstitute
      ? '<span class="badge badge-inactive">No substitute available</span>'
      : suggested
        ? `<span class="badge badge-active">Suggested: ${suggested.name}</span>`
        : '<span class="badge badge-skill">Choose manually</span>';

    return `<tr data-sub-row="${index}">
      <td><strong>${slot.division}</strong>${slot.type === 'lab' ? ' <span class="badge badge-minor">Lab</span>' : ''}</td>
      <td>${slot.timeLabel}</td>
      <td>${slot.subject}</td>
      <td>
        <div style="display:flex;flex-direction:column;gap:6px;">
          ${badge}
          <select class="form-control sub-faculty-select" id="sub-select-${index}"
            data-branch="${slot.branch}" data-semester="${slot.semester}"
            data-day="${slot.day}" data-timeslot="${slot.timeSlot}">
            <option value="">— Select substitute —</option>
            ${optionsHtml}
          </select>
          <input type="text" class="form-control sub-manual-input" id="sub-manual-${index}"
            placeholder="Or enter substitute name manually" style="font-size:12px;">
        </div>
      </td>
    </tr>`;
  }).join('');

  openModal('Faculty Absent – Substitution Required', `
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div style="background:var(--warn-light);border-radius:10px;padding:14px 16px;">
        <div style="font-size:13px;color:var(--text2);">
          <strong>${absentName}</strong> is absent on <strong>${day}</strong>.
          Review and confirm substitutes for <strong>${affectedSlots.length}</strong> affected slot(s) across all divisions.
        </div>
      </div>
      <div style="overflow-x:auto;max-height:340px;border:1px solid var(--border);border-radius:10px;">
        <table class="data-table substitution-table" style="margin:0;">
          <thead>
            <tr>
              <th>Division</th>
              <th>Time</th>
              <th>Subject</th>
              <th>Suggested Substitute</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
      <p class="auth-note" style="text-align:left;margin:0;">
        Lab slots only list faculty with lab access. Rows with no substitute can use manual entry.
      </p>
      <div style="display:flex;gap:8px;margin-top:4px;">
        <button class="btn btn-solid" style="flex:1" onclick="confirmAllSubstitutions()">Confirm All Substitutions</button>
        <button class="btn btn-outline" style="flex:1" onclick="cancelSubstitutionFlow()">Cancel</button>
      </div>
    </div>
  `);

  affectedSlots.forEach((slot, index) => {
    const select = document.getElementById(`sub-select-${index}`);
    if (select && slot.suggestedSubstitute) {
      select.value = slot.suggestedSubstitute.id;
    }
  });

  window._substitutionModalState = { affectedSlots, absentFacultyId, day };
}

function collectSubstitutionAssignments() {
  const state = window._substitutionModalState;
  if (!state) return [];

  return state.affectedSlots.map((slot, index) => {
    const select = document.getElementById(`sub-select-${index}`);
    const manual = document.getElementById(`sub-manual-${index}`);
    const substituteFacultyId = select?.value || '';
    const manualFacultyName = manual?.value?.trim() || '';
    let substituteFacultyName = '';

    if (substituteFacultyId) {
      substituteFacultyName = getFacultyName(substituteFacultyId);
    }

    return {
      branch: slot.branch,
      semester: slot.semester,
      day: slot.day,
      timeSlot: slot.timeSlot,
      substituteFacultyId: substituteFacultyId || null,
      substituteFacultyName,
      manualFacultyName
    };
  });
}

function confirmAllSubstitutions() {
  const state = window._substitutionModalState;
  if (!state) return;

  const assignments = collectSubstitutionAssignments();
  const missing = assignments.filter((a) => !a.substituteFacultyId && !a.manualFacultyName);

  if (missing.length) {
    showToast(`${missing.length} slot(s) still need a substitute or manual name.`, 'warn');
    return;
  }

  const result = confirmSubstitutions(assignments, state.absentFacultyId);
  pendingAbsenceFacultyId = null;
  window._substitutionModalState = null;
  closeModal();

  renderFaculty();
  renderNotifBadge();
  if (document.getElementById('page-dashboard')?.classList.contains('active')) renderDashboard();
  if (document.getElementById('page-timetable')?.classList.contains('active')) renderTimetable();
  if (document.getElementById('page-conflicts')?.classList.contains('active')) renderConflicts();
  if (document.getElementById('page-notifications')?.classList.contains('active')) renderNotifications();

  showToast(
    `Substitutions confirmed. ${result.notifications?.length || 0} notification(s) sent.`,
    'success'
  );
}

function cancelSubstitutionFlow() {
  pendingAbsenceFacultyId = null;
  window._substitutionModalState = null;
  closeModal();
  showToast('Substitution cancelled. Faculty status unchanged.', 'info');
}

function undoLastSubstitutionAction() {
  const result = undoLastSubstitution();
  if (!result.success) {
    showToast(result.message, 'warn');
    return;
  }

  renderFaculty();
  renderNotifBadge();
  if (document.getElementById('page-dashboard')?.classList.contains('active')) renderDashboard();
  if (document.getElementById('page-timetable')?.classList.contains('active')) renderTimetable();
  if (document.getElementById('page-conflicts')?.classList.contains('active')) renderConflicts();
  showToast(result.message, 'success');
}

// ===== FACULTY LEAVE & SUBSTITUTION SECTION (inline admin panel) =====
if (!window._leaveSubUiState) {
  window._leaveSubUiState = {
    sectionOpen: true,
    historyOpen: false,
    affectedSlots: [],
    facultyId: null,
    day: null,
    dateLabel: null,
    dateIso: null,
    skippedSlotIds: []
  };
}

function getLeaveSubState() {
  if (!window._leaveSubUiState) {
    window._leaveSubUiState = {
      sectionOpen: true,
      historyOpen: false,
      affectedSlots: [],
      facultyId: null,
      day: null,
      dateLabel: null,
      dateIso: null,
      skippedSlotIds: []
    };
  }
  return window._leaveSubUiState;
}

function toggleLeaveSubstitutionSection() {
  const state = getLeaveSubState();
  state.sectionOpen = !state.sectionOpen;
  renderLeaveSubstitutionSection();
}

function toggleSubstitutionHistoryPanel() {
  const state = getLeaveSubState();
  state.historyOpen = !state.historyOpen;
  renderLeaveSubstitutionSection();
}

function onLeaveDateChoiceChange() {
  const choice = document.getElementById('leave-date-choice')?.value;
  const wrap = document.getElementById('leave-custom-date-wrap');
  if (wrap) wrap.style.display = choice === 'pick' ? 'block' : 'none';
}

function getSelectedLeavePeriods() {
  const periods = [];
  if (document.getElementById('leave-period-morning')?.checked) periods.push('morning');
  if (document.getElementById('leave-period-afternoon')?.checked) periods.push('afternoon');
  if (document.getElementById('leave-period-full')?.checked) periods.push('full');
  return periods.length ? periods : ['full'];
}

function findAffectedSlotsForLeave() {
  const facultyId = document.getElementById('leave-faculty-select')?.value;
  if (!facultyId) {
    showToast('Please select a faculty member.', 'warn');
    return;
  }

  const dateChoice = document.getElementById('leave-date-choice')?.value || 'today';
  const customDate = document.getElementById('leave-custom-date')?.value;
  const schedule = resolveLeaveScheduleDay(dateChoice, customDate);
  const periods = getSelectedLeavePeriods();

  const slots = getAffectedSlots(facultyId, schedule.day, periods);
  const state = getLeaveSubState();
  state.facultyId = facultyId;
  state.day = schedule.day;
  state.dateLabel = schedule.dateLabel;
  state.dateIso = schedule.dateIso;
  state.affectedSlots = slots;
  state.skippedSlotIds = [];

  renderAffectedSlotsTable(slots, facultyId, schedule.day);
  updateLeaveSubstitutionSummary();

  if (!slots.length) {
    showToast(`No affected slots for ${getFacultyName(facultyId)} on ${schedule.day}.`, 'info');
  }
}

function renderLeaveSubstitutionSection() {
  const root = document.getElementById('leave-substitution-root');
  if (!root) return;

  const state = getLeaveSubState();
  const facultyOptions = AppData.faculty.map((f) => {
    const dept = f.dept || f.department || '';
    return `<option value="${f.id}">${f.name} (${f.id}) — ${dept}</option>`;
  }).join('');

  const todayIso = new Date().toISOString().split('T')[0];

  root.innerHTML = `
    <div class="leave-sub-section card">
      <button type="button" class="leave-sub-header" onclick="toggleLeaveSubstitutionSection()" aria-expanded="${state.sectionOpen}">
        <div>
          <h3>Faculty Leave &amp; Substitution Management</h3>
          <p>Plan substitutes by faculty, date, and teaching period</p>
        </div>
        <span class="leave-sub-chevron">${state.sectionOpen ? '▼' : '▶'}</span>
      </button>

      <div class="leave-sub-body" style="display:${state.sectionOpen ? 'block' : 'none'}">
        <div class="card leave-sub-form-card" style="margin:0 0 16px;box-shadow:none;border:1px solid var(--border);">
          <div class="card-body">
            <h4 class="leave-sub-part-title">Mark Absence</h4>
            <div class="leave-sub-form-grid">
              <div class="form-group">
                <label>Select Faculty</label>
                <select class="form-control" id="leave-faculty-select">
                  <option value="">— Choose faculty —</option>
                  ${facultyOptions}
                </select>
              </div>
              <div class="form-group">
                <label>Select Date</label>
                <select class="form-control" id="leave-date-choice" onchange="onLeaveDateChoiceChange()">
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="pick">Pick Date</option>
                </select>
                <div id="leave-custom-date-wrap" style="display:none;margin-top:8px;">
                  <input type="date" class="form-control" id="leave-custom-date" value="${todayIso}">
                </div>
              </div>
              <div class="form-group leave-period-group">
                <label>Affected Periods</label>
                <div class="leave-period-checks">
                  <label><input type="checkbox" id="leave-period-morning" value="morning"> Morning</label>
                  <label><input type="checkbox" id="leave-period-afternoon" value="afternoon"> Afternoon</label>
                  <label><input type="checkbox" id="leave-period-full" value="full" checked> Full Day</label>
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-solid" onclick="findAffectedSlotsForLeave()">
              Find Affected Slots &amp; Suggest Substitutes
            </button>
          </div>
        </div>

        <div id="leave-affected-wrap" style="display:${state.affectedSlots.length ? 'block' : 'none'};">
          <h4 class="leave-sub-part-title">Affected Slots</h4>
          <div class="card" style="box-shadow:none;border:1px solid var(--border);">
            <div class="card-body" style="padding:0;overflow-x:auto;">
              <table class="data-table leave-affected-table">
                <thead>
                  <tr>
                    <th>Division</th><th>Day</th><th>Time</th><th>Subject</th><th>Type</th>
                    <th>Absent Faculty</th><th>Suggested Substitute</th><th>Action</th>
                  </tr>
                </thead>
                <tbody id="leave-affected-tbody"></tbody>
              </table>
            </div>
          </div>

          <div class="leave-bulk-bar">
            <span id="leave-sub-summary" class="leave-sub-summary">0 of 0 slots assigned</span>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button type="button" class="btn btn-solid" onclick="handleConfirmAll()">Confirm All</button>
              <button type="button" class="btn btn-outline" onclick="clearLeaveSubstitutionForm()">Clear</button>
            </div>
          </div>
        </div>

        <div class="leave-history-panel">
          <button type="button" class="leave-sub-header leave-history-toggle" onclick="toggleSubstitutionHistoryPanel()">
            <div>
              <h4 style="margin:0;font-size:15px;">Substitution History Log</h4>
              <p style="margin:4px 0 0;font-size:12px;color:var(--text3);">Last 10 substitutions</p>
            </div>
            <span class="leave-sub-chevron">${state.historyOpen ? '▼' : '▶'}</span>
          </button>
          <div id="leave-history-body" style="display:${state.historyOpen ? 'block' : 'none'};">
            <div class="card" style="box-shadow:none;border:1px solid var(--border);margin-top:8px;">
              <div class="card-body" style="padding:0;overflow-x:auto;">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Date</th><th>Division</th><th>Time</th><th>Subject</th>
                      <th>Original Faculty</th><th>Substitute</th><th>Status</th><th></th>
                    </tr>
                  </thead>
                  <tbody id="leave-history-tbody">
                    ${renderSubstitutionHistoryRows()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  if (state.facultyId) {
    const sel = document.getElementById('leave-faculty-select');
    if (sel) sel.value = state.facultyId;
  }
  if (state.affectedSlots.length) {
    renderAffectedSlotsTable(state.affectedSlots, state.facultyId, state.day);
    updateLeaveSubstitutionSummary();
  }
}

function renderSubstitutionHistoryRows() {
  const log = getSubstitutionHistoryLog(10);
  if (!log.length) {
    return `<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:20px;">No substitutions recorded yet.</td></tr>`;
  }

  return log.map((entry) => {
    const statusClass = entry.status === 'Active' ? 'badge-active' : 'badge-inactive';
    const undoBtn = entry.status === 'Active'
      ? `<button type="button" class="btn btn-outline" style="font-size:11px;padding:4px 10px" onclick="handleUndoSubstitution('${entry.id}')">Undo</button>`
      : '—';
    return `<tr>
      <td>${entry.dateLabel || entry.day || '—'}</td>
      <td>${entry.division || '—'}</td>
      <td>${entry.timeLabel || entry.timeSlot}</td>
      <td>${entry.subject || '—'}</td>
      <td>${entry.originalFacultyName || '—'}</td>
      <td>${entry.substituteFacultyName || '—'}</td>
      <td><span class="badge ${statusClass}">${entry.status || 'Active'}</span></td>
      <td>${undoBtn}</td>
    </tr>`;
  }).join('');
}

function renderAffectedSlotsTable(slots, facultyId, day) {
  const tbody = document.getElementById('leave-affected-tbody');
  const wrap = document.getElementById('leave-affected-wrap');
  if (!tbody) return;

  const state = getLeaveSubState();
  const absentName = getFacultyName(facultyId);

  if (wrap) wrap.style.display = slots.length ? 'block' : 'none';

  tbody.innerHTML = slots.map((slot) => {
    if (state.skippedSlotIds.includes(slot.slotId)) {
      return `<tr class="leave-row-skipped">
        <td>${slot.division}</td><td>${slot.day}</td><td>${slot.timeLabel}</td><td>${slot.subject}</td>
        <td>${renderSlotTypeBadge(slot.type)}</td><td>${absentName}</td>
        <td colspan="2"><span class="badge badge-ability">Skipped</span></td>
      </tr>`;
    }

    const substitutes = slot.suggestedSubstitutes || [];
    const suggested = slot.suggestedSubstitute;
    const optionsHtml = substitutes.map((f) => {
      const dept = f.dept || f.department || '';
      const selected = suggested && f.id === suggested.id ? 'selected' : '';
      return `<option value="${f.id}" ${selected}>${f.name} (${dept})</option>`;
    }).join('');

    const subCell = substitutes.length
      ? `<select class="form-control leave-sub-select" id="leave-sub-${slot.slotId.replace(/[^a-zA-Z0-9]/g, '_')}" data-slot-id="${slot.slotId}" onchange="updateLeaveSubstitutionSummary()">
          <option value="">— Select substitute —</option>
          ${optionsHtml}
        </select>`
      : `<span class="badge badge-inactive">No substitute — assign manually</span>
         <input type="text" class="form-control" style="margin-top:6px;font-size:12px" placeholder="Manual substitute name"
           id="leave-manual-${slot.slotId.replace(/[^a-zA-Z0-9]/g, '_')}" data-slot-id="${slot.slotId}">`;

    return `<tr data-slot-id="${slot.slotId}">
      <td><strong>${slot.division}</strong></td>
      <td>${day}</td>
      <td>${slot.timeLabel}</td>
      <td>${slot.subject}</td>
      <td>${renderSlotTypeBadge(slot.type)}</td>
      <td>${absentName}</td>
      <td>${subCell}</td>
      <td>
        <div class="action-btns" style="flex-direction:column;align-items:stretch;">
          <button type="button" class="btn btn-solid" style="font-size:11px;padding:6px 10px" onclick="handleConfirmSubstitutionRow('${slot.slotId}')">Confirm</button>
          <button type="button" class="btn btn-outline" style="font-size:11px;padding:6px 10px" onclick="handleSkipSubstitutionRow('${slot.slotId}')">Skip</button>
        </div>
      </td>
    </tr>`;
  }).join('') || `<tr><td colspan="8" style="text-align:center;padding:16px;color:var(--text3)">No slots to display.</td></tr>`;

  slots.forEach((slot) => {
    const sel = document.getElementById(`leave-sub-${slot.slotId.replace(/[^a-zA-Z0-9]/g, '_')}`);
    if (sel && slot.suggestedSubstitute) sel.value = slot.suggestedSubstitute.id;
  });
}

function renderSlotTypeBadge(type) {
  if (type === 'lab') {
    return '<span class="badge badge-skill leave-type-lab">Lab</span>';
  }
  return '<span class="badge badge-major leave-type-lecture">Lecture</span>';
}

function getLeaveRowSubstitute(slotId) {
  const safe = slotId.replace(/[^a-zA-Z0-9]/g, '_');
  const select = document.getElementById(`leave-sub-${safe}`);
  const manual = document.getElementById(`leave-manual-${safe}`);
  if (select && select.value) {
    return { facultyId: select.value, manualName: null };
  }
  if (manual && manual.value.trim()) {
    return { facultyId: null, manualName: manual.value.trim() };
  }
  return null;
}

function updateLeaveSubstitutionSummary() {
  const state = getLeaveSubState();
  const el = document.getElementById('leave-sub-summary');
  if (!el) return;

  const total = state.affectedSlots.filter((s) => !state.skippedSlotIds.includes(s.slotId)).length;
  let assigned = 0;
  state.affectedSlots.forEach((slot) => {
    if (state.skippedSlotIds.includes(slot.slotId)) return;
    const pick = getLeaveRowSubstitute(slot.slotId);
    if (pick && (pick.facultyId || pick.manualName)) assigned++;
  });
  el.textContent = `${assigned} of ${total} slots assigned`;
}

function handleConfirmSubstitutionRow(slotId) {
  const state = getLeaveSubState();
  const slot = state.affectedSlots.find((s) => s.slotId === slotId);
  if (!slot) return;

  const pick = getLeaveRowSubstitute(slotId);
  if (!pick || !pick.facultyId) {
    showToast('Select a substitute from the dropdown before confirming.', 'warn');
    return;
  }

  const result = confirmSubstitution(
    slotId,
    pick.facultyId,
    slot.facultyId || state.facultyId,
    {
      dateLabel: state.dateLabel,
      dateIso: state.dateIso,
      day: state.day,
      subject: slot.subject,
      markAbsentOnLeave: false
    }
  );

  if (!result.success) {
    showToast(result.message || 'Could not confirm substitution.', 'warn');
    return;
  }

  state.affectedSlots = state.affectedSlots.filter((s) => s.slotId !== slotId);
  renderAffectedSlotsTable(state.affectedSlots, state.facultyId, state.day);
  updateLeaveSubstitutionSummary();
  refreshLeaveHistoryTable();
  renderNotifBadge();
  showToast('Substitution confirmed for this slot.', 'success');
}

function handleSkipSubstitutionRow(slotId) {
  const state = getLeaveSubState();
  if (!state.skippedSlotIds.includes(slotId)) {
    state.skippedSlotIds.push(slotId);
  }
  renderAffectedSlotsTable(state.affectedSlots, state.facultyId, state.day);
  updateLeaveSubstitutionSummary();
}

function handleConfirmAll() {
  const state = getLeaveSubState();
  if (!state.affectedSlots.length) {
    showToast('Find affected slots first.', 'warn');
    return;
  }

  const assignments = [];
  state.affectedSlots.forEach((slot) => {
    if (state.skippedSlotIds.includes(slot.slotId)) return;
    const pick = getLeaveRowSubstitute(slot.slotId);
    if (!pick || !pick.facultyId) return;
    assignments.push({
      branch: slot.branch,
      semester: slot.semester,
      day: slot.day,
      timeSlot: slot.timeSlot,
      substituteFacultyId: pick.facultyId,
      substituteFacultyName: getFacultyName(pick.facultyId),
      dateLabel: state.dateLabel,
      dateIso: state.dateIso
    });
  });

  if (!assignments.length) {
    showToast('No rows with a selected substitute to confirm.', 'warn');
    return;
  }

  const result = confirmSubstitutions(assignments, state.facultyId);
  state.affectedSlots = state.affectedSlots.filter((slot) => {
    if (state.skippedSlotIds.includes(slot.slotId)) return true;
    return !assignments.some(
      (a) =>
        a.branch === slot.branch &&
        a.semester === slot.semester &&
        a.day === slot.day &&
        String(a.timeSlot) === String(slot.timeSlot)
    );
  });

  renderAffectedSlotsTable(state.affectedSlots, state.facultyId, state.day);
  updateLeaveSubstitutionSummary();
  refreshLeaveHistoryTable();
  renderFacultyRowsRefresh();
  renderNotifBadge();
  showToast(`Confirmed ${assignments.length} substitution(s).`, 'success');
}

function renderFacultyRowsRefresh() {
  const tbody = document.getElementById('faculty-tbody');
  if (tbody) tbody.innerHTML = renderFacultyRows(AppData.faculty);
}

function clearLeaveSubstitutionForm() {
  window._leaveSubUiState = {
    sectionOpen: true,
    historyOpen: getLeaveSubState().historyOpen,
    affectedSlots: [],
    facultyId: null,
    day: null,
    dateLabel: null,
    dateIso: null,
    skippedSlotIds: []
  };
  renderLeaveSubstitutionSection();
  showToast('Leave substitution form cleared.', 'info');
}

function refreshLeaveHistoryTable() {
  const tbody = document.getElementById('leave-history-tbody');
  if (tbody) tbody.innerHTML = renderSubstitutionHistoryRows();
}

function handleUndoSubstitution(historyEntryId) {
  const result = undoSubstitution(historyEntryId);
  if (!result.success) {
    showToast(result.message, 'warn');
    return;
  }
  refreshLeaveHistoryTable();
  renderFacultyRowsRefresh();
  if (document.getElementById('page-timetable')?.classList.contains('active')) renderTimetable();
  renderNotifBadge();
  showToast(result.message, 'success');
}

function deleteFaculty(id) {
  if (!confirm('Delete this faculty record?')) return;
  AppData.faculty = AppData.faculty.filter(f => f.id !== id);
  saveData();
  renderFaculty();
  showToast('Faculty removed.', 'info');
}

function showAddFaculty() {
  openModal('Add Faculty', `
    <div style="display:flex;flex-direction:column;gap:12px;">
      <div class="form-group"><label>Full Name</label><input class="form-control" id="new-fac-name" placeholder="Dr. / Prof. Name"></div>
      <div class="form-group"><label>Email</label><input class="form-control" id="new-fac-email" placeholder="email@institution.edu"></div>
      <div class="form-group"><label>Department</label>
        <select class="form-control" id="new-fac-dept">
          <option>CS</option><option>Math</option><option>AI</option><option>Elective</option><option>Physics</option>
        </select>
      </div>
      <div class="form-group"><label>Max Sessions/Week</label><input class="form-control" id="new-fac-max" type="number" value="18" min="8" max="30"></div>
      <div style="display:flex;gap:8px;margin-top:4px;">
        <button class="btn btn-solid" style="flex:1" onclick="confirmAddFaculty()">Add Faculty</button>
        <button class="btn btn-outline" style="flex:1" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function confirmAddFaculty() {
  const name = document.getElementById('new-fac-name').value.trim();
  const email = document.getElementById('new-fac-email')?.value.trim() || '';
  const dept = document.getElementById('new-fac-dept').value;
  const max = parseInt(document.getElementById('new-fac-max').value) || 18;
  if (!name) { showToast('Please enter faculty name.', 'warn'); return; }
  const newId = 'F' + String(AppData.faculty.length + 1).padStart(3, '0');
  AppData.faculty.push({
    id: newId,
    name,
    subjects: [],
    maxSessions: max,
    available: true,
    onLeave: false,
    dept,
    department: dept,
    email,
    canTakeLab: dept === 'CS' || dept === 'AI'
  });
  saveData();
  closeModal();
  renderFaculty();
  showToast(`${name} added successfully!`, 'success');
}

// ===== SUBJECTS =====
function renderSubjects() {
  const el = document.getElementById('page-subjects');
  el.innerHTML = `
    <div class="page-title">
      <h2>Subject Management</h2>
      <p>NEP 2020 course structure: Major, Minor, Skill, Value, Ability, Elective</p>
    </div>
    <div class="tt-controls">
      ${currentUser.role === 'admin' ? `<button class="btn btn-solid" onclick="showAddSubject()">${icons.plus} Add Subject</button>` : ''}
    </div>
    <div class="card">
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr>
            <th>Code</th><th>Subject Name</th><th>Type</th><th>Credits</th>
            <th>Sessions/Wk</th><th>Faculty</th><th>Practical</th>
            ${currentUser.role === 'admin' ? '<th>Actions</th>' : ''}
          </tr></thead>
          <tbody>
            ${AppData.subjects.map(s => {
              const fac = AppData.faculty.find(f => f.id === s.faculty);
              const lab = s.lab ? AppData.labs.find(l => l.id === s.lab) : null;
              return `<tr>
                <td><code style="background:var(--surface2);padding:2px 7px;border-radius:4px;font-size:12px">${s.code}</code></td>
                <td><div style="font-weight:600">${s.name}</div></td>
                <td><span class="badge badge-${s.type.toLowerCase()}">${s.type}</span></td>
                <td>${s.credits}</td>
                <td>${s.sessions}</td>
                <td>${fac ? fac.name : '—'}</td>
                <td>${s.hasPractical ? `<span class="badge badge-active">${lab ? lab.name : 'Yes'}</span>` : '<span style="color:var(--text3);font-size:12px">Theory</span>'}</td>
                ${currentUser.role === 'admin' ? `<td><div class="action-btns">
                  <button class="btn-icon delete" onclick="deleteSubject('${s.id}')">${icons.trash}</button>
                </div></td>` : ''}
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function deleteSubject(id) {
  if (!confirm('Delete this subject?')) return;
  AppData.subjects = AppData.subjects.filter(s => s.id !== id);
  saveData();
  renderSubjects();
  showToast('Subject removed.', 'info');
}

function showAddSubject() {
  const facOptions = AppData.faculty.map(f => `<option value="${f.id}">${f.name}</option>`).join('');
  openModal('Add Subject', `
    <div style="display:flex;flex-direction:column;gap:12px;">
      <div class="form-group"><label>Subject Code</label><input class="form-control" id="new-sub-code" placeholder="21CS307"></div>
      <div class="form-group"><label>Subject Name</label><input class="form-control" id="new-sub-name" placeholder="Subject Name"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div class="form-group"><label>Type</label>
          <select class="form-control" id="new-sub-type">
            <option>Major</option><option>Minor</option><option>Skill</option>
            <option>Elective</option><option>Value</option><option>Ability</option>
          </select>
        </div>
        <div class="form-group"><label>Credits</label><input class="form-control" id="new-sub-credits" type="number" value="3" min="1" max="6"></div>
      </div>
      <div class="form-group"><label>Sessions/Week</label><input class="form-control" id="new-sub-sessions" type="number" value="3" min="1" max="7"></div>
      <div class="form-group"><label>Faculty</label><select class="form-control" id="new-sub-fac">${facOptions}</select></div>
      <div style="display:flex;gap:8px;margin-top:4px;">
        <button class="btn btn-solid" style="flex:1" onclick="confirmAddSubject()">Add Subject</button>
        <button class="btn btn-outline" style="flex:1" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function confirmAddSubject() {
  const code = document.getElementById('new-sub-code').value.trim();
  const name = document.getElementById('new-sub-name').value.trim();
  const type = document.getElementById('new-sub-type').value;
  const credits = parseInt(document.getElementById('new-sub-credits').value) || 3;
  const sessions = parseInt(document.getElementById('new-sub-sessions').value) || 3;
  const faculty = document.getElementById('new-sub-fac').value;
  if (!code || !name) { showToast('Please fill all fields.', 'warn'); return; }
  const newId = 'S' + String(AppData.subjects.length + 1).padStart(3, '0');
  AppData.subjects.push({ id: newId, code, name, type, sessions, faculty, hasPractical: false, lab: null, credits });
  saveData();
  closeModal();
  renderSubjects();
  showToast(`${name} added!`, 'success');
}

// ===== LABS =====
function renderLabs() {
  const el = document.getElementById('page-labs');
  el.innerHTML = `
    <div class="page-title">
      <h2>Lab Management</h2>
      <p>Laboratory assignments and availability tracking</p>
    </div>
    <div class="tt-controls">
      ${currentUser.role === 'admin' ? `<button class="btn btn-solid" onclick="showAddLab()">${icons.plus} Add Lab</button>` : ''}
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
      ${AppData.labs.map(lab => {
        const mappedSubjects = (lab.subjects || []).map(sid => {
          const s = getSubject(sid);
          return s ? s.name : '';
        }).filter(Boolean);
        return `<div class="card">
          <div class="card-body">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
              <div class="stat-icon ${lab.available ? 'blue' : 'red'}" style="width:46px;height:46px">${icons.flask}</div>
              <div>
                <div style="font-size:15px;font-weight:700;color:var(--text)">${lab.name}</div>
                <div style="font-size:12px;color:var(--text3)">Capacity: ${lab.capacity} students</div>
              </div>
            </div>
            <div style="margin-bottom:12px;">
              <div style="font-size:11px;font-weight:600;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Mapped Subjects</div>
              ${mappedSubjects.length
                ? mappedSubjects.map(name => `<div style="font-size:13px;color:var(--text);padding:4px 0;border-bottom:1px solid var(--border)">• ${name}</div>`).join('')
                : '<div style="font-size:13px;color:var(--text3);padding:4px 0;">No subjects mapped yet.</div>'
              }
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between">
              <span class="badge ${lab.available ? 'badge-active' : 'badge-inactive'}">${lab.available ? 'Available' : 'Closed'}</span>
              ${currentUser.role === 'admin' ? `<button class="btn btn-outline" style="font-size:12px;padding:5px 10px" onclick="toggleLab('${lab.id}')">Toggle Status</button>` : ''}
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>
  `;
}

function toggleLab(id) {
  const lab = AppData.labs.find(l => l.id === id);
  if (lab) {
    lab.available = !lab.available;
    saveData();
    renderLabs();
    showToast(`${lab.name} is now ${lab.available ? 'available' : 'closed'}.`, 'info');
  }
}

function showAddLab() {
  const subjectOptions = AppData.subjects
    .map(subject => `<option value="${subject.id}">${subject.code} - ${subject.name}</option>`)
    .join('');

  openModal('Add Lab', `
    <div style="display:flex;flex-direction:column;gap:12px;">
      <div class="form-group"><label>Lab Name</label><input class="form-control" id="new-lab-name" placeholder="AI Lab"></div>
      <div class="form-group"><label>Capacity</label><input class="form-control" id="new-lab-capacity" type="number" value="30" min="1" max="200"></div>
      <div class="form-group"><label>Mapped Subjects</label>
        <select class="form-control" id="new-lab-subjects" multiple size="5" style="min-height:140px">
          ${subjectOptions}
        </select>
        <div style="font-size:12px;color:var(--text3);margin-top:6px;">Hold Ctrl or Cmd to select multiple subjects.</div>
      </div>
      <div class="form-group" style="margin-bottom:4px;">
        <label style="display:flex;align-items:center;gap:8px;font-weight:500;color:var(--text2);margin:0;">
          <input type="checkbox" id="new-lab-available" checked style="width:16px;height:16px;accent-color:var(--primary);">
          Mark as available
        </label>
      </div>
      <div style="display:flex;gap:8px;margin-top:4px;">
        <button class="btn btn-solid" style="flex:1" onclick="confirmAddLab()">Add Lab</button>
        <button class="btn btn-outline" style="flex:1" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function confirmAddLab() {
  const name = document.getElementById('new-lab-name').value.trim();
  const capacity = parseInt(document.getElementById('new-lab-capacity').value) || 30;
  const available = document.getElementById('new-lab-available').checked;
  const selectedSubjects = Array.from(document.getElementById('new-lab-subjects').selectedOptions).map(option => option.value);

  if (!name) {
    showToast('Please enter a lab name.', 'warn');
    return;
  }

  const existingIds = AppData.labs.map(lab => Number(String(lab.id).replace(/^L/, ''))).filter(Number.isFinite);
  const nextNum = (existingIds.length ? Math.max(...existingIds) : 0) + 1;
  const newId = 'L' + String(nextNum).padStart(3, '0');
  const labSubjects = selectedSubjects.filter(Boolean);

  AppData.labs.push({
    id: newId,
    name,
    capacity,
    subjects: labSubjects,
    available
  });

  saveData();
  closeModal();
  renderLabs();
  showToast(`${name} added successfully!`, 'success');
}

// ===== CONFLICTS =====
function renderConflicts() {
  const el = document.getElementById('page-conflicts');
  const conflicts = detectConflicts();

  el.innerHTML = `
    <div class="page-title">
      <h2>Conflict Detector</h2>
      <p>Real-time schedule conflict analysis using constraint satisfaction</p>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat-card">
        <div class="stat-header"><div class="stat-icon ${conflicts.length > 0 ? 'red' : 'green'}">${conflicts.length > 0 ? icons.alert : icons.check}</div></div>
        <div class="stat-value">${conflicts.length}</div>
        <div class="stat-label">Conflicts Found</div>
      </div>
      <div class="stat-card">
        <div class="stat-header"><div class="stat-icon blue">${icons.check}</div></div>
        <div class="stat-value">${AppData.faculty.filter(f => f.available).length}</div>
        <div class="stat-label">Available Faculty</div>
      </div>
      <div class="stat-card">
        <div class="stat-header"><div class="stat-icon green">${icons.flask}</div></div>
        <div class="stat-value">${AppData.labs.filter(l => l.available).length}</div>
        <div class="stat-label">Available Labs</div>
      </div>
    </div>

    <div class="card mt-24">
      <div class="card-header">
        <div><h3>Conflict Analysis Report</h3><p>Automated detection results</p></div>
        <button class="btn btn-solid" onclick="renderConflicts()">${icons.refresh} Refresh</button>
      </div>
      <div class="card-body">
        ${conflicts.length === 0
          ? `<div style="text-align:center;padding:32px 0;color:var(--text2)">
              <div style="font-size:36px;margin-bottom:8px">✅</div>
              <div style="font-size:15px;font-weight:600;color:var(--accent)">No conflicts detected!</div>
              <div style="font-size:13px;margin-top:4px">Timetable is clean and optimized.</div>
            </div>`
          : `<div class="notif-list">
              ${conflicts.map(c => `
                <div class="conflict-alert">
                  ${icons.alert}
                  <span><strong>${c.type}</strong> — ${c.day}, ${c.session}: ${c.detail}</span>
                </div>`).join('')}
            </div>`}

        <div style="margin-top:20px;">
          <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:12px">Faculty Leave Status</div>
          ${AppData.faculty.filter(f => !f.available).map(f => `
            <div class="notif-item warning" style="margin-bottom:8px">
              <div class="notif-dot"></div>
              <span class="notif-msg">${f.name} is on leave — sessions may need rescheduling</span>
              <button class="btn btn-outline" style="font-size:11px;padding:4px 10px" onclick="markPresent('${f.id}')">Mark Present</button>
            </div>`).join('') || '<div style="color:var(--text3);font-size:13px">All faculty are present.</div>'}
        </div>
      </div>
    </div>
  `;
}

function markPresent(id) {
  const f = AppData.faculty.find(f => f.id === id);
  if (f) {
    f.available = true;
    f.onLeave = false;
    saveData();
    renderConflicts();
    renderFaculty();
    showToast(`${f.name} marked present.`, 'success');
  }
}

// ===== NOTIFICATIONS =====
function renderNotifications() {
  const el = document.getElementById('page-notifications');
  el.innerHTML = `
    <div class="page-title"><h2>Notifications</h2><p>Latest system alerts and academic updates</p></div>
    <div class="card">
      <div class="card-header">
        <div><h3>All Notifications</h3><p>${AppData.notifications.length} updates</p></div>
        ${currentUser.role === 'admin' ? `<button class="btn btn-solid" onclick="addSampleNotif()">${icons.plus} Add Notification</button>` : ''}
      </div>
      <div class="card-body">
        <div class="notif-list">
          ${AppData.notifications.map(n => `
            <div class="notif-item ${n.type}">
              <div class="notif-dot"></div>
              <span class="notif-msg">${n.message}</span>
              <span class="notif-time">${n.time}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function addSampleNotif() {
  const msgs = [
    'Seminar scheduled for all CS students tomorrow at 10 AM.',
    'Mid-semester exam timetable released. Check the timetable.',
    'Lab practical for FSD batch moved to Wednesday.'
  ];
  const types = ['info', 'warning', 'success'];
  AppData.notifications.unshift({
    id: 'N' + Date.now(),
    message: msgs[Math.floor(Math.random() * msgs.length)],
    type: types[Math.floor(Math.random() * types.length)],
    time: 'Just now'
  });
  saveData();
  renderNotifications();
  renderNotifBadge();
}

function renderNotifBadge() {
  document.getElementById('notif-badge').textContent = AppData.notifications.length;
}

// ===== MODAL =====
function openModal(title, bodyHTML) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

// ===== CHATBOT =====
const chatResponses = {
  'who teaches fsd': () => {
    const s = AppData.subjects.find(s => s.name.toLowerCase().includes('full stack'));
    if (s) {
      const f = AppData.faculty.find(f => f.id === s.faculty);
      return `Full Stack Development (${s.code}) is taught by ${f ? f.name : 'N/A'}.`;
    }
    return 'Subject not found.';
  },
  'college timings': () => `College hours: ${AppData.config.config?.timings?.start || '09:30 AM'} to ${AppData.config.config?.timings?.end || '05:00 PM'}. There are 7 teaching sessions daily.`,
  'how many sessions': () => `There are 7 teaching sessions per day, from ${AppData.config.sessions.find(s=>s.type==='teaching')?.time} to the last session.`,
  'faculty on leave': () => {
    const absent = AppData.faculty.filter(f => !f.available);
    if (absent.length === 0) return 'All faculty are present today! ✅';
    return `Faculty on leave today: ${absent.map(f => f.name).join(', ')}`;
  },
  'available labs': () => {
    const avail = AppData.labs.filter(l => l.available);
    return `Available labs: ${avail.map(l => l.name).join(', ')}.`;
  },
  'subjects': () => `Total ${AppData.subjects.length} subjects under NEP 2020: ${AppData.subjects.slice(0,4).map(s=>s.name).join(', ')} and more.`,
  'free slots': () => `Use the Timetable page to view empty slots. Empty cells are free periods that can be assigned.`,
  'hello': () => 'Hello! I am your Smart Timetable Assistant. Ask me about faculty, subjects, labs, timings, or schedules! 😊',
  'hi': () => 'Hi there! How can I assist you with the timetable today?',
  'nep 2020': () => 'NEP 2020 introduces Major, Minor, Skill Enhancement, Value-Added, and Ability Enhancement courses with flexible credits. This system fully supports all these categories.',
};

function initChatbot() {
  document.getElementById('chatbot-btn').addEventListener('click', () => {
    document.getElementById('chatbot-panel').classList.toggle('open');
  });
  document.getElementById('chat-close-btn').addEventListener('click', () => {
    document.getElementById('chatbot-panel').classList.remove('open');
  });
  document.getElementById('chat-send-btn').addEventListener('click', sendChat);
  document.getElementById('chat-input-field').addEventListener('keypress', e => {
    if (e.key === 'Enter') sendChat();
  });
}

function sendChat(text) {
  const input = document.getElementById('chat-input-field');
  const msg = (text || input.value).trim();
  if (!msg) return;
  input.value = '';

  appendChatMsg(msg, 'user');

  // Find response
  const lower = msg.toLowerCase();
  let response = "I'm not sure about that. Try asking about faculty, subjects, labs, or timings!";
  for (const [key, fn] of Object.entries(chatResponses)) {
    if (lower.includes(key)) {
      response = fn();
      break;
    }
  }

  setTimeout(() => appendChatMsg(response, 'bot'), 400);
}

function appendChatMsg(text, type) {
  const messages = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `chat-msg ${type}`;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// ===== TOAST =====
function showToast(msg, type = 'info') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `position:fixed;bottom:90px;left:50%;transform:translateX(-50%);
      padding:10px 20px;border-radius:20px;font-size:13px;font-weight:600;z-index:500;
      box-shadow:0 8px 24px rgba(0,0,0,0.15);transition:all 0.3s;`;
    document.body.appendChild(toast);
  }
  const colors = { success: '#5BA08A', info: '#4A7FBF', warn: '#E8934A', danger: '#D95F5F' };
  toast.style.background = colors[type] || colors.info;
  toast.style.color = 'white';
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  const saved = loadStoredCurrentUser();
  if (saved) {
    currentUser = saved;
    launchApp();
  }
  initAuth();
  initChatbot();

  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      if (window._substitutionModalState) {
        cancelSubstitutionFlow();
      } else {
        closeModal();
      }
    }
  });
});
