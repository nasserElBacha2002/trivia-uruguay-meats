import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../config/routes";
import { KIOSK_IDLE_TIMEOUT_MS } from "../config/kiosk";
import { useSessionStore } from "../features/session/useSessionStore";

const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = [
  "pointerdown",
  "touchstart",
  "keydown",
  "input",
  "click",
];

export function useInactivityReset() {
  const { resetSession } = useSessionStore();
  const location = useLocation();
  const navigate = useNavigate();
  const timeoutRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timeoutRef.current = window.setTimeout(() => {
      resetSession();
      if (location.pathname !== ROUTES.attract) {
        navigate(ROUTES.attract, { replace: true });
      }
    }, KIOSK_IDLE_TIMEOUT_MS);
  }, [clearTimer, location.pathname, navigate, resetSession]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer, location.pathname]);

  useEffect(() => {
    const handleActivity = () => startTimer();

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
    };
  }, [startTimer]);
}
