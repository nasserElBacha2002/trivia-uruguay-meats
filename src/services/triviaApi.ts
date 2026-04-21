import type { Language } from "../types/domain";
import type { QuizAnswer } from "../features/quiz/quizTypes";
import { apiFetch } from "./api";

export type CreateParticipantSessionInput = {
  name: string;
  email: string;
  country: string;
  sectorId: string;
  buysUruguayMeat: boolean;
  language: Language;
  quizVersion?: string;
};

export type CreateParticipantSessionResult = {
  participantId: number;
  sessionId: number;
};

export async function createParticipantSession(
  input: CreateParticipantSessionInput,
): Promise<CreateParticipantSessionResult> {
  return apiFetch<CreateParticipantSessionResult>("/api/participants", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function submitQuizAnswer(sessionId: number, answer: QuizAnswer): Promise<void> {
  await apiFetch<{ ok: true }>(`/api/sessions/${sessionId}/answers`, {
    method: "POST",
    body: JSON.stringify({
      questionId: answer.questionId,
      selectedOptionId: answer.selectedOptionId,
      isCorrect: answer.isCorrect,
    }),
  });
}

export type CompleteQuizSessionInput = {
  sessionId: number;
  score: number;
  totalQuestions: number;
  scoreBand: "high" | "medium" | "low";
};

export async function completeQuizSession(input: CompleteQuizSessionInput): Promise<void> {
  await apiFetch<{ ok: true }>(`/api/sessions/${input.sessionId}/complete`, {
    method: "POST",
    body: JSON.stringify({
      score: input.score,
      totalQuestions: input.totalQuestions,
      scoreBand: input.scoreBand,
    }),
  });
}

export async function getHealth(): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>("/api/health");
}
