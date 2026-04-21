import { Router } from "express";
import { insertParticipant } from "../repositories/participantRepository.js";
import { insertSession } from "../repositories/sessionRepository.js";
import type { CreateParticipantBody } from "../types/api.js";
import type { SqliteDatabase } from "../types/db.js";

export function createParticipantRouter(db: SqliteDatabase) {
  const router = Router();

  router.post("/participants", (req, res) => {
    try {
      const body = req.body as Partial<CreateParticipantBody>;
      if (
        !body?.name ||
        !body?.email ||
        !body?.country ||
        !body?.sectorId ||
        typeof body.buysUruguayMeat !== "boolean" ||
        (body.language !== "pt" && body.language !== "en")
      ) {
        res.status(400).json({
          error: "Invalid body: name, email, country, sectorId, buysUruguayMeat (boolean), language (pt|en) required",
        });
        return;
      }

      const payload: CreateParticipantBody = {
        name: String(body.name),
        email: String(body.email),
        country: String(body.country),
        sectorId: String(body.sectorId),
        buysUruguayMeat: body.buysUruguayMeat,
        language: body.language,
        quizVersion: body.quizVersion ? String(body.quizVersion) : undefined,
      };

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
