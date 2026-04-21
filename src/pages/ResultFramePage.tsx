import { Button, Chip, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ScreenCard } from "../components/ScreenCard";
import { ROUTES } from "../config/routes";
import { quizContent } from "../mocks/quizContent";
import { useSessionStore } from "../features/session/useSessionStore";

export function ResultFramePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, resetSession } = useSessionStore();
  const score = state.score;

  const resultBand = score >= 5 ? "high" : score >= 3 ? "medium" : "low";
  const scoreLabelKey =
    resultBand === "high"
      ? "scoreBandHigh"
      : resultBand === "medium"
        ? "scoreBandMedium"
        : "scoreBandLow";

  const restart = () => {
    resetSession();
    navigate(ROUTES.attract);
  };

  return (
    <ScreenCard title={t(scoreLabelKey)}>
      <Stack height="100%" justifyContent="space-between">
        <Stack gap={2}>
          <Chip
            label={`${t(scoreLabelKey)} (${score}/${quizContent.totalQuestions})`}
            color="secondary"
            sx={{ alignSelf: "flex-start", fontSize: "1rem", px: 1 }}
          />
          <Typography variant="h5">
            {quizContent.finalResults[resultBand]}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {quizContent.closingMessage}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
          <Button onClick={restart}>{t("finishAndRestartLabel")}</Button>
        </Stack>
      </Stack>
    </ScreenCard>
  );
}
