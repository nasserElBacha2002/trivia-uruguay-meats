import { useEffect } from "react";

export function useKioskGuards() {
  useEffect(() => {
    const onContextMenu = (event: MouseEvent) => event.preventDefault();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F5" || (event.altKey && event.key === "ArrowLeft")) {
        event.preventDefault();
      }
    };

    window.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
}
