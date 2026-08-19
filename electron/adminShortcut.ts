import type { BrowserWindow, Input } from "electron";
import { DESKTOP_OPEN_ADMIN_CHANNEL } from "./ipcChannels.js";

const ADMIN_PATH = "/admin";

export function isStaffAdminChord(input: Input): boolean {
  if (input.type !== "keyDown" || input.isAutoRepeat) return false;
  if (input.alt) return false;
  if (!input.shift) return false;
  if (!input.control && !input.meta) return false;
  return (input.key ?? "").toLowerCase() === "a";
}

function isAlreadyOnAdmin(url: string): boolean {
  try {
    return new URL(url).pathname === ADMIN_PATH;
  } catch {
    return false;
  }
}

/** Window-local shortcut. Not a system globalShortcut. Works in future fullscreen/kiosk. */
export function attachStaffAdminShortcut(win: BrowserWindow): void {
  win.webContents.on("before-input-event", (event, input) => {
    if (!isStaffAdminChord(input)) return;
    event.preventDefault();
    if (isAlreadyOnAdmin(win.webContents.getURL())) return;
    console.log("[electron] staff-admin-shortcut");
    win.webContents.send(DESKTOP_OPEN_ADMIN_CHANNEL);
  });
}
