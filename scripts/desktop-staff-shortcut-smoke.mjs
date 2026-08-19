/**
 * Smoke: Ctrl/Cmd+Shift+A opens /admin, login still required, Volver a trivia returns to /.
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
const userData = fs.mkdtempSync(path.join(os.tmpdir(), "trivia-staff-shortcut-"));

if (!fs.existsSync(path.join(root, "dist", "index.html"))) {
  console.error("[staff-shortcut-smoke] Missing frontend dist. Run `npm run desktop:build` first.");
  process.exit(1);
}

function spawnElectron() {
  const env = {
    ...process.env,
    TRIVIA_USER_DATA: userData,
    TRIVIA_STAFF_SHORTCUT_SMOKE: "1",
  };
  delete env.NODE_OPTIONS;
  delete env.ELECTRON_DEV;
  return spawn(electronBinary, ["."], {
    cwd: root,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function waitForResult(child, timeoutMs = 60_000) {
  return new Promise((resolve, reject) => {
    let buf = "";
    const onExit = (code) => {
      clearTimeout(timer);
      if (buf.includes("[electron] staff-shortcut-smoke PASS") && code === 0) {
        resolve(buf);
        return;
      }
      reject(new Error(`Electron exited ${code}\n${buf}`));
    };
    const onData = (chunk) => {
      const text = chunk.toString();
      buf += text;
      process.stdout.write(text);
    };
    const timer = setTimeout(() => {
      child.off("exit", onExit);
      child.stdout.off("data", onData);
      child.stderr.off("data", onData);
      child.kill("SIGKILL");
      reject(new Error(`Timeout waiting for staff shortcut smoke.\n${buf}`));
    }, timeoutMs);
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.once("exit", onExit);
  });
}

let child;
try {
  child = spawnElectron();
  const output = await waitForResult(child);
  const loaded = [...output.matchAll(/\[electron\] loaded (http:\/\/127\.0\.0\.1:\d+)/g)];
  if (loaded.length !== 1) {
    throw new Error(`expected one desktop origin, got ${loaded.length}`);
  }
  console.log("[staff-shortcut-smoke] origin", loaded[0][1]);
  console.log("[staff-shortcut-smoke] PASS");
} catch (err) {
  if (child) {
    child.kill("SIGKILL");
  }
  console.error("[staff-shortcut-smoke] FAIL", err instanceof Error ? err.message : err);
  process.exit(1);
}
