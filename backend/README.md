# Trivia API (Express + SQLite)

MVP REST API for kiosk submissions: participants, quiz sessions, answers, completion.

## Run locally

From the **repository root** (recommended):

```bash
npm run setup:local
npm run dev:all
```

This starts Vite + this API together. Ensure `backend/.env` exists (`cp backend/.env.example backend/.env`).

Or from this directory (`backend/`):

```bash
cp .env.example .env
npm install
npm run dev
```

- API: `http://localhost:3001`
- Health: `GET http://localhost:3001/api/health`
- SQLite file (default): **`backend/data/trivia.db`** (created automatically)

Override DB path with `SQLITE_DB_PATH` in `.env` (absolute or relative to **current working directory**, usually `backend/`).

### Port already in use (`EADDRINUSE`)

Another process is bound to `PORT` (default `3001`), often a previous `tsx watch` / `npm run dev:api` still running.

- **macOS:** `lsof -i :3001` → note the `PID` → `kill <PID>` (or `kill $(lsof -ti :3001)`).
- **Or** pick another port in `backend/.env`, e.g. `PORT=3002`, and point the frontend `VITE_API_BASE_URL` at it.

## Build / production-style

```bash
npm run build
npm run start:prod
```

Runs compiled output from `dist/` (set `SQLITE_DB_PATH` if you run from another cwd).

## Admin (no auth — MVP only)

- `GET /api/admin/submissions` — last 200 sessions joined with participant row.
- `GET /api/admin/submissions/:sessionId` — one session with participant row + all `quiz_answers` rows.

## Frontend

In the repo root, set `VITE_API_BASE_URL` (see root `.env.example`) and run `npm run dev`. CORS allows `FRONTEND_ORIGIN` from `backend/.env`.
