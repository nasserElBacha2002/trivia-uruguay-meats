export type QuizAnswer = {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
};

export type FeedbackState = {
  isVisible: boolean;
  isCorrect: boolean;
  message: string | null;
};
