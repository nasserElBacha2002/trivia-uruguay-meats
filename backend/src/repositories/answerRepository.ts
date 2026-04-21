import type { SubmitAnswerBody } from "../types/api.js";
import type { SqliteDatabase } from "../types/db.js";

export function insertAnswer(db: SqliteDatabase, sessionId: number, body: SubmitAnswerBody): "inserted" | "duplicate" {
  try {
    const stmt = db.prepare(`
      INSERT INTO quiz_answers (session_id, question_id, selected_option_id, is_correct)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(sessionId, body.questionId, body.selectedOptionId, body.isCorrect ? 1 : 0);
    return "inserted";
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("UNIQUE constraint failed")) {
      return "duplicate";
    }
    throw e;
  }
}

export function countCorrectAnswers(db: SqliteDatabase, sessionId: number): number {
  const row = db
    .prepare(`SELECT COUNT(*) as c FROM quiz_answers WHERE session_id = ? AND is_correct = 1`)
    .get(sessionId) as { c: number };
  return row.c;
}

export function countAnswersForSession(db: SqliteDatabase, sessionId: number): number {
  const row = db
    .prepare(`SELECT COUNT(*) as c FROM quiz_answers WHERE session_id = ?`)
    .get(sessionId) as { c: number };
  return row.c;
}
