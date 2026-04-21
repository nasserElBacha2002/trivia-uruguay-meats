import { Box, Button, Stack, Typography } from "@mui/material";
import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ScreenCard } from "../components/ScreenCard";
import { ROUTES } from "../config/routes";
import { getQuizContent } from "../content/quizContent";
import { useSessionStore } from "../features/session/useSessionStore";

export function AttractPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { state, resetSession, enterLanguage } = useSessionStore();
  const quizContent = getQuizContent("pt");

  const shouldResetSession =
    state.currentStep !== "attract" ||
    state.hasChosenLanguage ||
    state.leadData !== null ||
    state.currentQuestionIndex !== 0 ||
    state.answers.length > 0 ||
    state.score > 0 ||
    state.quizCompleted ||
    state.language !== "pt";

  useLayoutEffect(() => {
    void i18n.changeLanguage("pt");
  }, [i18n]);

  useLayoutEffect(() => {
    if (!shouldResetSession) return;
    resetSession();
  }, [resetSession, shouldResetSession]);

  return (
    <ScreenCard>
      <Stack justifyContent="space-between" height="100%" gap={4}>
        <Box
          sx={{
            flex: 1,
            borderRadius: 4,
            background:
              "linear-gradient(125deg, rgba(0,47,108,0.96) 0%, rgba(15,74,153,0.8) 48%, rgba(255,184,28,0.82) 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 3, md: 6 },
            border: "1px solid rgba(229,226,225,0.16)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          <Stack spacing={2.5} alignItems="center">
            <Typography variant="h3" align="center" maxWidth={900}>
              {quizContent.title}
            </Typography>
            <Typography variant="h6" align="center" maxWidth={860} sx={{ opacity: 0.95 }}>
              {quizContent.subtitle}
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            size="large"
            variant="contained"
            onClick={() => {
              enterLanguage();
              navigate(ROUTES.language);
            }}
          >
            {quizContent.ctaLabel}
          </Button>
        </Box>
      </Stack>
    </ScreenCard>
  );
}
