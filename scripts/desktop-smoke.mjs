/**
 * Smoke: Electron + Express + SQLite on loopback, then persist across restart.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const electronBinary = require("electron");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const userData = fs.mkdtempSync(path.join(os.tmpdir(), "trivia-desktop-smoke-"));

function spawnElectron() {
  const env = { ...process.env, TRIVIA_USER_DATA: userData };
  delete env.NODE_OPTIONS;
  delete env.ELECTRON_DEV;
  return spawn(electronBinary, ["."], {
    cwd: root,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function waitForLoaded(child, timeoutMs = 25_000) {
  return new Promise((resolve, reject) => {
    let buf = "";
    const onExit = (code) => {
      clearTimeout(timer);
      reject(new Error(`Electron exited ${code}\n${buf}`));
    };
    const onData = (chunk) => {
      const text = chunk.toString();
      buf += text;
      process.stdout.write(text);
      const match = buf.match(/\[electron\] loaded (http:\/\/127\.0\.0\.1:\d+)/);
      if (match) {
        clearTimeout(timer);
        child.off("exit", onExit);
        child.stdout.off("data", onData);
        child.stderr.off("data", onData);
        resolve(match[1]);
      }
    };
    const timer = setTimeout(() => {
      child.off("exit", onExit);
      child.stdout.off("data", onData);
      child.stderr.off("data", onData);
      reject(new Error(`Timeout waiting for Electron boot.\n${buf}`));
    }, timeoutMs);
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.once("exit", onExit);
  });
}

async function jsonFetch(url, init) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${init?.method ?? "GET"} ${url} → ${res.status} ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

function stop(child) {
  return new Promise((resolve) => {
    child.once("exit", () => resolve());
    child.kill("SIGTERM");
    setTimeout(() => {
      if (!child.killed) child.kill("SIGKILL");
    }, 3000);
  });
}

const answers = [
  ["q1", "q1_o1", true],
  ["q2", "q2_o2", true],
  ["q3", "q3_o3", true],
  ["q4", "q4_o3", true],
  ["q5", "q5_o1", true],
  ["q6", "q6_o3", true],
];

let first;
try {
  first = spawnElectron();
  const origin = await waitForLoaded(first);
  console.log("[smoke] origin", origin);

  const health = await jsonFetch(`${origin}/api/health`);
  if (health.ok !== true || health.database !== "ok") {
    throw new Error(`health failed: ${JSON.stringify(health)}`);
  }

  const created = await jsonFetch(`${origin}/api/participants`, {
    method: "POST",
    body: JSON.stringify({
      name: "Smoke Tester",
      email: "smoke@example.com",
      country: "Uruguay",
      sectorId: "sector_importador",
      buysUruguayMeat: true,
      language: "pt",
      quizVersion: "uruguay-lamb-quiz-pt",
    }),
  });

  for (const [questionId, selectedOptionId, isCorrect] of answers) {
    await jsonFetch(`${origin}/api/sessions/${created.sessionId}/answers`, {
      method: "POST",
      body: JSON.stringify({ questionId, selectedOptionId, isCorrect }),
    });
  }

  await jsonFetch(`${origin}/api/sessions/${created.sessionId}/complete`, {
    method: "POST",
    body: JSON.stringify({ score: 6, totalQuestions: 6, scoreBand: "high" }),
  });

  const login = await fetch(`${origin}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ username: "admin", password: "admin" }),
  });
  if (!login.ok) throw new Error(`admin login ${login.status} ${await login.text()}`);
  const cookie = login.headers.get("set-cookie") ?? "";

  const sessions = await jsonFetch(`${origin}/api/admin/sessions`, {
    headers: { cookie },
  });
  if (!Array.isArray(sessions.sessions) || sessions.sessions.length < 1) {
    throw new Error("admin sessions empty after complete");
  }

  console.log("[smoke] flow ok, participantId=", created.participantId);
  await stop(first);

  const dbPath = path.join(userData, "data", "trivia.db");
  if (!fs.existsSync(dbPath)) {
    throw new Error(`DB missing after close: ${dbPath}`);
  }

  const second = spawnElectron();
  const origin2 = await waitForLoaded(second);
  const login2 = await fetch(`${origin2}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ username: "admin", password: "admin" }),
  });
  if (!login2.ok) throw new Error(`admin login after restart ${login2.status}`);
  const cookie2 = login2.headers.get("set-cookie") ?? "";
  const sessions2 = await jsonFetch(`${origin2}/api/admin/sessions`, {
    headers: { cookie: cookie2 },
  });
  const kept = sessions2.sessions?.some((row) => row.participant_id === created.participantId);
  if (!kept) throw new Error("participant missing after restart");
  await stop(second);

  console.log("[smoke] persistence ok");
  console.log("[smoke] databasePath", dbPath);
  console.log("[smoke] PASS");
} catch (err) {
  if (first) await stop(first).catch(() => undefined);
  console.error("[smoke] FAIL", err instanceof Error ? err.message : err);
  process.exit(1);
}
