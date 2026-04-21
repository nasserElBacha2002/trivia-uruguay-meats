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

  return router;
}
