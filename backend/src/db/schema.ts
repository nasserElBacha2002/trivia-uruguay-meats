import type { SqliteDatabase } from "../types/db.js";

export function initSchema(db: SqliteDatabase): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      country TEXT NOT NULL,
      sector_id TEXT NOT NULL,
      buys_uruguay_meat INTEGER NOT NULL DEFAULT 0,
      language TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS quiz_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participant_id INTEGER NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT,
      score INTEGER,
      total_questions INTEGER,
      score_band TEXT,
      status TEXT NOT NULL DEFAULT 'in_progress',
      quiz_version TEXT
    );

    CREATE TABLE IF NOT EXISTS quiz_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
      question_id TEXT NOT NULL,
      selected_option_id TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      answered_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(session_id, question_id)
    );

    CREATE INDEX IF NOT EXISTS idx_quiz_sessions_participant ON quiz_sessions(participant_id);
    CREATE INDEX IF NOT EXISTS idx_quiz_answers_session ON quiz_answers(session_id);
  `);
}
