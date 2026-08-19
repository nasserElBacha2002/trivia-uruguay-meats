import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./createApp.js";
import { resolveDefaultDbPath } from "./db/sqlite.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, "../.env") });

const PORT = Number(process.env.PORT) || 3011;
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";
const dbPath = process.env.SQLITE_DB_PATH
  ? path.isAbsolute(process.env.SQLITE_DB_PATH)
    ? process.env.SQLITE_DB_PATH
    : path.resolve(process.cwd(), process.env.SQLITE_DB_PATH)
  : resolveDefaultDbPath();

const runtime = createApp({
  databasePath: dbPath,
  admin: {
    username: process.env.ADMIN_USERNAME ?? "",
    password: process.env.ADMIN_PASSWORD ?? "",
    secureCookie: process.env.ADMIN_COOKIE_SECURE === "true",
  },
  corsOrigin: frontendOrigin,
});

const server = runtime.app.listen(PORT, () => {
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
