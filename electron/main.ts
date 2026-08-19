import { app, BrowserWindow, dialog } from "electron";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { attachStaffAdminShortcut } from "./adminShortcut.js";
import { DESKTOP_ADMIN_CONFIG } from "./config.js";
import { getDesktopPaths } from "./paths.js";
import { closeDesktopApi, startDesktopApi, type StartedApi } from "./startApi.js";
import { waitForHealth } from "./waitForHealth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, "..");
const isDev = process.env.ELECTRON_DEV === "1";

app.setName("TriviaUruguayMeats");
if (process.env.TRIVIA_USER_DATA) {
  app.setPath("userData", process.env.TRIVIA_USER_DATA);
}

let bootInFlight: Promise<void> | null = null;
let startedApi: StartedApi | null = null;
let shuttingDown = false;

function isAllowedAppUrl(url: URL, appOrigin: string): boolean {
  return url.origin === appOrigin;
}

function attachNavigationGuards(win: BrowserWindow, appOrigin: string): void {
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));

  win.webContents.on("will-navigate", (event, url) => {
    try {
      if (isAllowedAppUrl(new URL(url), appOrigin)) return;
    } catch {
      /* deny */
    }
    event.preventDefault();
  });
}

function showStartupError(): void {
  dialog.showErrorBox(
    "Trivia Uruguay Meats",
    "No se pudo iniciar Trivia Uruguay Meats.\n\nReiniciá la aplicación.\nSi el problema continúa, contactá soporte.",
  );
}

async function createMainWindow(appOrigin: string): Promise<void> {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  attachNavigationGuards(win, appOrigin);
  attachStaffAdminShortcut(win);
  win.webContents.on("preload-error", (_event, preloadPath, error) => {
    console.error("[electron] preload-error", preloadPath, error);
  });

  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }

  win.once("ready-to-show", () => {
    win.show();
  });
  await win.loadURL(appOrigin);

  if (process.env.TRIVIA_STAFF_SHORTCUT_SMOKE === "1") {
    try {
      const { runStaffShortcutSmoke } = await import("./staffShortcutSmoke.js");
      await runStaffShortcutSmoke(win, appOrigin);
      console.log("[electron] staff-shortcut-smoke PASS");
      app.exit(0);
    } catch (err) {
      console.error("[electron] staff-shortcut-smoke FAIL", err);
      app.exit(1);
    }
  }
}

async function boot(): Promise<void> {
  const paths = getDesktopPaths(PROJECT_ROOT);
  if (!fs.existsSync(path.join(paths.frontendDistPath, "index.html"))) {
    throw new Error(`Frontend dist not found at ${paths.frontendDistPath}. Run npm run desktop:build first.`);
  }
  if (!fs.existsSync(path.join(paths.backendDistDir, "createApp.js"))) {
    throw new Error(`Backend dist not found at ${paths.backendDistDir}. Run npm run desktop:compile first.`);
  }

  startedApi = await startDesktopApi(
    {
      databasePath: paths.databasePath,
      admin: { ...DESKTOP_ADMIN_CONFIG },
      serveFrontendDistPath: paths.frontendDistPath,
    },
    paths.backendDistDir,
  );

  await waitForHealth(startedApi.origin);
  await createMainWindow(startedApi.origin);
  console.log(`[electron] loaded ${startedApi.origin} (ELECTRON_DEV=${isDev ? "1" : "0"})`);
  console.log(`[electron] databasePath=${paths.databasePath}`);
}

async function ensureBoot(): Promise<void> {
  if (BrowserWindow.getAllWindows().length > 0) return;
  if (bootInFlight) return bootInFlight;
  bootInFlight = boot().finally(() => {
    bootInFlight = null;
  });
  return bootInFlight;
}

async function shutdown(): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  const api = startedApi;
  startedApi = null;
  if (api) {
    await closeDesktopApi(api);
  }
}

app.whenReady().then(() => {
  void ensureBoot().catch((err) => {
    console.error("[electron] boot failed:", err);
    showStartupError();
    app.quit();
  });

  app.on("activate", () => {
    void ensureBoot().catch((err) => {
      console.error("[electron] boot failed:", err);
      showStartupError();
    });
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", (event) => {
  if (shuttingDown || !startedApi) return;
  event.preventDefault();
  void shutdown()
    .catch((err) => {
      console.error("[electron] shutdown failed:", err);
    })
    .finally(() => {
      app.exit(0);
    });
});
