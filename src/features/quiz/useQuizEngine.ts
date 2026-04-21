import { useMemo, useState } from "react";
import { getQuizContent } from "../../content/quizContent";
import type { QuizAnswer, FeedbackState } from "./quizTypes";
import { useSessionStore } from "../session/useSessionStore";

export function useQuizEngine() {
  const { state, submitAnswer, goToNextQuestion, finishQuiz } = useSessionStore();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>({
    isVisible: false,
    isCorrect: false,
    message: null,
  });

  const quizContent = getQuizContent(state.language);
  const questions = quizContent.questions;
  const safeQuestionIndex =
    state.currentQuestionIndex >= 0 && state.currentQuestionIndex < questions.length
      ? state.currentQuestionIndex
      : 0;
  const currentQuestion = questions[safeQuestionIndex];
  const isLastQuestion = safeQuestionIndex === questions.length - 1;
  const hasAnsweredCurrent = state.answers.some(
    (answer) => answer.questionId === currentQuestion.id,
  );

  const progressValue = useMemo(
    () => ((safeQuestionIndex + 1) / questions.length) * 100,
    [questions.length, safeQuestionIndex],
  );

  const selectOption = (optionId: string) => {
    if (hasAnsweredCurrent) return;
    setSelectedOptionId(optionId);
  };

  const submitCurrentAnswer = () => {
    if (!selectedOptionId || hasAnsweredCurrent) return;

    const isCorrect = selectedOptionId === currentQuestion.correctOptionId;
    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId,
      isCorrect,
    };

    submitAnswer(answer);
    setFeedbackState({
      isVisible: true,
      isCorrect,
      message: currentQuestion.feedback,
    });
  };

  const continueToNext = () => {
    if (!feedbackState.isVisible) return;

    if (isLastQuestion) {
      finishQuiz(questions.length);
      return;
    }

    setSelectedOptionId(null);
    setFeedbackState({ isVisible: false, isCorrect: false, message: null });
    goToNextQuestion(questions.length);
  };

  return {
    questions,
    currentQuestion,
    currentQuestionIndex: safeQuestionIndex,
    selectedOptionId,
    feedbackState,
    progressValue,
    isLastQuestion,
    canSubmit: Boolean(selectedOptionId) && !feedbackState.isVisible,
    canContinue: feedbackState.isVisible,
    selectOption,
    submitCurrentAnswer,
    continueToNext,
  };
}
