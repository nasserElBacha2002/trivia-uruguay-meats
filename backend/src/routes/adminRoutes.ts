import { Router } from "express";
import type { SqliteDatabase } from "../types/db.js";

export function createAdminRouter(db: SqliteDatabase) {
  const router = Router();

  router.get("/admin/submissions", (_req, res) => {
    try {
      const rows = db
        .prepare(
          `
        SELECT
          p.id AS participant_id,
          p.name,
          p.email,
          p.country,
          p.sector_id,
          p.buys_uruguay_meat,
          p.language,
          p.created_at AS participant_created_at,
          s.id AS session_id,
          s.started_at,
          s.completed_at,
          s.score,
          s.total_questions,
          s.score_band,
          s.status,
          s.quiz_version,
          (SELECT COUNT(*) FROM quiz_answers a WHERE a.session_id = s.id) AS answer_count
        FROM quiz_sessions s
        JOIN participants p ON p.id = s.participant_id
        ORDER BY s.id DESC
        LIMIT 200
      `,
        )
        .all();

      res.json({ submissions: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to list submissions" });
    }
  });

  router.get("/admin/submissions/:sessionId", (req, res) => {
    try {
      const sessionId = Number(req.params.sessionId);
      if (!Number.isInteger(sessionId) || sessionId < 1) {
        res.status(400).json({ error: "Invalid sessionId" });
        return;
      }

      const session = db
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

      if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
      }

      const participant = db
        .prepare(
          `SELECT id, name, email, country, sector_id, buys_uruguay_meat, language, created_at
           FROM participants WHERE id = ?`,
        )
        .get(session.participant_id) as Record<string, unknown> | undefined;

      if (!participant) {
        res.status(404).json({ error: "Participant not found for session" });
        return;
      }

      const answers = db
        .prepare(
          `SELECT id, question_id, selected_option_id, is_correct, answered_at
           FROM quiz_answers WHERE session_id = ?
           ORDER BY id ASC`,
        )
        .all(sessionId);

      res.json({
        session,
        participant,
        answers,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to load submission detail" });
    }
  });

  return router;
}
