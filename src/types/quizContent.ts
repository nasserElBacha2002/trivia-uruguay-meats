export type QuizFieldType = "text" | "email" | "single_select";

export type QuizFieldOption = {
  id: string;
  label: string;
};

export type QuizDataCollectionField = {
  id: string;
  label: string;
  type: QuizFieldType;
  required: boolean;
  options?: QuizFieldOption[];
};

export type QuizQuestionOption = {
  id: string;
  label: string;
};

export type QuizQuestion = {
  id: string;
  order: number;
  prompt: string;
  options: QuizQuestionOption[];
  correctOptionId: string;
  feedback: string | null;
};

export type QuizFinalResults = {
  high: string;
  medium: string;
  low: string;
};

export type QuizContent = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  durationSecondsMin: number;
  durationSecondsMax: number;
  totalQuestions: number;
  objectives: string[];
  dataCollection: {
    fields: QuizDataCollectionField[];
  };
  quizFormat: {
    type: "multiple_choice";
    feedbackMode: "immediate";
    singleCorrectOption: boolean;
  };
  questions: QuizQuestion[];
  finalResults: QuizFinalResults;
  closingMessage: string;
};
