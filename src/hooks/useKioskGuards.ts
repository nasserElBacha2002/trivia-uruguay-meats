import { useEffect } from "react";

export function useKioskGuards() {
  useEffect(() => {
    const onContextMenu = (event: MouseEvent) => event.preventDefault();
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "F5" ||
        (event.altKey && event.key === "ArrowLeft") ||
        (event.metaKey && event.key.toLowerCase() === "r")
      ) {
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
