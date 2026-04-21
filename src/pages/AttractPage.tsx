import { Box, Button, Stack, Typography } from "@mui/material";
import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
    <Box sx={{ height: "100%", position: "relative", borderRadius: 4, overflow: "hidden" }}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(0,27,68,0.2) 0%, rgba(0,27,68,0.74) 46%, rgba(0,27,68,0.94) 100%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.3,
          backgroundImage:
            "repeating-linear-gradient(120deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 18px)",
        }}
      />

      <Stack
        justifyContent="space-between"
        alignItems="center"
        height="100%"
        gap={4}
        sx={{
          position: "relative",
          zIndex: 2,
          py: { xs: 6, md: 8 },
          px: { xs: 1, md: 4 },
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 1080,
            mt: { xs: 3, md: 6 },
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              letterSpacing: "0.22em",
              opacity: 0.56,
              fontSize: { xs: "0.68rem", md: "0.78rem" },
              textTransform: "uppercase",
            }}
          >
            Uruguay Lamb
          </Typography>
          <Typography
            align="center"
            sx={{
              fontSize: { xs: "2.5rem", md: "4.5rem", lg: "5.15rem" },
              lineHeight: 1.02,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              textShadow: "0 18px 48px rgba(0,0,0,0.45)",
            }}
          >
              {quizContent.title}
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{
              maxWidth: 900,
              opacity: 0.84,
              fontWeight: 400,
              fontSize: { xs: "1.08rem", md: "1.4rem" },
            }}
          >
            {quizContent.subtitle}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: { xs: 3, md: 5 } }}>
          <Button
            size="large"
            variant="contained"
            onClick={() => {
              enterLanguage();
              navigate(ROUTES.language);
            }}
            sx={{
              minWidth: { xs: 280, md: 420 },
              minHeight: { xs: 82, md: 92 },
              borderRadius: 2.6,
              fontSize: { xs: "1.3rem", md: "1.7rem" },
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              boxShadow: "0 26px 70px rgba(0, 27, 68, 0.55)",
            }}
          >
            {quizContent.ctaLabel}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
