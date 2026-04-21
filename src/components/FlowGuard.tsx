import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../config/routes";
import { useSessionStore, type SessionStep } from "../features/session/useSessionStore";

type FlowGuardProps = {
  step: SessionStep;
  children: ReactNode;
};

export function FlowGuard({ step, children }: FlowGuardProps) {
  const { canAccessStep } = useSessionStore();

  if (!canAccessStep(step)) {
    return <Navigate to={ROUTES.attract} replace />;
  }

  return <>{children}</>;
}
