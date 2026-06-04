# API Documentation

Base URL: `/api`

## Auth

- `POST /auth/login`
- `GET /auth/me`

## College and master data

- `GET /colleges`
- `POST /colleges`
- `GET /departments`
- `POST /departments`
- `GET /faculty`
- `POST /faculty`
- `PATCH /faculty/:id/leave`
- `GET /subjects`
- `POST /subjects`
- `GET /classrooms`
- `POST /classrooms`

## Timetable

- `GET /timetables`
- `POST /timetables/entries`
- `POST /timetables/generate`
- `PATCH /timetables/:id/status`

## Absence

- `POST /absences/mark`

## Notifications

- `GET /notifications`
- `PATCH /notifications/:id/read`

## Analytics

- `GET /analytics/dashboard`

## Real-time events

- `timetable:update`
- `absence:updated`
- `notification:new`

Clients should join the Socket.io room `college:{collegeId}` after login.
