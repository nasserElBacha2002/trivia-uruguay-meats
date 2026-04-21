export type Language = "pt" | "en";

export type CreateParticipantBody = {
  name: string;
  email: string;
  country: string;
  sectorId: string;
  buysUruguayMeat: boolean;
  language: Language;
  quizVersion?: string;
};

export type CreateParticipantResponse = {
  participantId: number;
  sessionId: number;
};

export type SubmitAnswerBody = {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
};

export type SubmitAnswerResponse = {
  ok: true;
  currentScore?: number;
};

export type CompleteSessionBody = {
  score: number;
  totalQuestions: number;
  scoreBand: "high" | "medium" | "low";
};

export type CompleteSessionResponse = {
  ok: true;
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
