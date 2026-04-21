/**
 * Local dev bootstrap: ensures backend SQLite directory exists.
 * Run: npm run setup:local
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "backend", "data");

fs.mkdirSync(dataDir, { recursive: true });
console.log("[setup:local] Ready. SQLite directory:", dataDir);
console.log("[setup:local] Next: copy backend/.env.example → backend/.env if needed, then npm run dev:all");
