# Smart Timetable Management System

A multi-college, realtime timetable platform built with:

- `Next.js` frontend
- `Node.js + Express` backend
- `MongoDB` data layer
- `JWT` authentication
- `Socket.io` realtime updates
- `Redux Toolkit` state management

## What is included

- Multi-college data model with departments, classrooms, faculty, subjects, and timetables
- Weekly timetable support from Monday through Saturday
- Academic-year and semester-aware scheduling
- Faculty absence handling with automatic lecture reassignment
- Conflict detection for faculty, classroom, and subject overlaps
- Realtime notifications and change history
- Dashboard analytics for workload, utilization, and conflict reporting

## Project Structure

```text
smart-timetable/
├── backend/              Express API, MongoDB models, Socket.io, tests
├── frontend/             Next.js app, Redux Toolkit store, realtime UI
├── shared/               Shared TypeScript types
├── docs/                 Schema, API, realtime, algorithm, deployment docs
└── README.md
```

Legacy static-demo files still exist at the root from the original prototype, but the production-ready implementation is the TypeScript stack under `backend/` and `frontend/`.

## Quick Start

### Backend

```bash
cd backend
npm install
cp ../.env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp ../.env.example .env.local
npm run dev
```

## Demo Credentials

The project ships with API-ready auth flows, but you can seed your own users for local testing:

- `SUPER_ADMIN`
- `COLLEGE_ADMIN`
- `FACULTY`
- `STUDENT`

See [`docs/api.md`](docs/api.md) and [`docs/schema.md`](docs/schema.md) for the data contract.

## Deliverables

- Database schema design: [`docs/schema.md`](docs/schema.md)
- Backend APIs: [`docs/api.md`](docs/api.md)
- Realtime flow: [`docs/realtime.md`](docs/realtime.md)
- Replacement algorithm: [`docs/algorithm.md`](docs/algorithm.md)
- Deployment guide: [`docs/deployment.md`](docs/deployment.md)

## Notes

- The backend uses MongoDB and JWT, so you must set `MONGODB_URI` and `JWT_SECRET`.
- Socket clients should join the `college:{collegeId}` room after login.
- The frontend assumes the API is available at `http://localhost:5000/api` by default.
