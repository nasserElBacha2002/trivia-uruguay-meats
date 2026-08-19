/** Base URL for trivia API (no trailing slash). */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined" && window.triviaDesktop?.isDesktop) {
    return "";
  }
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (typeof raw === "string" && raw.trim().length > 0) {
    return raw.trim().replace(/\/$/, "");
  }
  if (import.meta.env.PROD) {
    return "";
  }
  return "http://localhost:3001";
}
