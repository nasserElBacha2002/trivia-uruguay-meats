import { keyframes } from "@emotion/react";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BrandLogo } from "../components/BrandLogo";
import { KioskFooterBrand, KioskLayout } from "../components/layout/KioskLayout";
import { MEDIA_ASSETS } from "../config/mediaAssets";
import { ROUTES } from "../config/routes";
import { getQuizContent } from "../content/quizContent";
import { useSessionStore } from "../features/session/useSessionStore";
import { BRAND_GOLD } from "../theme/appTheme";
import { mediaNoReducedMotion, mediaReducedMotion, motion } from "../theme/motion";

const attractCtaEnter = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const attractCtaExit = keyframes`
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(4px) scale(0.98); }
`;

const attractCtaIdle = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
`;

export function AttractPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { state, resetSession, enterLanguage } = useSessionStore();
  const quizContent = getQuizContent("pt");
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const [ctaExiting, setCtaExiting] = useState(false);
  const ctaExitStarted = useRef(false);

  const shouldResetSession =
    state.currentStep !== "attract" ||
    state.hasChosenLanguage ||
    state.leadData !== null ||
    state.currentQuestionIndex !== 0 ||
    state.answers.length > 0 ||
    state.score > 0 ||
    state.quizCompleted ||
    state.language !== "pt";

  useLayoutEffect(() => {
    void i18n.changeLanguage("pt");
  }, [i18n]);

  useLayoutEffect(() => {
    if (!shouldResetSession) return;
    resetSession();
  }, [resetSession, shouldResetSession]);

  const attractFooter = (
    <Stack
      direction="row"
      flexWrap="wrap"
      alignItems="center"
      justifyContent="center"
      spacing={1.5}
      sx={{ width: "100%", maxHeight: "100%", overflow: "hidden", rowGap: 0.5, columnGap: 1.5 }}
    >
      <Stack direction="row" spacing={0.75} alignItems="center">
        <Typography sx={{ fontSize: "1.25rem", lineHeight: 1, color: BRAND_GOLD }} aria-hidden>
          ✓
        </Typography>
        <Box>
          <Typography sx={{ fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 800, opacity: 0.6, color: "common.white" }}>
            {t("attractBadgeCertLabel")}
          </Typography>
          <Typography sx={{ fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.02em", lineHeight: 1.2, color: "common.white" }}>
            {t("attractBadgeCertTitle")}
          </Typography>
        </Box>
      </Stack>
      <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.22)", display: { xs: "none", sm: "block" }, height: 28 }} />
      <Stack direction="row" spacing={0.75} alignItems="center">
        <Typography sx={{ fontSize: "1.25rem", lineHeight: 1, color: BRAND_GOLD }} aria-hidden>
          ★
        </Typography>
        <Box>
          <Typography sx={{ fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 800, opacity: 0.6, color: "common.white" }}>
            {t("attractBadgePadraoLabel")}
          </Typography>
          <Typography sx={{ fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.02em", lineHeight: 1.2, color: "common.white" }}>
            {t("attractBadgePadraoTitle")}
          </Typography>
        </Box>
      </Stack>
      <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.22)", display: { xs: "none", sm: "block" }, height: 28 }} />
      <KioskFooterBrand />
    </Stack>
  );

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        width: "100%",
        minHeight: 0,
        overflow: "hidden",
        color: "common.white",
      }}
    >
      {!heroImageFailed ? (
        <Box
          component="img"
          src={MEDIA_ASSETS.attractHero}
          alt=""
          onError={() => setHeroImageFailed(true)}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
          }}
        />
      ) : (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(circle at 18% 22%, rgba(20,20,20,0.92) 0%, rgba(0,0,0,0.98) 55%), radial-gradient(circle at 88% 78%, rgba(205,153,65,0.14) 0%, rgba(0,0,0,0.98) 45%), #000000",
          }}
        />
      )}

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          background: "linear-gradient(180deg, rgba(0, 0, 0, 0.38) 0%, rgba(0, 0, 0, 0.78) 100%)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(205, 153, 65, 0.05) 0%, rgba(0, 0, 0, 0.72) 100%)",
        }}
      />

      <KioskLayout
        rootSx={{
          bgcolor: "transparent",
          position: "relative",
          zIndex: 2,
          height: "100%",
          maxHeight: "100%",
        }}
        header={<BrandLogo prominence="hero" />}
        footer={attractFooter}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 960,
            mx: "auto",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: "1 1 0%",
            minHeight: 0,
            overflow: "hidden",
            py: 1,
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              fontSize: "clamp(1.85rem, 5.2vw, 3.25rem)",
              textShadow: "0 18px 40px rgba(0,0,0,0.55)",
              mb: 1.5,
            }}
          >
            O Sabor da <Box component="span" sx={{ color: "secondary.main" }}>Excelência</Box>:
            <br />
            <Box component="span" sx={{ opacity: 0.96, fontWeight: 900 }}>Uruguay Lamb</Box>
          </Typography>

          <Typography
            sx={{
              maxWidth: 720,
              mx: "auto",
              fontWeight: 500,
              fontSize: "clamp(0.95rem, 2.4vw, 1.2rem)",
              lineHeight: 1.4,
              color: "rgba(247,242,234,0.9)",
              letterSpacing: "0.02em",
              mb: 2,
              flexShrink: 0,
            }}
          >
            {quizContent.subtitle}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexShrink: 0,
              [mediaNoReducedMotion]: {
                animation: `${attractCtaEnter} ${motion.durationSlow}ms ${motion.easing} both`,
                animationDelay: "60ms",
              },
              ...(ctaExiting ? { [mediaNoReducedMotion]: { animation: `${attractCtaExit} 200ms ${motion.easingOut} forwards` } } : {}),
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                ...(ctaExiting
                  ? { [mediaNoReducedMotion]: { animation: "none" } }
                  : { [mediaNoReducedMotion]: { animation: `${attractCtaIdle} 3.1s ease-in-out infinite`, animationDelay: "0.6s" } }),
              }}
            >
              <Button
                size="large"
                variant="contained"
                disableElevation
                onClick={() => {
                  if (ctaExitStarted.current) return;
                  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                  if (reducedMotion) {
                    enterLanguage();
                    navigate(ROUTES.language);
                    return;
                  }
                  ctaExitStarted.current = true;
                  setCtaExiting(true);
                  window.setTimeout(() => {
                    enterLanguage();
                    navigate(ROUTES.language);
                  }, 200);
                }}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  minWidth: 280,
                  minHeight: 64,
                  px: 5,
                  borderRadius: "10px",
                  bgcolor: BRAND_GOLD,
                  color: "#0a0a0a",
                  backgroundImage: "none",
                  fontSize: "clamp(1rem, 2.6vw, 1.25rem)",
                  fontWeight: 900,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                  boxShadow: "0 14px 36px rgba(0,0,0,0.45)",
                  transitionProperty: "transform, box-shadow, border-color, filter, background-color",
                  transitionDuration: `${motion.duration}ms`,
                  transitionTimingFunction: motion.easingOut,
                  [mediaReducedMotion]: { transitionDuration: "0.01ms" },
                  "&:active": {
                    transform: "scale(0.98)",
                    boxShadow: "0 10px 28px rgba(0,0,0,0.4)",
                  },
                  "&.Mui-focusVisible": {
                    outline: "none",
                    boxShadow: `0 0 0 3px rgba(0, 0, 0, 0.9), 0 0 0 6px ${BRAND_GOLD}`,
                  },
                }}
              >
                {quizContent.ctaLabel}
              </Button>
            </Box>
          </Box>
        </Box>
      </KioskLayout>
    </Box>
  );
}
