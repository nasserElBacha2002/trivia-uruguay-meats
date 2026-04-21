import type { CompleteSessionBody } from "../types/api.js";
import type { SqliteDatabase } from "../types/db.js";

export function insertSession(
  db: SqliteDatabase,
  participantId: number,
  quizVersion: string | null,
): number {
  const stmt = db.prepare(`
    INSERT INTO quiz_sessions (participant_id, status, quiz_version)
    VALUES (?, 'in_progress', ?)
  `);
  const result = stmt.run(participantId, quizVersion);
  return Number(result.lastInsertRowid);
}

export function getSessionById(db: SqliteDatabase, sessionId: number) {
  return db
    .prepare(
      `SELECT id, participant_id, started_at, completed_at, score, total_questions, score_band, status, quiz_version
       FROM quiz_sessions WHERE id = ?`,
    )
    .get(sessionId) as
    | {
        id: number;
        participant_id: number;
        started_at: string;
        completed_at: string | null;
        score: number | null;
        total_questions: number | null;
        score_band: string | null;
        status: string;
        quiz_version: string | null;
      }
    | undefined;
}

export function completeSession(db: SqliteDatabase, sessionId: number, body: CompleteSessionBody): void {
  const stmt = db.prepare(`
    UPDATE quiz_sessions
    SET completed_at = datetime('now'),
        score = @score,
        total_questions = @total_questions,
        score_band = @score_band,
        status = 'completed'
    WHERE id = @id
  `);
  stmt.run({
    id: sessionId,
    score: body.score,
    total_questions: body.totalQuestions,
    score_band: body.scoreBand,
  });
}
