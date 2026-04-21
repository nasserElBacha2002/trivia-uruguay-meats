import { Box, Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ScreenCard } from "../components/ScreenCard";
import { ROUTES } from "../config/routes";

export function AttractPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <ScreenCard title={t("attractTitle")} subtitle={t("attractSubtitle")}>
      <Stack justifyContent="space-between" height="100%">
        <Box
          sx={{
            flex: 1,
            borderRadius: 3,
            background:
              "linear-gradient(140deg, rgba(0,47,108,0.95) 0%, rgba(0,47,108,0.75) 65%, rgba(255,184,28,0.8) 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <Typography variant="h4" align="center" maxWidth={720}>
            Boutique de carnes do mundo
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center" pt={3}>
          <Button size="large" onClick={() => navigate(ROUTES.language)}>
            {t("startAction")}
          </Button>
        </Box>
      </Stack>
    </ScreenCard>
  );
}
