import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LeadSubmission } from "../lead/leadTypes";
import type { QuizAnswer } from "../quiz/quizTypes";
import type { Language } from "../../types/domain";

export type SessionStep = "attract" | "language" | "form" | "quiz" | "result";

type SessionState = {
  currentStep: SessionStep;
  hasChosenLanguage: boolean;
  language: Language;
  leadData: LeadSubmission | null;
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  score: number;
  quizCompleted: boolean;
};

type SessionStore = {
  state: SessionState;
  setCurrentStep: (step: SessionStep) => void;
  enterLanguage: () => void;
  enterForm: (language: Language) => void;
  setLeadData: (leadData: LeadSubmission) => void;
  submitAnswer: (answer: QuizAnswer) => void;
  goToNextQuestion: (totalQuestions: number) => void;
  finishQuiz: (totalQuestions: number) => void;
  resetSession: () => void;
};

const initialState: SessionState = {
  currentStep: "attract",
  hasChosenLanguage: false,
  language: "pt",
  leadData: null,
  currentQuestionIndex: 0,
  answers: [],
  score: 0,
  quizCompleted: false,
};

const SessionContext = createContext<SessionStore | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(initialState);

  const setCurrentStep = useCallback((step: SessionStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const enterLanguage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: "language",
    }));
  }, []);

  const enterForm = useCallback((language: Language) => {
    setState((prev) => ({
      ...prev,
      language,
      hasChosenLanguage: true,
      currentStep: "form",
    }));
  }, []);

  const setLeadData = useCallback((leadData: LeadSubmission) => {
    setState((prev) => ({
      ...prev,
      leadData,
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      quizCompleted: false,
    }));
  }, []);

  const submitAnswer = useCallback((answer: QuizAnswer) => {
    setState((prev) => {
      const existing = prev.answers.find((item) => item.questionId === answer.questionId);
      if (existing) return prev;

      return {
        ...prev,
        answers: [...prev.answers, answer],
        score: prev.score + (answer.isCorrect ? 1 : 0),
      };
    });
  }, []);

  const goToNextQuestion = useCallback((totalQuestions: number) => {
    setState((prev) => {
      const nextIndex = prev.currentQuestionIndex + 1;
      if (nextIndex >= totalQuestions) {
        return prev;
      }

      return { ...prev, currentQuestionIndex: nextIndex };
    });
  }, []);

  const finishQuiz = useCallback((totalQuestions: number) => {
    setState((prev) => {
      if (!prev.leadData || prev.answers.length < totalQuestions) {
        return prev;
      }

      return { ...prev, quizCompleted: true, currentStep: "result" };
    });
  }, []);

  const resetSession = useCallback(() => {
    setState(initialState);
  }, []);

  const value = useMemo<SessionStore>(
    () => ({
      state,
      setCurrentStep,
      enterLanguage,
      enterForm,
      setLeadData,
      submitAnswer,
      goToNextQuestion,
      finishQuiz,
      resetSession,
    }),
    [
      state,
      setCurrentStep,
      enterLanguage,
      enterForm,
      setLeadData,
      submitAnswer,
      goToNextQuestion,
      finishQuiz,
      resetSession,
    ],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSessionStore() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionStore must be used within SessionProvider");
  }
  return context;
}
