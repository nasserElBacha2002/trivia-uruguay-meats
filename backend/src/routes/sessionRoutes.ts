import { Router } from "express";
import { countAnswersForSession, countCorrectAnswers, insertAnswer } from "../repositories/answerRepository.js";
import { completeSession, getSessionById } from "../repositories/sessionRepository.js";
import type { CompleteSessionBody, SubmitAnswerBody } from "../types/api.js";
import type { SqliteDatabase } from "../types/db.js";

function isScoreBand(x: unknown): x is CompleteSessionBody["scoreBand"] {
  return x === "high" || x === "medium" || x === "low";
}

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
      const { score, totalQuestions, scoreBand } = body;

      if (typeof score !== "number" || !Number.isInteger(score) || score < 0) {
        res.status(400).json({ error: "score must be an integer >= 0" });
        return;
      }
      if (typeof totalQuestions !== "number" || !Number.isInteger(totalQuestions) || totalQuestions < 1) {
        res.status(400).json({ error: "totalQuestions must be an integer > 0" });
        return;
      }
      if (!isScoreBand(scoreBand)) {
        res.status(400).json({ error: "scoreBand must be high, medium, or low" });
        return;
      }
      if (score > totalQuestions) {
        res.status(400).json({ error: "score cannot exceed totalQuestions" });
        return;
      }

      const dbCorrect = countCorrectAnswers(db, sessionId);
      if (score !== dbCorrect) {
        res.status(422).json({
          error: "score does not match recorded correct answers in database",
          expectedScore: dbCorrect,
          receivedScore: score,
        });
        return;
      }

      const answerRows = countAnswersForSession(db, sessionId);
      if (answerRows !== totalQuestions) {
        res.status(422).json({
          error: "totalQuestions does not match number of saved answers for this session",
          expectedAnswerCount: answerRows,
          receivedTotalQuestions: totalQuestions,
        });
        return;
      }

      const payload: CompleteSessionBody = {
        score,
        totalQuestions,
        scoreBand,
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
