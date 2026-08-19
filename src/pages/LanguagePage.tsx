import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { kioskCardEnterUp } from "../animations/kioskKeyframes";
import { StitchGlobeIcon, StitchLanguageIcon } from "../components/icons/LanguageScreenIcons";
import { KioskHeader } from "../components/kiosk/KioskHeader";
import { KioskScreen } from "../components/kiosk/KioskScreen";
import { MEDIA_ASSETS } from "../config/mediaAssets";
import { ShimmerOverlay } from "../components/motion/ShimmerOverlay";
import { ROUTES } from "../config/routes";
import { useSessionStore } from "../features/session/useSessionStore";
import { FONT_DIDOT } from "../theme/appTheme";
import { mediaNoReducedMotion, mediaReducedMotion, motion } from "../theme/motion";

export function LanguagePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { enterForm } = useSessionStore();
  const [pressing, setPressing] = useState<"pt" | "en" | null>(null);

  const selectLanguage = async (lang: "pt" | "en") => {
    await i18n.changeLanguage(lang);
    enterForm(lang);
    navigate(ROUTES.form);
  };

  return (
    <KioskScreen header={<KioskHeader logoSize="standard" />} backdropSrc={MEDIA_ASSETS.stageLanguage}>
      <Stack
        spacing={2}
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          maxWidth: "min(760px, 88vw)",
          mx: "auto",
          px: 2,
          py: 1,
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Box component="header" sx={{ textAlign: "center", flexShrink: 0 }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: FONT_DIDOT,
              fontWeight: 400,
              fontSize: "clamp(1.85rem, 3.5dvh, 2.75rem)",
              lineHeight: 1.08,
              letterSpacing: "0.01em",
            }}
          >
            {t("languageHeroPrimary")}
          </Typography>
          <Typography
            sx={{
              mt: 0.75,
              fontFamily: FONT_DIDOT,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(1.1rem, 2.2dvh, 1.5rem)",
              lineHeight: 1.2,
              opacity: 0.45,
              letterSpacing: "-0.02em",
            }}
          >
            {t("languageHeroSecondary")}
          </Typography>
        </Box>

        <Stack spacing={1.75} sx={{ width: "100%", flex: 1, minHeight: 0, justifyContent: "center" }}>
          <LanguageChoiceCard
            icon={<StitchGlobeIcon />}
            watermark="PT"
            title={t("languagePt")}
            subtitle={t("languagePtSubtitle")}
            onClick={() => void selectLanguage("pt")}
            variant="pt"
            enterDelayMs={0}
            shimmerDelaySec={0.35}
            isPressing={pressing === "pt"}
            onPressStart={() => setPressing("pt")}
            onPressEnd={() => setPressing(null)}
          />
          <LanguageChoiceCard
            icon={<StitchLanguageIcon />}
            watermark="EN"
            title={t("languageEn")}
            subtitle={t("languageEnSubtitle")}
            onClick={() => void selectLanguage("en")}
            variant="en"
            enterDelayMs={140}
            shimmerDelaySec={1.25}
            isPressing={pressing === "en"}
            onPressStart={() => setPressing("en")}
            onPressEnd={() => setPressing(null)}
          />
        </Stack>
      </Stack>
    </KioskScreen>
  );
}

type LanguageChoiceCardProps = {
  icon: ReactNode;
  watermark: string;
  title: string;
  subtitle: string;
  onClick: () => void;
  variant: "pt" | "en";
  enterDelayMs: number;
  shimmerDelaySec: number;
  isPressing: boolean;
  onPressStart: () => void;
  onPressEnd: () => void;
};

function LanguageChoiceCard({
  icon,
  watermark,
  title,
  subtitle,
  onClick,
  variant,
  enterDelayMs,
  shimmerDelaySec,
  isPressing,
  onPressStart,
  onPressEnd,
}: LanguageChoiceCardProps) {
  const glass =
    variant === "pt"
      ? "linear-gradient(155deg, rgba(205,153,65,0.2) 0%, rgba(10,10,10,0.92) 100%)"
      : "linear-gradient(155deg, rgba(205,153,65,0.12) 0%, rgba(18,18,18,0.9) 100%)";

  return (
    <ButtonBase
      onClick={onClick}
      onPointerDown={onPressStart}
      onPointerUp={onPressEnd}
      onPointerCancel={onPressEnd}
      onPointerLeave={onPressEnd}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: "min(760px, 88vw)",
        mx: "auto",
        minHeight: "clamp(220px, 20dvh, 320px)",
        maxHeight: "clamp(240px, 22dvh, 340px)",
        borderRadius: 3,
        overflow: "hidden",
        textAlign: "left",
        alignItems: "stretch",
        px: 3,
        py: 2.5,
        border: "1px solid rgba(255,255,255,0.1)",
        background: glass,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
        transition: `transform ${motion.durationFast}ms ${motion.easingOut}, border-color ${motion.duration}ms ease`,
        transform: isPressing ? "scale(0.97)" : "scale(1)",
        [mediaNoReducedMotion]: {
          animation: `${kioskCardEnterUp} 520ms cubic-bezier(0.22, 1, 0.36, 1) both`,
          animationDelay: `${enterDelayMs}ms`,
        },
        [mediaReducedMotion]: { animation: "none" },
        "@media (hover: hover) and (pointer: fine)": {
          "&:hover": {
            borderColor: "rgba(205,153,65,0.45)",
          },
        },
        "&:active": { transform: "scale(0.97)" },
      }}
    >
      <ShimmerOverlay cycleSec={8.5} delaySec={shimmerDelaySec} />
      <Typography
        sx={{
          position: "absolute",
          right: 4,
          bottom: -6,
          fontSize: "clamp(4rem, 12dvh, 7rem)",
          fontWeight: 900,
          lineHeight: 1,
          opacity: 0.1,
          letterSpacing: "-0.04em",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {watermark}
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ position: "relative", zIndex: 1, width: "100%" }}>
        <Box
          sx={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& svg": {
              fontSize: "clamp(44px, 4dvh, 72px)",
              width: "clamp(44px, 4dvh, 72px)",
              height: "clamp(44px, 4dvh, 72px)",
            },
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: "clamp(1.8rem, 3dvh, 2.6rem)", fontWeight: 800, lineHeight: 1.1 }}>{title}</Typography>
          <Typography
            sx={{
              mt: 1,
              fontSize: "clamp(1.05rem, 2dvh, 1.35rem)",
              fontWeight: 500,
              lineHeight: 1.35,
              opacity: 0.82,
              color: "rgba(247,242,234,0.95)",
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Stack>
    </ButtonBase>
  );
}
