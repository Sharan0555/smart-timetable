# Database Schema

## Multi-tenant layout

- `College`: top-level tenant boundary.
- `Department`: belongs to one college and defines academic-year support.
- `User`: platform identity with one of `SUPER_ADMIN`, `COLLEGE_ADMIN`, `FACULTY`, `STUDENT`.
- `Faculty`: college-scoped staff profile linked to a `User`.
- `Subject`: department subject with semester and academic year.
- `Classroom`: room/lab inventory per department.
- `Timetable`: scheduled lecture records keyed by college, department, academic year, semester, day, and slot.
- `Absence`: faculty absence records.
- `Notification`: history of generated alerts.

## Important indexes

- `Department(collegeId, code)` unique
- `Faculty(collegeId, employeeCode)` unique
- `Subject(collegeId, departmentId, code)` unique
- `Classroom(collegeId, departmentId, name)` unique
- `Timetable(collegeId, departmentId, academicYear, semester, day, slotIndex)` unique
- `Absence(facultyId, date)` unique

## Data flow

1. Admin creates college, departments, faculty, subjects, and classrooms.
2. Timetable generation inserts lecture entries after conflict checks.
3. Faculty absence triggers automatic reassignment.
4. Notifications and realtime events propagate to the UI.
