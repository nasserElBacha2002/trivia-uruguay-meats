import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ScreenCard } from "../components/ScreenCard";
import { ROUTES } from "../config/routes";
import { useFlowState } from "../features/session/flowState";

export function LanguagePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { markLanguageSelected } = useFlowState();

  const selectLanguage = async (lang: "pt" | "en") => {
    await i18n.changeLanguage(lang);
    markLanguageSelected();
    navigate(ROUTES.form);
  };

  return (
    <ScreenCard title={t("languageTitle")}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={3} justifyContent="center" mt={1}>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            borderRadius: 4,
            border: "1px solid rgba(229,226,225,0.14)",
            p: 3,
            backgroundColor: "rgba(0,47,108,0.28)",
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h5">{t("languagePt")}</Typography>
            <Box>
              <Button fullWidth variant="contained" onClick={() => void selectLanguage("pt")}>
                {t("continueLabel")}
              </Button>
            </Box>
          </Stack>
        </Paper>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            borderRadius: 4,
            border: "1px solid rgba(229,226,225,0.14)",
            p: 3,
            backgroundColor: "rgba(28,27,27,0.72)",
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h5">{t("languageEn")}</Typography>
            <Box>
              <Button fullWidth variant="outlined" onClick={() => void selectLanguage("en")}>
                {t("continueLabel")}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </ScreenCard>
  );
}
