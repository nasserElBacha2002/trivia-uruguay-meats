import { contextBridge, ipcRenderer } from "electron";

/**
 * Compiled as CommonJS (`tsconfig.preload.json`). Sandboxed Electron preloads
 * cannot load ESM (`import` is a SyntaxError there).
 * Channel name must stay in sync with `electron/ipcChannels.ts`.
 */
const DESKTOP_OPEN_ADMIN_CHANNEL = "desktop:open-admin";

const openAdminListeners = new Set<() => void>();
let pendingOpenAdmin = false;

ipcRenderer.on(DESKTOP_OPEN_ADMIN_CHANNEL, () => {
  if (openAdminListeners.size === 0) {
    pendingOpenAdmin = true;
    return;
  }
  for (const listener of openAdminListeners) listener();
});

contextBridge.exposeInMainWorld("triviaDesktop", {
  isDesktop: true,
  onOpenAdmin: (callback: () => void) => {
    openAdminListeners.add(callback);
    if (pendingOpenAdmin) {
      pendingOpenAdmin = false;
      callback();
    }
    return () => {
      openAdminListeners.delete(callback);
    };
  },
});
