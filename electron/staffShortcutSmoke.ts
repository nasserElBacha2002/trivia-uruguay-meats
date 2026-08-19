import type { BrowserWindow } from "electron";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForPath(win: BrowserWindow, pathname: string, timeoutMs = 12_000): Promise<void> {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      if (new URL(win.webContents.getURL()).pathname === pathname) return;
    } catch {
      /* keep polling */
    }
    await sleep(50);
  }
  throw new Error(`Timeout waiting for ${pathname}, have ${win.webContents.getURL()}`);
}

async function waitForBodyText(win: BrowserWindow, needle: string, timeoutMs = 12_000): Promise<void> {
  const started = Date.now();
  let lastText = "";
  while (Date.now() - started < timeoutMs) {
    const text = await win.webContents.executeJavaScript("document.body.innerText");
    lastText = typeof text === "string" ? text : String(text);
    if (lastText.includes(needle)) return;
    await sleep(80);
  }
  throw new Error(`Timeout waiting for UI text: ${needle}. Last UI:\n${lastText.slice(0, 500)}`);
}

function sendAdminChord(win: BrowserWindow, modifier: "control" | "meta"): void {
  win.show();
  win.focus();
  win.webContents.focus();
  const event = {
    type: "keyDown" as const,
    keyCode: "A",
    modifiers: [modifier, "shift"] as Array<"control" | "meta" | "shift">,
  };
  win.webContents.sendInputEvent(event);
  win.webContents.sendInputEvent({ ...event, type: "keyUp" });
}

async function waitForDesktopReady(win: BrowserWindow, timeoutMs = 12_000): Promise<void> {
  const started = Date.now();
  let lastSnapshot = "unavailable";
  while (Date.now() - started < timeoutMs) {
    lastSnapshot = String(
      await win.webContents.executeJavaScript(`JSON.stringify({
        triviaDesktop: typeof window.triviaDesktop,
        isDesktop: Boolean(window.triviaDesktop?.isDesktop),
        rootChildren: document.getElementById("root")?.childElementCount ?? 0,
        href: location.href
      })`),
    );
    if (lastSnapshot.includes('"isDesktop":true') && !lastSnapshot.includes('"rootChildren":0')) {
      return;
    }
    await sleep(50);
  }
  throw new Error(`Desktop renderer was not ready for the staff shortcut: ${lastSnapshot}`);
}

export async function runStaffShortcutSmoke(win: BrowserWindow, appOrigin: string): Promise<void> {
  await waitForPath(win, "/");
  await waitForDesktopReady(win);
  sendAdminChord(win, "control");
  await waitForPath(win, "/admin");
  await waitForBodyText(win, "Ingresá tus credenciales");
  console.log("[electron] staff-shortcut-smoke login-visible");

  await win.webContents.executeJavaScript(`
    (() => {
      const setNative = (el, value) => {
        const proto = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
        if (!proto?.set) throw new Error("input value setter missing");
        const last = el.value;
        proto.set.call(el, value);
        const tracker = el._valueTracker;
        if (tracker) tracker.setValue(last);
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      };
      const inputs = [...document.querySelectorAll("input")];
      const user = inputs.find((el) => el.type !== "password");
      const pass = inputs.find((el) => el.type === "password");
      if (!(user instanceof HTMLInputElement) || !(pass instanceof HTMLInputElement)) {
        throw new Error("login inputs missing: " + inputs.map((el) => el.type).join(","));
      }
      setNative(user, "admin");
      setNative(pass, "admin");
      const form = user.closest("form");
      if (form instanceof HTMLFormElement) {
        form.requestSubmit();
        return { user: user.value, passLen: pass.value.length, via: "form" };
      }
      const submit = [...document.querySelectorAll("button")].find((el) =>
        (el.textContent ?? "").includes("Ingresar"),
      );
      if (!(submit instanceof HTMLButtonElement)) throw new Error("login submit missing");
      submit.click();
      return { user: user.value, passLen: pass.value.length, via: "button" };
    })()
  `);
  await waitForBodyText(win, "Exportar Excel");
  await waitForBodyText(win, "Volver a trivia");
  console.log("[electron] staff-shortcut-smoke dashboard-visible");

  await win.webContents.executeJavaScript(`
    (() => {
      const button = [...document.querySelectorAll("button")].find((el) =>
        (el.textContent ?? "").includes("Volver a trivia"),
      );
      if (!(button instanceof HTMLButtonElement)) throw new Error("Volver a trivia missing");
      button.click();
    })()
  `);
  await waitForPath(win, "/");
  console.log("[electron] staff-shortcut-smoke back-to-trivia");

  await win.loadURL(`${appOrigin}/quiz`);
  await waitForPath(win, "/quiz");
  await waitForDesktopReady(win);
  sendAdminChord(win, process.platform === "darwin" ? "meta" : "control");
  await waitForPath(win, "/admin");
  await waitForBodyText(win, "Panel admin");
  console.log("[electron] staff-shortcut-smoke from-quiz");
}
