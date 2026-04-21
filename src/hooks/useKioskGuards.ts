import { useEffect } from "react";

export function useKioskGuards() {
  useEffect(() => {
    const onContextMenu = (event: MouseEvent) => event.preventDefault();
    const onKeyDown = (event: KeyboardEvent) => {
      const rawKey = event.key ?? "";
      const key = rawKey.toLowerCase();
      const isReloadChord =
        rawKey === "F5" ||
        event.code === "F5" ||
        ((event.metaKey || event.ctrlKey) && key === "r") ||
        ((event.metaKey || event.ctrlKey) && event.shiftKey && key === "r");

      if (isReloadChord || (event.altKey && rawKey === "ArrowLeft")) {
        event.preventDefault();
      }
    };
    const onPopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);

    window.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);
}
