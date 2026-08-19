import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import type { SqliteDatabase } from "../types/db.js";
import { initSchema } from "./schema.js";

export function openDatabase(dbPath: string): SqliteDatabase {
  const resolved = path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), dbPath);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  const db = new Database(resolved);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  initSchema(db);
  return db;
}

/** Default DB file when `SQLITE_DB_PATH` is unset (run server with cwd = `backend/`). */
export function resolveDefaultDbPath(): string {
  return path.resolve(process.cwd(), "data", "trivia.db");
}

export function closeDatabase(db: SqliteDatabase): void {
  if (!db.open) return;
  try {
    db.pragma("wal_checkpoint(TRUNCATE)");
  } catch (err) {
    console.error("[sqlite] wal_checkpoint failed:", err);
  }
  if (!db.open) return;
  db.close();
}
