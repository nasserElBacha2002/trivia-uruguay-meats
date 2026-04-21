import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/routes";
import { getQuizContent } from "../../content/quizContent";
import type { QuizAnswer, FeedbackState } from "./quizTypes";
import { useSessionStore } from "../session/useSessionStore";
import { submitQuizAnswer as persistQuizAnswer } from "../../services/triviaApi";

export function useQuizEngine() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, submitAnswer, goToNextQuestion, finishQuiz } = useSessionStore();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const pendingResultNavigationRef = useRef(false);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>({
    isVisible: false,
    isCorrect: false,
    message: null,
  });
  const [answerPersistError, setAnswerPersistError] = useState<string | null>(null);
  const [isAnswerPersistencePending, setIsAnswerPersistencePending] = useState(false);

  const quizContent = getQuizContent(state.language);
  const questions = quizContent.questions;
  if (questions.length === 0) {
    throw new Error("Quiz content has no questions.");
  }
  const safeQuestionIndex =
    state.currentQuestionIndex >= 0 && state.currentQuestionIndex < questions.length
      ? state.currentQuestionIndex
      : 0;
  const currentQuestion = questions[safeQuestionIndex];
  if (!currentQuestion) {
    throw new Error("Quiz content is missing the question at the current index.");
  }
  const isLastQuestion = safeQuestionIndex === questions.length - 1;
  const hasAnsweredCurrent = state.answers.some(
    (answer) => answer.questionId === currentQuestion.id,
  );

  const progressValue = useMemo(
    () => ((safeQuestionIndex + 1) / questions.length) * 100,
    [questions.length, safeQuestionIndex],
  );

  useEffect(() => {
    if (!pendingResultNavigationRef.current) return;
    if (!state.quizCompleted || state.currentStep !== "result") return;
    navigate(ROUTES.result, { replace: true });
    pendingResultNavigationRef.current = false;
  }, [navigate, state.currentStep, state.quizCompleted]);

  const dismissAnswerPersistError = useCallback(() => {
    setAnswerPersistError(null);
  }, []);

  const selectOption = (optionId: string) => {
    if (hasAnsweredCurrent || isAnswerPersistencePending) return;
    setSelectedOptionId(optionId);
  };

  /** Persist answer first when a backend session exists; then local score + feedback. */
  const answerWithOption = async (optionId: string) => {
    if (!optionId || hasAnsweredCurrent || feedbackState.isVisible || isAnswerPersistencePending) return;

    const isCorrect = optionId === currentQuestion.correctOptionId;
    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: optionId,
      isCorrect,
    };

    setAnswerPersistError(null);
    setSelectedOptionId(optionId);

    const sid = state.sessionId;
    if (sid != null) {
      setIsAnswerPersistencePending(true);
      try {
        await persistQuizAnswer(sid, answer);
      } catch {
        setAnswerPersistError(t("quizApiAnswerError"));
        setSelectedOptionId(null);
        setIsAnswerPersistencePending(false);
        return;
      }
      setIsAnswerPersistencePending(false);
    }

    submitAnswer(answer);
    setFeedbackState({
      isVisible: true,
      isCorrect,
      message: currentQuestion.feedback,
    });
  };

  const submitCurrentAnswer = () => {
    if (!selectedOptionId || hasAnsweredCurrent || feedbackState.isVisible || isAnswerPersistencePending) return;
    void answerWithOption(selectedOptionId);
  };

  const continueToNext = () => {
    if (!feedbackState.isVisible) return;

    if (isLastQuestion) {
      finishQuiz(questions.length);
      pendingResultNavigationRef.current = true;
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
    canSubmit: Boolean(selectedOptionId) && !feedbackState.isVisible && !isAnswerPersistencePending,
    canContinue: feedbackState.isVisible,
    isAnswerPersistencePending,
    answerPersistError,
    dismissAnswerPersistError,
    selectOption,
    answerWithOption,
    submitCurrentAnswer,
    continueToNext,
  };
}
