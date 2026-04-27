import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BrandLogo } from "../components/BrandLogo";
import { StitchGlobeIcon, StitchLanguageIcon } from "../components/icons/LanguageScreenIcons";
import { KioskLayout } from "../components/layout/KioskLayout";
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
    <Box sx={{ position: "relative", height: "100%", width: "100%", minHeight: 0, overflow: "hidden" }}>
      <KioskRightOcclusion zIndex={0} />

      <KioskLayout
        header={<BrandLogo prominence="standard" />}
        rootSx={{ position: "relative", zIndex: 1, height: "100%", maxHeight: "100%" }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1040,
            mx: "auto",
            flex: "1 1 0%",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: "clamp(1.65rem, 4.8vw, 2.85rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              textAlign: "center",
              flexShrink: 0,
              mb: 1.25,
            }}
          >
            {t("languageHeroPrimary")}
            <br />
            <Box
              component="span"
              sx={{
                display: "inline-block",
                mt: 0.5,
                fontWeight: 400,
                fontSize: "clamp(0.95rem, 2.6vw, 1.45rem)",
                lineHeight: 1.15,
                opacity: 0.42,
                letterSpacing: "-0.02em",
              }}
            >
              {t("languageHeroSecondary")}
            </Box>
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1.5, sm: 2 }}
            sx={{
              flex: "1 1 0%",
              minHeight: 0,
              width: "100%",
              maxWidth: 1100,
              mx: "auto",
              alignItems: "stretch",
              justifyContent: "center",
              overflow: "hidden",
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
        </Box>
      </KioskLayout>
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
      ? "linear-gradient(155deg, rgba(205,153,65,0.18) 0%, rgba(10,10,10,0.92) 100%)"
      : "linear-gradient(155deg, rgba(205,153,65,0.1) 0%, rgba(18,18,18,0.88) 100%)";

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        position: "relative",
        flex: { xs: "1 1 auto", sm: "1 1 0%" },
        minHeight: { xs: 200, sm: 0 },
        maxHeight: { sm: "100%" },
        borderRadius: 3,
        overflow: "hidden",
        textAlign: "left",
        alignItems: "stretch",
        px: { xs: 2, sm: 2.5 },
        py: { xs: 2, sm: 2.25 },
        border: "1px solid rgba(255,255,255,0.08)",
        background: glass,
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
        transition: "transform 160ms ease, background 200ms ease, border-color 200ms ease",
        "&:hover": {
          background:
            variant === "pt"
              ? "linear-gradient(155deg, rgba(205,153,65,0.26) 0%, rgba(8,8,8,0.95) 100%)"
              : "linear-gradient(155deg, rgba(205,153,65,0.16) 0%, rgba(18,18,18,0.92) 100%)",
          borderColor: "rgba(205,153,65,0.4)",
        },
        "&:active": { transform: "scale(0.985)" },
      }}
    >
      <Typography
        sx={{
          position: "absolute",
          right: -4,
          bottom: -8,
          fontSize: "clamp(3.5rem, 14vw, 5.5rem)",
          fontWeight: 900,
          lineHeight: 1,
          opacity: 0.12,
          letterSpacing: "-0.04em",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {watermark}
      </Typography>

      <Stack sx={{ position: "relative", zIndex: 1, height: "100%", width: "100%", minHeight: 0 }}>
        <Box sx={{ mb: "auto", "& svg": { fontSize: "clamp(2rem, 6vw, 2.75rem)" } }}>{icon}</Box>
        <Box sx={{ mt: "auto", pr: { xs: 4, sm: 5 } }}>
          <Typography sx={{ fontSize: "clamp(1.35rem, 3.8vw, 1.95rem)", fontWeight: 700, lineHeight: 1.12 }}>
            {title}
          </Typography>
          <Typography
            sx={{
              mt: 0.75,
              fontSize: "clamp(0.88rem, 2.2vw, 1.05rem)",
              fontWeight: 500,
              lineHeight: 1.32,
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
