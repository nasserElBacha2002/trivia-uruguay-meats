import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { StitchGlobeIcon, StitchLanguageIcon } from "../components/icons/LanguageScreenIcons";
import { KioskRightOcclusion } from "../components/layout/KioskRightOcclusion";
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
    <Box sx={{ position: "relative", height: "100%", width: "100%", overflow: "hidden" }}>
      <KioskRightOcclusion zIndex={0} />

      <Stack
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          minHeight: 0,
          px: { xs: 1.5, md: 3, lg: 5 },
          pt: { xs: 2, md: 3 },
          pb: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            maxWidth: 980,
            mx: "auto",
            width: "100%",
            pt: { xs: 1, md: 2 },
            pb: { xs: 2.5, md: 4 },
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2.65rem", sm: "3.6rem", md: "4.75rem", lg: "5.35rem" },
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            {t("languageHeroPrimary")}
            <br />
            <Box
              component="span"
              sx={{
                display: "inline-block",
                mt: { xs: 0.75, md: 1 },
                fontWeight: 400,
                fontSize: { xs: "1.55rem", sm: "2rem", md: "2.65rem", lg: "2.85rem" },
                lineHeight: 1.15,
                opacity: 0.4,
                letterSpacing: "-0.02em",
              }}
            >
              {t("languageHeroSecondary")}
            </Box>
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 2.5, md: 3.5 }}
          sx={{
            flex: 1,
            minHeight: 0,
            width: "100%",
            maxWidth: 1180,
            mx: "auto",
            alignItems: "stretch",
            justifyContent: "center",
            pb: { xs: 1, md: 2 },
          }}
        >
          <LanguageChoiceCard
            icon={<StitchGlobeIcon />}
            watermark="PT"
            title={t("languagePt")}
            subtitle={t("languagePtSubtitle")}
            onClick={() => void selectLanguage("pt")}
            variant="pt"
          />
          <LanguageChoiceCard
            icon={<StitchLanguageIcon />}
            watermark="EN"
            title={t("languageEn")}
            subtitle={t("languageEnSubtitle")}
            onClick={() => void selectLanguage("en")}
            variant="en"
          />
        </Stack>

        <Box
          sx={{
            px: { xs: 1, md: 2 },
            pt: { xs: 1, md: 0 },
            pb: { xs: 0.5, md: 0 },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Box sx={{ width: 32, height: 4, bgcolor: "secondary.main", borderRadius: 999 }} />
            <Typography
              sx={{
                fontSize: "0.72rem",
                letterSpacing: "0.22em",
                opacity: 0.42,
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              {t("languageFooterStrip")}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

type LanguageChoiceCardProps = {
  icon: ReactNode;
  watermark: string;
  title: string;
  subtitle: string;
  onClick: () => void;
  variant: "pt" | "en";
};

function LanguageChoiceCard({ icon, watermark, title, subtitle, onClick, variant }: LanguageChoiceCardProps) {
  const glass =
    variant === "pt"
      ? "linear-gradient(155deg, rgba(0,47,108,0.82) 0%, rgba(0,27,68,0.88) 100%)"
      : "linear-gradient(155deg, rgba(0,47,108,0.55) 0%, rgba(22,22,22,0.82) 100%)";

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        position: "relative",
        flex: 1,
        borderRadius: 3,
        overflow: "hidden",
        textAlign: "left",
        alignItems: "stretch",
        minHeight: { xs: 260, md: 320 },
        px: { xs: 2.75, md: 4 },
        py: { xs: 2.75, md: 4 },
        border: "1px solid rgba(255,255,255,0.08)",
        background: glass,
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
        transition: "transform 160ms ease, background 200ms ease, border-color 200ms ease",
        "&:hover": {
          background:
            variant === "pt"
              ? "linear-gradient(155deg, rgba(0,47,108,0.95) 0%, rgba(0,27,68,0.92) 100%)"
              : "linear-gradient(155deg, rgba(0,47,108,0.72) 0%, rgba(22,22,22,0.88) 100%)",
          borderColor: "rgba(255,184,28,0.35)",
        },
        "&:active": { transform: "scale(0.985)" },
      }}
    >
      <Typography
        sx={{
          position: "absolute",
          right: -6,
          bottom: -10,
          fontSize: { xs: "5.5rem", md: "7.25rem" },
          fontWeight: 900,
          lineHeight: 1,
          opacity: 0.14,
          letterSpacing: "-0.04em",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {watermark}
      </Typography>

      <Stack sx={{ position: "relative", zIndex: 1, height: "100%", width: "100%", minHeight: { xs: 220, md: 280 } }}>
        <Box sx={{ mb: "auto" }}>{icon}</Box>
        <Box sx={{ mt: "auto", pr: { xs: 5, md: 7 } }}>
          <Typography sx={{ fontSize: { xs: "1.85rem", md: "2.5rem" }, fontWeight: 700, lineHeight: 1.15 }}>
            {title}
          </Typography>
          <Typography
            sx={{
              mt: 1,
              fontSize: { xs: "1.02rem", md: "1.18rem" },
              fontWeight: 500,
              lineHeight: 1.35,
              opacity: 0.78,
              color: "rgba(229,226,225,0.92)",
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Stack>
    </ButtonBase>
  );
}
