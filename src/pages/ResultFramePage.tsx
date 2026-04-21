import { Button, Chip, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ScreenCard } from "../components/ScreenCard";
import { ROUTES } from "../config/routes";
import { quizPtContent } from "../content/quizContent";
import { useFlowState } from "../features/session/flowState";

export function ResultFramePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resetFlow } = useFlowState();

  const restart = () => {
    resetFlow();
    navigate(ROUTES.attract);
  };

  return (
    <ScreenCard title={t("scoreBandHigh")}>
      <Stack height="100%" justifyContent="space-between">
        <Stack gap={2}>
          <Chip
            label={t("scoreBandHigh")}
            color="secondary"
            sx={{ alignSelf: "flex-start", fontSize: "1rem", px: 1 }}
          />
          <Typography variant="h5">
            {quizPtContent.finalResults.high}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {quizPtContent.closingMessage}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
          <Button onClick={restart}>{t("finishAndRestartLabel")}</Button>
        </Stack>
      </Stack>
    </ScreenCard>
  );
}
