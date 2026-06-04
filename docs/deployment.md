# Deployment Guide

## Environment variables

Create `.env` from `.env.example` and set:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `FRONTEND_URL`

## Backend

```bash
cd backend
npm install
npm run build
npm run start
```

## Frontend

```bash
cd frontend
npm install
npm run build
npm run start
```

## Netlify (vanilla app — https://smartclassscheduler.netlify.app)

The static timetable app (`index.html`, `css/`, `js/`, `data/`, `public/`) deploys from the repository root:

- **Publish directory:** `.` (see `netlify.toml`)
- **Build command:** none (static site)

Deploy from the project folder:

```bash
npx netlify-cli deploy --prod --dir=.
```

Link the site once if needed:

```bash
npx netlify-cli link
```

For Google Sign-In in production, add `https://smartclassscheduler.netlify.app` under **Authorized JavaScript origins** in Google Cloud Console.

## Netlify (Next.js app — optional)

The `frontend/` Next.js app can be deployed separately with base `frontend`, build `npm run build`, publish `.next`, and `@netlify/plugin-nextjs`.

## Production notes

- Point both apps at the same MongoDB cluster.
- Set `FRONTEND_URL` to the deployed frontend origin.
- Configure reverse proxy routing for `/api` and Socket.io.
- Use HTTPS in production so JWT and Socket.io connections remain secure.
