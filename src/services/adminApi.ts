import { getApiBaseUrl } from "../config/apiBase";
import { ApiError } from "./api";

type AdminSessionRow = {
  participant_id: number;
  name: string;
  email: string;
  country: string;
  sector_id: string;
  buys_uruguay_meat: number;
  language: "pt" | "en";
  participant_created_at: string;
  session_id: number | null;
  started_at: string | null;
  completed_at: string | null;
  score: number | null;
  total_questions: number | null;
  score_band: "high" | "medium" | "low" | null;
  status: string | null;
  quiz_version: string | null;
  answer_count: number | null;
};

type AdminAnswerRow = {
  session_id: number;
  question_id: string;
  selected_option_id: string;
  is_correct: number;
  answered_at: string;
};

export type AdminDashboardMetrics = {
  totalParticipants: number;
  totalCompletedSessions: number;
  averageScore: number;
  buyersCount: number;
};

export type AdminSessionRecord = {
  participantId: number;
  name: string;
  email: string;
  country: string;
  sectorId: string;
  buysUruguayMeat: boolean;
  language: "pt" | "en";
  participantCreatedAt: string;
  sessionId: number | null;
  startedAt: string | null;
  completedAt: string | null;
  score: number | null;
  totalQuestions: number | null;
  scoreBand: "high" | "medium" | "low" | null;
  status: string;
  quizVersion: string | null;
  answerCount: number;
};

export type AdminAnswerRecord = {
  sessionId: number;
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  answeredAt: string;
};

function getAdminUrl(path: string): string {
  const base = getApiBaseUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(getAdminUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init?.body != null ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new ApiError(res.status, text || res.statusText);
  }
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

function mapSessionRow(row: AdminSessionRow): AdminSessionRecord {
  return {
    participantId: row.participant_id,
    name: row.name,
    email: row.email,
    country: row.country,
    sectorId: row.sector_id,
    buysUruguayMeat: row.buys_uruguay_meat === 1,
    language: row.language,
    participantCreatedAt: row.participant_created_at,
    sessionId: row.session_id,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    score: row.score,
    totalQuestions: row.total_questions,
    scoreBand: row.score_band,
    status: row.status ?? "no_session",
    quizVersion: row.quiz_version,
    answerCount: row.answer_count ?? 0,
  };
}

export async function adminLogin(username: string, password: string): Promise<void> {
  await adminFetch<{ ok: true }>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function adminLogout(): Promise<void> {
  await adminFetch<{ ok: true }>("/api/admin/logout", { method: "POST" });
}

export async function adminMe(): Promise<{ authenticated: true; username: string }> {
  return adminFetch<{ authenticated: true; username: string }>("/api/admin/me");
}

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const data = await adminFetch<{ metrics: AdminDashboardMetrics }>("/api/admin/dashboard");
  return data.metrics;
}

export async function getAdminSessions(): Promise<AdminSessionRecord[]> {
  const data = await adminFetch<{ sessions: AdminSessionRow[] }>("/api/admin/sessions");
  return data.sessions.map(mapSessionRow);
}

export async function getAdminSessionAnswers(sessionId: number): Promise<AdminAnswerRecord[]> {
  const data = await adminFetch<{ answers: AdminAnswerRow[] }>(`/api/admin/sessions/${sessionId}/answers`);
  return data.answers.map((row) => ({
    sessionId: row.session_id,
    questionId: row.question_id,
    selectedOptionId: row.selected_option_id,
    isCorrect: row.is_correct === 1,
    answeredAt: row.answered_at,
  }));
}

export async function exportAdminExcel(): Promise<void> {
  const res = await fetch(getAdminUrl("/api/admin/export.xlsx"), {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new ApiError(res.status, await res.text());
  }
  const blob = await res.blob();
  const contentDisposition = res.headers.get("content-disposition");
  const nameMatch = contentDisposition?.match(/filename="([^"]+)"/);
  const fileName = nameMatch?.[1] ?? "trivia-admin-export.xlsx";
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
