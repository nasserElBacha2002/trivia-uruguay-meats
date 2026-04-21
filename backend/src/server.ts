import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { openDatabase, resolveDefaultDbPath } from "./db/sqlite.js";
import { createAdminRouter } from "./routes/adminRoutes.js";
import { healthRouter } from "./routes/healthRoutes.js";
import { createParticipantRouter } from "./routes/participantRoutes.js";
import { createSessionRouter } from "./routes/sessionRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, "../.env") });

const PORT = Number(process.env.PORT) || 3001;
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";
const dbPath = process.env.SQLITE_DB_PATH
  ? path.isAbsolute(process.env.SQLITE_DB_PATH)
    ? process.env.SQLITE_DB_PATH
    : path.resolve(process.cwd(), process.env.SQLITE_DB_PATH)
  : resolveDefaultDbPath();

const db = openDatabase(dbPath);
const app = express();

app.use(
  cors({
    origin: frontendOrigin,
    credentials: false,
  }),
);
app.use(express.json({ limit: "256kb" }));

app.use("/api", healthRouter);
app.use("/api", createParticipantRouter(db));
app.use("/api", createSessionRouter(db));
app.use("/api", createAdminRouter(db));

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  },
);

const server = app.listen(PORT, () => {
  console.log(`Trivia API listening on http://localhost:${PORT}`);
  console.log(`SQLite database: ${dbPath}`);
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `[trivia-api] Port ${PORT} is already in use. Stop the other process (e.g. another \`npm run dev:api\`) or set a different PORT in backend/.env.\n` +
        `  macOS: lsof -i :${PORT}   then   kill <PID>`,
    );
  } else {
    console.error("[trivia-api] Server error:", err);
  }
  process.exit(1);
});
