import { Router } from "express";
import { insertParticipant } from "../repositories/participantRepository.js";
import { insertSession } from "../repositories/sessionRepository.js";
import type { SqliteDatabase } from "../types/db.js";
import { validateCreateParticipantBody } from "../validation/participantBody.js";

export function createParticipantRouter(db: SqliteDatabase) {
  const router = Router();

  router.post("/participants", (req, res) => {
    try {
      const parsed = validateCreateParticipantBody(req.body);
      if (!parsed.ok) {
        res.status(400).json({ error: parsed.error });
        return;
      }

      const payload = parsed.value;

      const tx = db.transaction(() => {
        const participantId = insertParticipant(db, payload);
        const quizVersion = payload.quizVersion ?? null;
        const sessionId = insertSession(db, participantId, quizVersion);
        return { participantId, sessionId };
      });

      const { participantId, sessionId } = tx();
      res.status(201).json({ participantId, sessionId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create participant" });
    }
  });

  return router;
}
