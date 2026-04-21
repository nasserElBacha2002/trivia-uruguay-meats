import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../config/routes";
import { useSessionStore } from "../features/session/useSessionStore";

export function LanguagePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { enterForm } = useSessionStore();

  const selectLanguage = async (lang: "pt" | "en") => {
    await i18n.changeLanguage(lang);
    enterForm(lang);
    navigate(ROUTES.form);
  };

  return (
    <Stack
      justifyContent="space-between"
      height="100%"
      sx={{ position: "relative", px: { xs: 0.5, md: 2 }, py: { xs: 1.5, md: 2.5 } }}
    >
      <Box
        sx={{
          position: "absolute",
          top: { xs: -90, md: -130 },
          right: { xs: -120, md: -170 },
          width: { xs: 280, md: 430 },
          height: { xs: 280, md: 430 },
          borderRadius: "50%",
          background: "rgba(17,88,194,0.35)",
          filter: "blur(38px)",
          pointerEvents: "none",
        }}
      />
      <Box sx={{ maxWidth: 1040, mt: { xs: 2, md: 5 }, px: { xs: 1, md: 2 } }}>
        <Typography
          sx={{
            fontWeight: 700,
            letterSpacing: "0.14em",
            fontSize: { xs: "0.75rem", md: "0.83rem" },
            opacity: 0.62,
            textTransform: "uppercase",
            mb: 2,
          }}
        >
          Select Language
        </Typography>
        <Typography sx={{ fontSize: { xs: "2.2rem", md: "4.4rem" }, lineHeight: 1.04, fontWeight: 700 }}>
          {t("languageTitle")}
        </Typography>
        <Typography sx={{ mt: 1.2, fontSize: { xs: "1rem", md: "1.45rem" }, opacity: 0.72 }}>
          {t("languageSubtitle")}
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ px: { xs: 1, md: 2 }, mt: 3 }}>
        <ButtonBase
          onClick={() => void selectLanguage("pt")}
          sx={{
            flex: 1,
            borderRadius: 3.5,
            overflow: "hidden",
            border: "1px solid rgba(229,226,225,0.12)",
            background: "linear-gradient(155deg, rgba(0,47,108,0.88) 0%, rgba(5,35,82,0.9) 100%)",
            minHeight: { xs: 235, md: 340 },
            px: { xs: 2.5, md: 4.2 },
            py: { xs: 2.5, md: 4 },
            textAlign: "left",
            alignItems: "stretch",
            boxShadow: "0 24px 62px rgba(0,0,0,0.34)",
          }}
        >
          <Stack sx={{ width: "100%", justifyContent: "space-between" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Typography sx={{ fontSize: { xs: "2.2rem", md: "2.8rem" }, color: "secondary.main" }}>◉</Typography>
              <Typography sx={{ fontSize: { xs: "3rem", md: "5rem" }, opacity: 0.18, fontWeight: 700 }}>PT</Typography>
            </Stack>
            <Box>
              <Typography sx={{ fontSize: { xs: "2rem", md: "2.7rem" }, fontWeight: 700 }}>{t("languagePt")}</Typography>
              <Typography sx={{ mt: 0.6, fontSize: { xs: "1rem", md: "1.2rem" }, opacity: 0.74 }}>
                {t("languagePtSubtitle")}
              </Typography>
            </Box>
          </Stack>
        </ButtonBase>

        <ButtonBase
          onClick={() => void selectLanguage("en")}
          sx={{
            flex: 1,
            borderRadius: 3.5,
            overflow: "hidden",
            border: "1px solid rgba(229,226,225,0.16)",
            background: "linear-gradient(150deg, rgba(34,33,33,0.84) 0%, rgba(0,27,68,0.68) 100%)",
            minHeight: { xs: 235, md: 340 },
            px: { xs: 2.5, md: 4.2 },
            py: { xs: 2.5, md: 4 },
            textAlign: "left",
            alignItems: "stretch",
            boxShadow: "0 24px 62px rgba(0,0,0,0.34)",
          }}
        >
          <Stack sx={{ width: "100%", justifyContent: "space-between" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Typography sx={{ fontSize: { xs: "2.2rem", md: "2.8rem" }, color: "secondary.main" }}>◎</Typography>
              <Typography sx={{ fontSize: { xs: "3rem", md: "5rem" }, opacity: 0.2, fontWeight: 700 }}>EN</Typography>
            </Stack>
            <Box>
              <Typography sx={{ fontSize: { xs: "2rem", md: "2.7rem" }, fontWeight: 700 }}>{t("languageEn")}</Typography>
              <Typography sx={{ mt: 0.6, fontSize: { xs: "1rem", md: "1.2rem" }, opacity: 0.74 }}>
                {t("languageEnSubtitle")}
              </Typography>
            </Box>
          </Stack>
        </ButtonBase>
      </Stack>

      <Box sx={{ px: { xs: 1, md: 2 }, mb: { xs: 1, md: 2 } }}>
        <Typography sx={{ fontSize: "0.74rem", letterSpacing: "0.2em", opacity: 0.45, textTransform: "uppercase" }}>
          Premium Interactive Kiosk
        </Typography>
      </Box>
    </Stack>
  );
}
