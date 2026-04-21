import { useCallback, useEffect, useState } from "react";
import { completeQuizSession } from "../../services/triviaApi";

type Params = {
  sessionId: number | null;
  score: number;
  totalQuestions: number;
  scoreBand: "high" | "medium" | "low";
};

function readStorageComplete(storageKey: string | null): boolean {
  if (!storageKey || typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(storageKey) === "1";
}

/**
 * Syncs quiz completion to the API once per result view (deduped with sessionStorage key `trivia_session_completed_{id}`).
 */
export function useCompleteQuizSession(params: Params) {
  const { sessionId, score, totalQuestions, scoreBand } = params;
  const storageKey = sessionId != null ? `trivia_session_completed_${sessionId}` : null;

  const [completeOk, setCompleteOk] = useState(() => readStorageComplete(storageKey));
  const [syncFailed, setSyncFailed] = useState(false);

  useEffect(() => {
    if (sessionId == null || storageKey == null) return;
    if (completeOk) return;

    let cancelled = false;

    void (async () => {
      try {
        await completeQuizSession({ sessionId, score, totalQuestions, scoreBand });
        if (cancelled) return;
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem(storageKey, "1");
        }
        setCompleteOk(true);
        setSyncFailed(false);
      } catch {
        if (cancelled) return;
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.removeItem(storageKey);
        }
        setSyncFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId, score, totalQuestions, scoreBand, storageKey, completeOk]);

  const retryComplete = useCallback(() => {
    if (storageKey && typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem(storageKey);
    }
    setSyncFailed(false);
    setCompleteOk(false);
  }, [storageKey]);

  return {
    syncFailed: syncFailed && !completeOk,
    retryComplete,
  };
}
