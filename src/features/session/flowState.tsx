import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type FlowStep = "attract" | "language" | "form" | "quiz" | "result";

type FlowState = {
  languageSelected: boolean;
  formCompleted: boolean;
  quizCompleted: boolean;
};

type FlowContextValue = {
  state: FlowState;
  canAccess: (step: FlowStep) => boolean;
  markLanguageSelected: () => void;
  markFormCompleted: () => void;
  markQuizCompleted: () => void;
  resetFlow: () => void;
};

const initialState: FlowState = {
  languageSelected: false,
  formCompleted: false,
  quizCompleted: false,
};

const FlowContext = createContext<FlowContextValue | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FlowState>(initialState);

  const canAccess = useCallback(
    (step: FlowStep) => {
      if (step === "attract" || step === "language") return true;
      if (step === "form") return state.languageSelected;
      if (step === "quiz") return state.languageSelected && state.formCompleted;
      if (step === "result") {
        return state.languageSelected && state.formCompleted && state.quizCompleted;
      }
      return false;
    },
    [state],
  );

  const markLanguageSelected = useCallback(
    () => setState((prev) => ({ ...prev, languageSelected: true })),
    [],
  );
  const markFormCompleted = useCallback(
    () => setState((prev) => ({ ...prev, formCompleted: true })),
    [],
  );
  const markQuizCompleted = useCallback(
    () => setState((prev) => ({ ...prev, quizCompleted: true })),
    [],
  );
  const resetFlow = useCallback(() => setState(initialState), []);

  const value = useMemo<FlowContextValue>(
    () => ({
      state,
      canAccess,
      markLanguageSelected,
      markFormCompleted,
      markQuizCompleted,
      resetFlow,
    }),
    [
      state,
      canAccess,
      markLanguageSelected,
      markFormCompleted,
      markQuizCompleted,
      resetFlow,
    ],
  );

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFlowState() {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlowState must be used within FlowProvider");
  }
  return context;
}
