/**
 * Launch compiled Electron against dist/.
 * Strips NODE_OPTIONS — Electron rejects flags like --openssl-legacy-provider.
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const electronBinary = require("electron");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const env = { ...process.env };
delete env.NODE_OPTIONS;

const child = spawn(electronBinary, ["."], {
  cwd: root,
  stdio: "inherit",
  env,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
