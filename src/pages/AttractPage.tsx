import { keyframes } from "@emotion/react";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BrandLogo } from "../components/BrandLogo";
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

/** Muy sutil: “soft attention” ~2px en ~3s, sin caricatura */
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

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        height: "100%",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
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
            transform: "scale(1.05)",
            transformOrigin: "center",
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
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          background: "linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.82) 100%)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(180deg, rgba(205, 153, 65, 0.06) 0%, rgba(0, 0, 0, 0.75) 100%)`,
        }}
      />

      <Stack
        component="main"
        flex={1}
        minHeight={0}
        alignItems="center"
        justifyContent="center"
        px={{ xs: 2.5, md: 5 }}
        pt={{ xs: 10, md: 12 }}
        sx={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          paddingBottom: { xs: "clamp(10rem, 18vh, 14rem)", md: "clamp(8rem, 12vh, 11rem)" },
        }}
      >
        <Box sx={{ maxWidth: 1100, width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: { xs: 3, md: 4 },
              [mediaNoReducedMotion]: {
                animation: `${attractCtaEnter} ${motion.durationSlow}ms ${motion.easing} both`,
              },
            }}
          >
            <BrandLogo prominence="hero" />
          </Box>

          <Typography
            component="h1"
            sx={{
              fontWeight: 900,
              letterSpacing: { xs: "-0.035em", md: "-0.045em" },
              lineHeight: 1.02,
              fontSize: { xs: "3.1rem", sm: "4.2rem", md: "5.2rem", lg: "5.75rem" },
              textShadow: "0 22px 56px rgba(0,0,0,0.55)",
              mb: { xs: 3.5, md: 5 },
            }}
          >
            O Sabor da{" "}
            <Box component="span" sx={{ color: "secondary.main" }}>
              Excelência
            </Box>
            :
            <br />
            <Box component="span" sx={{ opacity: 0.96, fontWeight: 900 }}>
              Uruguay Lamb
            </Box>
          </Typography>

          <Typography
            sx={{
              maxWidth: 920,
              mx: "auto",
              fontWeight: 500,
              fontSize: { xs: "1.12rem", md: "1.35rem" },
              lineHeight: 1.45,
              color: "rgba(229,226,225,0.88)",
              letterSpacing: "0.02em",
              mb: { xs: 6, md: 9 },
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
                animationDelay: "80ms",
              },
              [mediaReducedMotion]: { opacity: 1 },
              ...(ctaExiting
                ? {
                    [mediaNoReducedMotion]: {
                      animation: `${attractCtaExit} 200ms ${motion.easingOut} forwards`,
                    },
                  }
                : {}),
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                justifyContent: "center",
                ...(ctaExiting
                  ? { [mediaNoReducedMotion]: { animation: "none" } }
                  : {
                      [mediaNoReducedMotion]: {
                        animation: `${attractCtaIdle} 3.1s ease-in-out infinite`,
                        animationDelay: "0.72s",
                      },
                    }),
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
                minWidth: { xs: 300, md: 440 },
                minHeight: { xs: 84, md: 90 },
                px: { xs: 5, md: 8 },
                borderRadius: "10px",
                bgcolor: BRAND_GOLD,
                color: "#0a0a0a",
                backgroundImage: "none",
                fontSize: { xs: "1.25rem", md: "1.55rem" },
                fontWeight: 900,
                letterSpacing: { xs: "0.2em", md: "0.26em" },
                textTransform: "uppercase",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                boxShadow: "0 18px 48px rgba(0,0,0,0.45)",
                transitionProperty: "transform, box-shadow, border-color, filter, background-color",
                transitionDuration: `${motion.duration}ms`,
                transitionTimingFunction: motion.easingOut,
                [mediaReducedMotion]: {
                  transitionDuration: "0.01ms",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  left: "-40%",
                  width: "45%",
                  background: "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.28) 50%, transparent 100%)",
                  transform: "skewX(-18deg) translateX(-160%)",
                  opacity: 0,
                  pointerEvents: "none",
                },
                "@media (hover: hover) and (pointer: fine)": {
                  "&:hover": {
                    bgcolor: "#d4a855",
                    borderColor: "rgba(0, 0, 0, 0.18)",
                    filter: "brightness(1.03)",
                    boxShadow: `0 22px 56px rgba(0,0,0,0.5), 0 0 0 1px rgba(205,153,65,0.45)`,
                    transform: { xs: "translateY(-1px)", md: "translateY(-2px)" },
                  },
                  [mediaNoReducedMotion]: {
                    "&:hover::before": {
                      opacity: 1,
                      transform: "skewX(-18deg) translateX(380%)",
                      transition: "transform 0.75s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease",
                    },
                  },
                },
                "&:active": {
                  transform: "scale(0.98) translateY(0)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
                  transitionDuration: `${motion.durationFast}ms`,
                },
                "&.Mui-focusVisible": {
                  outline: "none",
                  boxShadow: `0 0 0 3px rgba(0, 0, 0, 0.9), 0 0 0 6px ${BRAND_GOLD}, 0 18px 48px rgba(0,0,0,0.45)`,
                },
              }}
              >
                {quizContent.ctaLabel}
              </Button>
            </Box>
          </Box>
        </Box>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "stretch" }}
        spacing={{ xs: 2, sm: 3 }}
        sx={{
          position: "absolute",
          left: { xs: 22, md: 38 },
          bottom: { xs: 20, md: 26 },
          zIndex: 20,
          maxWidth: { xs: "92vw", md: "none" },
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Typography sx={{ fontSize: "2rem", lineHeight: 1, color: "secondary.main" }} aria-hidden>
            ✓
          </Typography>
          <Box>
            <Typography
              sx={{
                fontSize: "0.68rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 800,
                opacity: 0.55,
                color: "common.white",
              }}
            >
              {t("attractBadgeCertLabel")}
            </Typography>
            <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.02em", mt: 0.35 }}>
              {t("attractBadgeCertTitle")}
            </Typography>
          </Box>
        </Stack>

        <Divider
          orientation="horizontal"
          sx={{
            display: { xs: "block", sm: "none" },
            width: "100%",
            maxWidth: 280,
            borderColor: "rgba(255,255,255,0.22)",
          }}
        />
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            display: { xs: "none", sm: "block" },
            borderColor: "rgba(255,255,255,0.22)",
            alignSelf: "stretch",
          }}
        />

        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <Typography sx={{ fontSize: "2rem", lineHeight: 1, color: "secondary.main" }} aria-hidden>
            ★
          </Typography>
          <Box>
            <Typography
              sx={{
                fontSize: "0.68rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 800,
                opacity: 0.55,
                color: "common.white",
              }}
            >
              {t("attractBadgePadraoLabel")}
            </Typography>
            <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.02em", mt: 0.35 }}>
              {t("attractBadgePadraoTitle")}
            </Typography>
          </Box>
        </Stack>

        <Divider
          orientation="horizontal"
          sx={{
            display: { xs: "block", sm: "none" },
            width: "100%",
            maxWidth: 280,
            borderColor: "rgba(255,255,255,0.22)",
          }}
        />
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            display: { xs: "none", sm: "block" },
            borderColor: "rgba(255,255,255,0.22)",
            alignSelf: "stretch",
          }}
        />

        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ width: 28, height: 4, bgcolor: "secondary.main", borderRadius: 999 }} />
          <Typography
            sx={{
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              opacity: 0.48,
              fontWeight: 800,
              fontSize: "0.68rem",
              whiteSpace: { sm: "nowrap" },
            }}
          >
            {t("attractBrandMark")}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
