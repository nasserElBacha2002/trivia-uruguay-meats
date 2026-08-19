/**
 * Launch Electron against the real desktop stack (Express + SQLite + Vite dist).
 * HMR stays on `npm run dev:all` (web). This flow is same-origin HTTP.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const electronBinary = require("electron");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

if (!fs.existsSync(path.join(root, "dist", "index.html"))) {
  console.error("[desktop:dev] Missing frontend dist. Run `npm run desktop:build` first.");
  process.exit(1);
}

const env = { ...process.env, ELECTRON_DEV: "1" };
delete env.NODE_OPTIONS;

const child = spawn(electronBinary, ["."], {
  cwd: root,
  stdio: "inherit",
  env,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
