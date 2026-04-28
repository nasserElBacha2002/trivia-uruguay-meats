import { Router } from "express";
import XLSX from "xlsx";
import { createAdminAuth } from "../auth/adminAuth.js";
import type { SqliteDatabase } from "../types/db.js";

export function createAdminRouter(db: SqliteDatabase) {
  const router = Router();
  const adminAuth = createAdminAuth();

  if (!adminAuth.isConfigured) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set for admin panel.");
  }

  router.post("/admin/login", (req, res) => {
    const body = req.body as { username?: unknown; password?: unknown };
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required." });
      return;
    }
    const result = adminAuth.login(username, password);
    if (!result.ok) {
      res.status(401).json({ error: "Invalid admin credentials." });
      return;
    }
    const token = adminAuth.createSession();
    adminAuth.setSessionCookie(res, token);
    // TODO(prod): replace plain env password check with hashed credential storage.
    res.json({ ok: true, username: adminAuth.username });
  });

  router.post("/admin/logout", (req, res) => {
    const token = adminAuth.readToken(req);
    adminAuth.logout(token);
    adminAuth.clearSessionCookie(res);
    res.json({ ok: true });
  });

  router.get("/admin/me", (req, res) => {
    const token = adminAuth.readToken(req);
    if (!adminAuth.isAuthenticated(token)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.json({ authenticated: true, username: adminAuth.username });
  });

  router.use("/admin", adminAuth.requireAdmin);

  router.get("/admin/dashboard", (_req, res) => {
    try {
      const metrics = db
        .prepare(
          `
          SELECT
            (SELECT COUNT(*) FROM participants) AS total_participants,
            (SELECT COUNT(*) FROM quiz_sessions WHERE status = 'completed') AS total_completed_sessions,
            (SELECT ROUND(AVG(score), 2) FROM quiz_sessions WHERE status = 'completed' AND score IS NOT NULL) AS average_score,
            (SELECT COUNT(*) FROM participants WHERE buys_uruguay_meat = 1) AS buyers_count
        `,
        )
        .get() as {
        total_participants: number;
        total_completed_sessions: number;
        average_score: number | null;
        buyers_count: number;
      };

      res.json({
        metrics: {
          totalParticipants: Number(metrics.total_participants ?? 0),
          totalCompletedSessions: Number(metrics.total_completed_sessions ?? 0),
          averageScore: Number(metrics.average_score ?? 0),
          buyersCount: Number(metrics.buyers_count ?? 0),
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to load dashboard metrics." });
    }
  });

  router.get("/admin/sessions", (_req, res) => {
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
            qs.id AS session_id,
            qs.started_at,
            qs.completed_at,
            qs.score,
            qs.total_questions,
            qs.score_band,
            qs.status,
            qs.quiz_version,
            (SELECT COUNT(*) FROM quiz_answers qa WHERE qa.session_id = qs.id) AS answer_count
          FROM participants p
          LEFT JOIN quiz_sessions qs ON qs.participant_id = p.id
          ORDER BY COALESCE(qs.started_at, p.created_at) DESC, p.id DESC
        `,
        )
        .all();

      res.json({ sessions: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to list sessions." });
    }
  });

  router.get("/admin/sessions/:sessionId/answers", (req, res) => {
    try {
      const sessionId = Number(req.params.sessionId);
      if (!Number.isInteger(sessionId) || sessionId < 1) {
        res.status(400).json({ error: "Invalid sessionId" });
        return;
      }

      const session = db
        .prepare(
          `SELECT id FROM quiz_sessions WHERE id = ?`,
        )
        .get(sessionId) as { id: number } | undefined;

      if (!session) {
        res.status(404).json({ error: "Session not found." });
        return;
      }

      const answers = db
        .prepare(
          `SELECT
              session_id,
              question_id,
              selected_option_id,
              is_correct,
              answered_at
            FROM quiz_answers
            WHERE session_id = ?
            ORDER BY answered_at ASC, id ASC`,
        )
        .all(sessionId);

      res.json({
        sessionId,
        answers,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to load answers." });
    }
  });

  router.get("/admin/export.xlsx", (_req, res) => {
    try {
      const participantsRows = db
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
            qs.id AS session_id,
            qs.started_at,
            qs.completed_at,
            qs.score,
            qs.total_questions,
            qs.score_band,
            qs.status,
            qs.quiz_version
          FROM participants p
          LEFT JOIN quiz_sessions qs ON qs.participant_id = p.id
          ORDER BY COALESCE(qs.started_at, p.created_at) DESC, p.id DESC
        `,
        )
        .all();

      const answersRows = db
        .prepare(
          `
          SELECT
            qs.participant_id,
            qa.session_id,
            qa.question_id,
            qa.selected_option_id,
            qa.is_correct,
            qa.answered_at
          FROM quiz_answers qa
          JOIN quiz_sessions qs ON qs.id = qa.session_id
          ORDER BY qa.answered_at DESC, qa.id DESC
        `,
        )
        .all();

      const workbook = XLSX.utils.book_new();
      const participantsSheet = XLSX.utils.json_to_sheet(participantsRows);
      const answersSheet = XLSX.utils.json_to_sheet(answersRows);
      XLSX.utils.book_append_sheet(workbook, participantsSheet, "Participantes");
      XLSX.utils.book_append_sheet(workbook, answersSheet, "Respuestas");

      const fileBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="trivia-admin-export-${timestamp}.xlsx"`,
      );
      res.send(fileBuffer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to export XLSX." });
    }
  });

  return router;
}
