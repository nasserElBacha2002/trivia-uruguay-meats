import type { CreateParticipantBody } from "../types/api.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ParticipantValidationResult =
  | { ok: true; value: CreateParticipantBody }
  | { ok: false; error: string };

export function validateCreateParticipantBody(raw: unknown): ParticipantValidationResult {
  if (raw === null || typeof raw !== "object") {
    return { ok: false, error: "Body must be a JSON object" };
  }

  const body = raw as Record<string, unknown>;

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const country = typeof body.country === "string" ? body.country.trim() : "";
  const sectorId = typeof body.sectorId === "string" ? body.sectorId.trim() : "";
  const language = body.language;
  const buysUruguayMeat = body.buysUruguayMeat;

  if (!name) return { ok: false, error: "name is required (non-empty after trim)" };
  if (!email) return { ok: false, error: "email is required (non-empty after trim)" };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "email format is invalid" };
  if (!country) return { ok: false, error: "country is required (non-empty after trim)" };
  if (!sectorId) return { ok: false, error: "sectorId is required (non-empty after trim)" };
  if (buysUruguayMeat !== true && buysUruguayMeat !== false) {
    return { ok: false, error: "buysUruguayMeat must be a strict boolean" };
  }
  if (language !== "pt" && language !== "en") {
    return { ok: false, error: "language must be \"pt\" or \"en\"" };
  }

  const quizVersion =
    body.quizVersion === undefined || body.quizVersion === null
      ? undefined
      : typeof body.quizVersion === "string"
        ? body.quizVersion.trim() || undefined
        : String(body.quizVersion);

  const value: CreateParticipantBody = {
    name,
    email,
    country,
    sectorId,
    buysUruguayMeat,
    language,
    ...(quizVersion ? { quizVersion } : {}),
  };

  return { ok: true, value };
}
