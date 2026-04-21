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
  language: Language;
  leadData: LeadSubmission | null;
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  score: number;
};

type SessionStore = {
  state: SessionState;
  setLanguage: (language: Language) => void;
  setCurrentStep: (step: SessionStep) => void;
  setLeadData: (leadData: LeadSubmission) => void;
  submitAnswer: (answer: QuizAnswer) => void;
  goToNextQuestion: (totalQuestions: number) => void;
  finishQuiz: () => void;
  resetSession: () => void;
  canAccessStep: (step: SessionStep) => boolean;
};

const initialState: SessionState = {
  currentStep: "attract",
  language: "pt",
  leadData: null,
  currentQuestionIndex: 0,
  answers: [],
  score: 0,
};

const SessionContext = createContext<SessionStore | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(initialState);

  const canAccessStep = useCallback(
    (step: SessionStep) => {
      if (step === "attract" || step === "language") return true;
      if (step === "form") return state.currentStep !== "attract";
      if (step === "quiz") return Boolean(state.leadData);
      if (step === "result") return state.answers.length > 0 && state.currentStep === "result";
      return false;
    },
    [state],
  );

  const setLanguage = useCallback((language: Language) => {
    setState((prev) => ({
      ...prev,
      language,
      currentStep: "form",
    }));
  }, []);

  const setCurrentStep = useCallback((step: SessionStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const setLeadData = useCallback((leadData: LeadSubmission) => {
    setState((prev) => ({
      ...prev,
      leadData,
      currentStep: "quiz",
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
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
        return { ...prev, currentStep: "result" };
      }

      return { ...prev, currentQuestionIndex: nextIndex };
    });
  }, []);

  const finishQuiz = useCallback(() => {
    setState((prev) => ({ ...prev, currentStep: "result" }));
  }, []);

  const resetSession = useCallback(() => {
    setState(initialState);
  }, []);

  const value = useMemo<SessionStore>(
    () => ({
      state,
      setLanguage,
      setCurrentStep,
      setLeadData,
      submitAnswer,
      goToNextQuestion,
      finishQuiz,
      resetSession,
      canAccessStep,
    }),
    [
      state,
      setLanguage,
      setCurrentStep,
      setLeadData,
      submitAnswer,
      goToNextQuestion,
      finishQuiz,
      resetSession,
      canAccessStep,
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
