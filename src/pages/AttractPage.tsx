import { keyframes } from "@emotion/react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { KioskHeader } from "../components/kiosk/KioskHeader";
import { KioskScreen } from "../components/kiosk/KioskScreen";
import { MEDIA_ASSETS } from "../config/mediaAssets";
import { ROUTES } from "../config/routes";
import { kioskCtaBreathe, kioskCtaGoldGlow } from "../animations/kioskKeyframes";
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

export function AttractPage() {
  const { i18n } = useTranslation();
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

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%", minHeight: 0, color: "common.white" }}>
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

      <KioskScreen
        variant="hero"
        header={<KioskHeader logoSize="hero" brandMotion="attract" />}
        rootSx={{
          bgcolor: "transparent",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Stack
          spacing={2}
          sx={{
            flex: 1,
            minHeight: 0,
            width: "100%",
            maxWidth: "min(920px, 90vw)",
            mx: "auto",
            px: 2,
            py: 1,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              fontSize: "clamp(2.1rem, 4.5dvh, 3.6rem)",
              textShadow: "0 18px 40px rgba(0,0,0,0.55)",
            }}
          >
            O Sabor da <Box component="span" sx={{ color: "secondary.main" }}>Excelência</Box>:
            <br />
            <Box component="span" sx={{ opacity: 0.96, fontWeight: 900 }}>Uruguay Lamb</Box>
          </Typography>

          <Typography
            sx={{
              maxWidth: 800,
              mx: "auto",
              fontWeight: 500,
              fontSize: "clamp(1.15rem, 2.4dvh, 1.55rem)",
              lineHeight: 1.45,
              color: "rgba(247,242,234,0.92)",
              letterSpacing: "0.02em",
            }}
          >
            {quizContent.subtitle}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
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
                ...(!ctaExiting
                  ? {
                      [mediaNoReducedMotion]: {
                        animation: `${kioskCtaBreathe} 2.1s ease-in-out infinite`,
                        animationDelay: "0.45s",
                      },
                    }
                  : { [mediaNoReducedMotion]: { animation: "none" } }),
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
                  minWidth: "min(92vw, 420px)",
                  minHeight: "clamp(72px, 7dvh, 96px)",
                  px: 6,
                  borderRadius: "10px",
                  bgcolor: BRAND_GOLD,
                  color: "#0a0a0a",
                  backgroundImage: "none",
                  fontSize: "clamp(1.1rem, 2.2dvh, 1.45rem)",
                  fontWeight: 900,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                  boxShadow: "0 14px 36px rgba(0,0,0,0.45)",
                  transitionProperty: "transform, box-shadow, filter, background-color",
                  transitionDuration: `${motion.duration}ms`,
                  transitionTimingFunction: motion.easingOut,
                  [mediaReducedMotion]: { transitionDuration: "0.01ms" },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                  "&.Mui-focusVisible": {
                    outline: "none",
                    boxShadow: `0 0 0 3px rgba(0, 0, 0, 0.9), 0 0 0 6px ${BRAND_GOLD}`,
                  },
                  ...(!ctaExiting
                    ? {
                        [mediaNoReducedMotion]: {
                          animation: `${kioskCtaGoldGlow} 2.1s ease-in-out infinite`,
                          animationDelay: "0.45s",
                        },
                      }
                    : {}),
                }}
              >
                {quizContent.ctaLabel}
              </Button>
            </Box>
          </Box>
        </Stack>
      </KioskScreen>
    </Box>
  );
}
