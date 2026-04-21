import { Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ScreenCard } from "../components/ScreenCard";
import { ROUTES } from "../config/routes";

export function LanguagePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const selectLanguage = async (lang: "pt" | "en") => {
    await i18n.changeLanguage(lang);
    navigate(ROUTES.form);
  };

  return (
    <ScreenCard title={t("languageTitle")}>
      <Stack direction="row" spacing={3} justifyContent="center" mt={4}>
        <Button variant="contained" size="large" onClick={() => void selectLanguage("pt")}>
          {t("languagePt")}
        </Button>
        <Button variant="outlined" size="large" onClick={() => void selectLanguage("en")}>
          {t("languageEn")}
        </Button>
      </Stack>
    </ScreenCard>
  );
}
