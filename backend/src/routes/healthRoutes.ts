import { Router } from "express";
import type { SqliteDatabase } from "../types/db.js";

export function createHealthRouter(db: SqliteDatabase): Router {
  const router = Router();

  router.get("/health", (_req, res) => {
    try {
      db.prepare("SELECT 1 AS ok").get();
      res.json({ ok: true, service: "trivia-api", database: "ok" });
    } catch (err) {
      console.error(err);
      res.status(503).json({ ok: false, service: "trivia-api", database: "error" });
    }
  });

  return router;
}
