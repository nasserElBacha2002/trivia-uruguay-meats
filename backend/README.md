# Trivia API (Express + SQLite)

MVP REST API for kiosk submissions: participants, quiz sessions, answers, completion.

## Run locally

From this directory (`backend/`):

```bash
cp .env.example .env
npm install
npm run dev
```

- API: `http://localhost:3001`
- Health: `GET http://localhost:3001/api/health`
- SQLite file (default): **`backend/data/trivia.db`** (created automatically)

Override DB path with `SQLITE_DB_PATH` in `.env` (absolute or relative to **current working directory**, usually `backend/`).

## Build / production-style

```bash
npm run build
npm run start:prod
```

Runs compiled output from `dist/` (set `SQLITE_DB_PATH` if you run from another cwd).

## Admin (no auth — MVP only)

`GET /api/admin/submissions` — last 200 sessions joined with participant row.

## Frontend

In the repo root, set `VITE_API_BASE_URL` (see root `.env.example`) and run `npm run dev`. CORS allows `FRONTEND_ORIGIN` from `backend/.env`.
