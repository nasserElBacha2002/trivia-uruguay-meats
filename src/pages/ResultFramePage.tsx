import { Button, Chip, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ScreenCard } from "../components/ScreenCard";
import { ROUTES } from "../config/routes";

export function ResultFramePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <ScreenCard title={t("resultTitle")} subtitle="Fase estática: estrutura de resultado por faixa">
      <Stack height="100%" justifyContent="space-between">
        <Stack gap={2}>
          <Chip
            label="Desempenho ALTO (5-6)"
            color="secondary"
            sx={{ alignSelf: "flex-start", fontSize: "1rem", px: 1 }}
          />
          <Typography variant="h5">
            Você conhece bem o cordeiro uruguaio! Retire seu brinde.
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="flex-end">
          <Button onClick={() => navigate(ROUTES.attract)}>Finalizar e reiniciar</Button>
        </Stack>
      </Stack>
    </ScreenCard>
  );
}
