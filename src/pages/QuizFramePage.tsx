import { Button, LinearProgress, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ScreenCard } from "../components/ScreenCard";
import { ROUTES } from "../config/routes";

export function QuizFramePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <ScreenCard title={t("quizTitle", { current: 2, total: 6 })}>
      <Stack gap={4} height="100%">
        <LinearProgress
          variant="determinate"
          value={(2 / 6) * 100}
          sx={{ height: 12, borderRadius: 99 }}
        />
        <Typography variant="h5">
          O que e Uruguay Lamb?
        </Typography>

        <ToggleButtonGroup exclusive orientation="vertical" fullWidth color="primary">
          <ToggleButton value="a">Uma empresa exportadora</ToggleButton>
          <ToggleButton value="b">Uma marca de promocao do cordeiro uruguaio</ToggleButton>
          <ToggleButton value="c">Um tipo de corte de carne</ToggleButton>
        </ToggleButtonGroup>

        <Stack direction="row" justifyContent="flex-end" mt="auto">
          <Button onClick={() => navigate(ROUTES.result)}>Responder</Button>
        </Stack>
      </Stack>
    </ScreenCard>
  );
}
