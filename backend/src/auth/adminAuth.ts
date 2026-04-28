import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";

const ADMIN_COOKIE = "trivia_admin_session";
const EIGHT_HOURS_SECONDS = 60 * 60 * 8;

type AdminSessionStore = {
  username: string;
  isConfigured: boolean;
  cookieName: string;
  login: (username: string, password: string) => { ok: true } | { ok: false };
  createSession: () => string;
  isAuthenticated: (token: string | null | undefined) => boolean;
  logout: (token: string | null | undefined) => void;
  readToken: (req: Request) => string | null;
  requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
  setSessionCookie: (res: Response, token: string) => void;
  clearSessionCookie: (res: Response) => void;
};

function parseCookieHeader(raw: string | undefined): Record<string, string> {
  if (!raw) return {};
  return raw.split(";").reduce<Record<string, string>>((acc, item) => {
    const [k, ...rest] = item.trim().split("=");
    if (!k) return acc;
    acc[k] = decodeURIComponent(rest.join("=") ?? "");
    return acc;
  }, {});
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export function createAdminAuth(): AdminSessionStore {
  const username = process.env.ADMIN_USERNAME ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secureCookie = process.env.ADMIN_COOKIE_SECURE === "true";
  const isConfigured = username.length > 0 && password.length > 0;
  const sessions = new Set<string>();

  const readToken = (req: Request): string | null => {
    const cookies = parseCookieHeader(req.headers.cookie);
    return cookies[ADMIN_COOKIE] ?? null;
  };

  const setSessionCookie = (res: Response, token: string): void => {
    const serialized = [
      `${ADMIN_COOKIE}=${encodeURIComponent(token)}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      `Max-Age=${EIGHT_HOURS_SECONDS}`,
      ...(secureCookie ? ["Secure"] : []),
    ].join("; ");
    res.setHeader("Set-Cookie", serialized);
  };

  const clearSessionCookie = (res: Response): void => {
    const serialized = [
      `${ADMIN_COOKIE}=`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      "Max-Age=0",
      ...(secureCookie ? ["Secure"] : []),
    ].join("; ");
    res.setHeader("Set-Cookie", serialized);
  };

  const login = (candidateUsername: string, candidatePassword: string) => {
    if (!isConfigured) return { ok: false } as const;
    if (!safeEqual(candidateUsername, username)) return { ok: false } as const;
    if (!safeEqual(candidatePassword, password)) return { ok: false } as const;
    return { ok: true } as const;
  };

  const createSession = (): string => {
    const token = createAdminSessionToken();
    sessions.add(token);
    return token;
  };

  const logout = (token: string | null | undefined): void => {
    if (!token) return;
    sessions.delete(token);
  };

  const isAuthenticated = (token: string | null | undefined): boolean => {
    return Boolean(token && sessions.has(token));
  };

  const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const token = readToken(req);
    if (!isAuthenticated(token)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    next();
  };

  return {
    username,
    isConfigured,
    cookieName: ADMIN_COOKIE,
    login,
    createSession,
    isAuthenticated,
    logout,
    readToken,
    requireAdmin,
    setSessionCookie,
    clearSessionCookie,
  };
}

export function createAdminSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
