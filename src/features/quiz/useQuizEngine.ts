import { useMemo, useState } from "react";
import { quizContent } from "../../content/quizContent";
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

  const questions = quizContent.questions;
  const currentQuestion = questions[state.currentQuestionIndex];
  const isLastQuestion = state.currentQuestionIndex === questions.length - 1;
  const hasAnsweredCurrent = state.answers.some(
    (answer) => answer.questionId === currentQuestion.id,
  );

  const progressValue = useMemo(
    () => ((state.currentQuestionIndex + 1) / questions.length) * 100,
    [questions.length, state.currentQuestionIndex],
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
    currentQuestionIndex: state.currentQuestionIndex,
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
