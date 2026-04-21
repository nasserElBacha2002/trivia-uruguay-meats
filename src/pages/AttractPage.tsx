import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ScreenCard } from "../components/ScreenCard";
import { ROUTES } from "../config/routes";
import { getQuizContent } from "../content/quizContent";
import { useSessionStore } from "../features/session/useSessionStore";

export function AttractPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { state, resetSession } = useSessionStore();
  const quizContent = getQuizContent(state.language);

  useEffect(() => {
    resetSession();
    void i18n.changeLanguage("pt");
  }, [resetSession, i18n]);

  return (
    <ScreenCard title={quizContent.title} subtitle={quizContent.subtitle}>
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
              {quizContent.closingMessage}
            </Typography>
            <Typography variant="h6" align="center" maxWidth={860} sx={{ opacity: 0.95 }}>
              {quizContent.objectives.join(" • ")}
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button size="large" variant="contained" onClick={() => navigate(ROUTES.language)}>
            {quizContent.ctaLabel}
          </Button>
        </Box>
      </Stack>
    </ScreenCard>
  );
}
