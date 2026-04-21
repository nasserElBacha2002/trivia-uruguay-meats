import { Navigate, createBrowserRouter } from "react-router-dom";
import { FlowGuard } from "../components/FlowGuard";
import { KioskShell } from "../components/KioskShell";
import { ROUTES } from "../config/routes";
import { AttractPage } from "../pages/AttractPage";
import { FormPage } from "../pages/FormPage";
import { LanguagePage } from "../pages/LanguagePage";
import { QuizFramePage } from "../pages/QuizFramePage";
import { ResultFramePage } from "../pages/ResultFramePage";

export const appRouter = createBrowserRouter([
  {
    path: ROUTES.attract,
    element: <KioskShell />,
    children: [
      { index: true, element: <AttractPage /> },
      {
        path: ROUTES.language.slice(1),
        element: (
          <FlowGuard step="language">
            <LanguagePage />
          </FlowGuard>
        ),
      },
      {
        path: ROUTES.form.slice(1),
        element: (
          <FlowGuard step="form">
            <FormPage />
          </FlowGuard>
        ),
      },
      {
        path: ROUTES.quiz.slice(1),
        element: (
          <FlowGuard step="quiz">
            <QuizFramePage />
          </FlowGuard>
        ),
      },
      {
        path: ROUTES.result.slice(1),
        element: (
          <FlowGuard step="result">
            <ResultFramePage />
          </FlowGuard>
        ),
      },
      { path: "*", element: <Navigate to={ROUTES.attract} replace /> },
    ],
  },
]);
