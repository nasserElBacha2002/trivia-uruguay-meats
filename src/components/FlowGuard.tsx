import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../config/routes";
import { useFlowState, type FlowStep } from "../features/session/flowState";

type FlowGuardProps = {
  step: FlowStep;
  children: ReactNode;
};

export function FlowGuard({ step, children }: FlowGuardProps) {
  const { canAccess } = useFlowState();

  if (!canAccess(step)) {
    return <Navigate to={ROUTES.attract} replace />;
  }

  return <>{children}</>;
}
