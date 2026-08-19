import { appRouter } from "../app/router";
import { ROUTES } from "../config/routes";

/**
 * Desktop-only. Web has no `window.triviaDesktop`, so this is a no-op there.
 * Navigating to /admin does not reset SessionProvider. Returning to `/` uses
 * AttractPage's existing reset if a trivia was in progress.
 */
export function subscribeDesktopAdminShortcut(): () => void {
  const api = window.triviaDesktop;
  if (!api) return () => undefined;

  return api.onOpenAdmin(() => {
    if (appRouter.state.location.pathname === ROUTES.admin) return;
    void appRouter.navigate(ROUTES.admin);
  });
}
