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

export type SubmitQuizAnswerResponse = {
  ok: true;
  currentScore?: number;
  duplicate?: boolean;
};

export async function submitQuizAnswer(sessionId: number, answer: QuizAnswer): Promise<SubmitQuizAnswerResponse> {
  return apiFetch<SubmitQuizAnswerResponse>(`/api/sessions/${sessionId}/answers`, {
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

export type CompleteQuizSessionResponse = {
  ok: true;
  alreadyCompleted?: boolean;
  session: {
    id: number;
    participantId: number;
    score: number | null;
    totalQuestions: number | null;
    scoreBand: string | null;
    status: string;
    completedAt: string | null;
  };
};

export async function completeQuizSession(
  input: CompleteQuizSessionInput,
): Promise<CompleteQuizSessionResponse> {
  return apiFetch<CompleteQuizSessionResponse>(`/api/sessions/${input.sessionId}/complete`, {
    method: "POST",
    body: JSON.stringify({
      score: input.score,
      totalQuestions: input.totalQuestions,
      scoreBand: input.scoreBand,
    }),
  });
}

export type HealthResponse = {
  ok: boolean;
  service: string;
};

export async function getHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>("/api/health");
}
