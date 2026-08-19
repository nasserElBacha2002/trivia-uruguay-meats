import cors from "cors";
import express, { type Express } from "express";
import fs from "node:fs";
import path from "node:path";
import type { AdminAuthConfig } from "./auth/adminAuth.js";
import { closeDatabase, openDatabase } from "./db/sqlite.js";
import { createAdminRouter } from "./routes/adminRoutes.js";
import { createHealthRouter } from "./routes/healthRoutes.js";
import { createParticipantRouter } from "./routes/participantRoutes.js";
import { createSessionRouter } from "./routes/sessionRoutes.js";
import type { SqliteDatabase } from "./types/db.js";

export type CreateAppOptions = {
  databasePath: string;
  admin: AdminAuthConfig;
  /** When set, enable CORS for this origin (web/Vite). Omit on desktop same-origin. */
  corsOrigin?: string;
  /** Absolute path to Vite `dist/` so Express can serve the SPA. */
  serveFrontendDistPath?: string;
};

export type AppRuntime = {
  app: Express;
  db: SqliteDatabase;
  close: () => void;
};

export function createApp(options: CreateAppOptions): AppRuntime {
  const db = openDatabase(options.databasePath);
  try {
    return buildApp(db, options);
  } catch (err) {
    closeDatabase(db);
    throw err;
  }
}

function buildApp(db: SqliteDatabase, options: CreateAppOptions): AppRuntime {
  const app = express();

  if (options.corsOrigin) {
    app.use(
      cors({
        origin: options.corsOrigin,
        credentials: true,
      }),
    );
  }

  app.use(express.json({ limit: "256kb" }));

  app.use("/api", createHealthRouter(db));
  app.use("/api", createParticipantRouter(db));
  app.use("/api", createSessionRouter(db));
  app.use("/api", createAdminRouter(db, options.admin));

  if (options.serveFrontendDistPath) {
    const distPath = path.resolve(options.serveFrontendDistPath);
    const indexHtml = path.join(distPath, "index.html");
    if (!fs.existsSync(indexHtml)) {
      throw new Error(`Frontend dist not found: ${indexHtml}`);
    }

    app.use(express.static(distPath, { index: false, fallthrough: true }));
    app.use((req, res, next) => {
      if (req.method !== "GET" && req.method !== "HEAD") {
        next();
        return;
      }
      if (req.path.startsWith("/api")) {
        next();
        return;
      }
      res.sendFile(indexHtml, (err) => {
        if (err) next(err);
      });
    });
  }

  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    },
  );

  return {
    app,
    db,
    close: () => {
      closeDatabase(db);
    },
  };
}
