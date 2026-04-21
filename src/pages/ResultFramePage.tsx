import { Box, Button, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ScreenCard } from "../components/ScreenCard";
import { ROUTES } from "../config/routes";
import { getQuizContent } from "../content/quizContent";
import { useSessionStore } from "../features/session/useSessionStore";

export function ResultFramePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, resetSession } = useSessionStore();
  const score = state.score;
  const quizContent = getQuizContent(state.language);

  const resultBand = score >= 5 ? "high" : score >= 3 ? "medium" : "low";
  const scoreLabelKey =
    resultBand === "high"
      ? "scoreBandHigh"
      : resultBand === "medium"
        ? "scoreBandMedium"
        : "scoreBandLow";

  const bandColor =
    resultBand === "high" ? "success" : resultBand === "medium" ? "warning" : "error";

  const restart = () => {
    resetSession();
    navigate(ROUTES.attract);
  };

  return (
    <ScreenCard>
      <Stack height="100%" justifyContent="space-between" gap={3}>
        <Stack gap={2.75}>
          <Box>
            <Typography variant="overline" sx={{ letterSpacing: 1.2, opacity: 0.85 }}>
              {t("resultEyebrow")}
            </Typography>
            <Typography variant="h3" sx={{ mt: 0.75, fontWeight: 900, lineHeight: 1.05 }}>
              {t(scoreLabelKey)}
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", md: "row" }} gap={2} alignItems={{ xs: "stretch", md: "center" }}>
            <Chip
              label={`${t("resultScoreLabel")}: ${score}/${quizContent.totalQuestions}`}
              color="secondary"
              sx={{ alignSelf: { xs: "flex-start", md: "center" }, fontSize: "1rem", px: 1, py: 2.25 }}
            />
            <Chip
              label={`${t("resultBandLabel")}: ${t(scoreLabelKey)}`}
              color={bandColor}
              variant="outlined"
              sx={{ alignSelf: { xs: "flex-start", md: "center" }, fontSize: "1rem", px: 1, py: 2.25 }}
            />
          </Stack>

          <Divider sx={{ borderColor: "rgba(229,226,225,0.12)" }} />

          <Stack gap={1.25}>
            <Typography variant="overline" sx={{ letterSpacing: 1.1, opacity: 0.85 }}>
              {t("resultMainMessageLabel")}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {quizContent.finalResults[resultBand]}
            </Typography>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              p: 2.5,
              border: "1px solid rgba(229,226,225,0.12)",
              background: "linear-gradient(135deg, rgba(0,47,108,0.22) 0%, rgba(19,19,19,0.55) 70%)",
            }}
          >
            <Typography variant="overline" sx={{ letterSpacing: 1.1, opacity: 0.85 }}>
              {t("resultClosingLabel")}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1.25, color: "text.secondary" }}>
              {quizContent.closingMessage}
            </Typography>
          </Paper>
        </Stack>
        <Stack direction="row" justifyContent="flex-end" sx={{ pt: 1 }}>
          <Button variant="contained" size="large" onClick={restart}>
            {t("finishAndRestartLabel")}
          </Button>
        </Stack>
      </Stack>
    </ScreenCard>
  );
}
