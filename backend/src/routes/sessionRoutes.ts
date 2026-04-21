import { Router } from "express";
import { countCorrectAnswers, insertAnswer } from "../repositories/answerRepository.js";
import { completeSession, getSessionById } from "../repositories/sessionRepository.js";
import type { CompleteSessionBody, SubmitAnswerBody } from "../types/api.js";
import type { SqliteDatabase } from "../types/db.js";

export function createSessionRouter(db: SqliteDatabase) {
  const router = Router();

  router.post("/sessions/:sessionId/answers", (req, res) => {
    try {
      const sessionId = Number(req.params.sessionId);
      if (!Number.isInteger(sessionId) || sessionId < 1) {
        res.status(400).json({ error: "Invalid sessionId" });
        return;
      }

      const session = getSessionById(db, sessionId);
      if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
      }
      if (session.status !== "in_progress") {
        res.status(409).json({ error: "Session is not accepting answers" });
        return;
      }

      const body = req.body as Partial<SubmitAnswerBody>;
      if (!body?.questionId || !body?.selectedOptionId || typeof body.isCorrect !== "boolean") {
        res.status(400).json({
          error: "Invalid body: questionId, selectedOptionId, isCorrect (boolean) required",
        });
        return;
      }

      const payload: SubmitAnswerBody = {
        questionId: String(body.questionId),
        selectedOptionId: String(body.selectedOptionId),
        isCorrect: body.isCorrect,
      };

      const outcome = insertAnswer(db, sessionId, payload);
      const currentScore = countCorrectAnswers(db, sessionId);
      res.json({ ok: true as const, currentScore, duplicate: outcome === "duplicate" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save answer" });
    }
  });

  router.post("/sessions/:sessionId/complete", (req, res) => {
    try {
      const sessionId = Number(req.params.sessionId);
      if (!Number.isInteger(sessionId) || sessionId < 1) {
        res.status(400).json({ error: "Invalid sessionId" });
        return;
      }

      const session = getSessionById(db, sessionId);
      if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
      }

      if (session.status === "completed") {
        res.json({
          ok: true as const,
          alreadyCompleted: true,
          session: {
            id: session.id,
            participantId: session.participant_id,
            score: session.score,
            totalQuestions: session.total_questions,
            scoreBand: session.score_band,
            status: session.status,
            completedAt: session.completed_at,
          },
        });
        return;
      }

      const body = req.body as Partial<CompleteSessionBody>;
      if (
        typeof body?.score !== "number" ||
        typeof body?.totalQuestions !== "number" ||
        (body.scoreBand !== "high" && body.scoreBand !== "medium" && body.scoreBand !== "low")
      ) {
        res.status(400).json({
          error: "Invalid body: score (number), totalQuestions (number), scoreBand (high|medium|low) required",
        });
        return;
      }

      const payload: CompleteSessionBody = {
        score: body.score,
        totalQuestions: body.totalQuestions,
        scoreBand: body.scoreBand,
      };

      completeSession(db, sessionId, payload);
      const updated = getSessionById(db, sessionId);
      if (!updated) {
        res.status(500).json({ error: "Session update failed" });
        return;
      }

      res.json({
        ok: true as const,
        session: {
          id: updated.id,
          participantId: updated.participant_id,
          score: updated.score,
          totalQuestions: updated.total_questions,
          scoreBand: updated.score_band,
          status: updated.status,
          completedAt: updated.completed_at,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to complete session" });
    }
  });

  return router;
}
