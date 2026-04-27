import { Box, Button, Collapse, Stack, Typography, useMediaQuery } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  kioskHeadlineCelebrate,
  kioskResultCtaPulse,
  kioskResultCtaPulseSoft,
  kioskResultCtaPulseSubtle,
  kioskResultHeroZoom,
  kioskScoreReveal,
  kioskSecondaryIdlePulse,
} from "../animations/kioskKeyframes";
import { KioskHeader } from "../components/kiosk/KioskHeader";
import { KioskScreen } from "../components/kiosk/KioskScreen";
import { GoldParticles } from "../components/motion/GoldParticles";
import { MEDIA_ASSETS } from "../config/mediaAssets";
import { ROUTES } from "../config/routes";
import { getQuizContent } from "../content/quizContent";
import { useCompleteQuizSession } from "../features/result/useCompleteQuizSession";
import { useSessionStore } from "../features/session/useSessionStore";
import { BRAND_GOLD } from "../theme/appTheme";
import { mediaNoReducedMotion, mediaReducedMotion, motion } from "../theme/motion";

function ResultHeroBand({ failed, onFail }: { failed: boolean; onFail: () => void }) {
  if (failed) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          minHeight: 160,
          borderRadius: 2,
          background:
            "linear-gradient(145deg, rgba(0,0,0,0.75) 0%, rgba(12,12,12,0.95) 50%, rgba(205,153,65,0.1) 100%)",
        }}
      />
    );
  }
  return (
    <Box
      component="img"
      src={MEDIA_ASSETS.resultHero}
      alt=""
      onError={onFail}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
        display: "block",
        [mediaNoReducedMotion]: {
          animation: `${kioskResultHeroZoom} 0.9s cubic-bezier(0.22, 1, 0.36, 1) both`,
        },
        [mediaReducedMotion]: { animation: "none" },
      }}
    />
  );
}

export function ResultFramePage() {
  const { state } = useSessionStore();
  return <ResultFramePageContent key={state.sessionId ?? "no-session"} />;
}

function ResultFramePageContent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const collapseMs = prefersReducedMotion ? 0 : motion.durationSlow;
  const { state, resetSession } = useSessionStore();
  const [heroFailed, setHeroFailed] = useState(false);
  const [isClaimingPrize, setIsClaimingPrize] = useState(false);

  const score = state.score;
  const quizContent = getQuizContent(state.language);
  const total = quizContent.totalQuestions;

  const scoreBand = useMemo(
    (): "high" | "medium" | "low" => (score >= 5 ? "high" : score >= 3 ? "medium" : "low"),
    [score],
  );

  const { syncFailed, retryComplete } = useCompleteQuizSession({
    sessionId: state.sessionId,
    score,
    totalQuestions: total,
    scoreBand,
  });

  const scoreLabelKey =
    scoreBand === "high" ? "scoreBandHigh" : scoreBand === "medium" ? "scoreBandMedium" : "scoreBandLow";

  const headline = quizContent.finalResults[scoreBand];
  const supporting = quizContent.closingMessage;

  const goToAttract = () => {
    resetSession();
    navigate(ROUTES.attract);
  };

  const beginClaimFlow = () => setIsClaimingPrize(true);

  const onHeroFail = () => setHeroFailed(true);

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%", minHeight: 0, bgcolor: "#000", color: "text.primary" }}>
      <KioskScreen header={<KioskHeader logoSize="standard" />}>
        <Stack
          spacing={2}
          sx={{
            flex: 1,
            minHeight: 0,
            width: "100%",
            maxWidth: "min(900px, 88vw)",
            mx: "auto",
            px: 2,
            py: 1.5,
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {syncFailed ? (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center" sx={{ width: "100%", p: 1.5, borderRadius: 2, border: `1px solid rgba(205,153,65,0.4)`, bgcolor: "rgba(20,20,20,0.92)" }}>
              <Typography sx={{ flex: 1, fontSize: "1.05rem" }}>{t("resultCompleteSyncError")}</Typography>
              <Button type="button" variant="outlined" onClick={retryComplete}>
                {t("resultCompleteRetry")}
              </Button>
            </Stack>
          ) : null}

          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: "min(760px, 88vw)",
              height: "clamp(220px, 24dvh, 420px)",
              flexShrink: 0,
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid rgba(205,153,65,0.22)",
            }}
          >
            <ResultHeroBand failed={heroFailed} onFail={onHeroFail} />
            {scoreBand === "high" && !heroFailed ? (
              <Box sx={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}>
                <GoldParticles />
              </Box>
            ) : null}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 2,
                background: "linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.5) 100%)",
              }}
            />
          </Box>

          <Box sx={{ px: 0.5, width: "100%", textAlign: "center" }}>
            <Box
              sx={{
                display: "inline-flex",
                px: 2,
                py: 0.75,
                borderRadius: 2,
                bgcolor: "rgba(24,24,24,0.95)",
                border: `1px solid rgba(205,153,65,0.35)`,
                mb: 1.5,
              }}
            >
              <Typography sx={{ fontSize: "clamp(0.85rem, 1.5dvh, 1rem)", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                {t("resultBandLabel")}: {t(scoreLabelKey)}
              </Typography>
            </Box>

            <Typography
              component="h1"
              sx={{
                fontSize: "clamp(2rem, 4dvh, 3.4rem)",
                lineHeight: 1.06,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                mb: 2,
                [mediaNoReducedMotion]:
                  scoreBand === "high"
                    ? { animation: `${kioskHeadlineCelebrate} 0.95s cubic-bezier(0.22, 1, 0.36, 1) both` }
                    : scoreBand === "medium"
                      ? { animation: `${kioskScoreReveal} 0.7s cubic-bezier(0.22, 1, 0.36, 1) both` }
                      : { animation: `${kioskScoreReveal} 0.55s ease-out both` },
                [mediaReducedMotion]: { animation: "none" },
              }}
            >
              {headline}
            </Typography>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2.5} alignItems="center" justifyContent="center" sx={{ mb: 2, width: "100%" }}>
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  borderRadius: 2.5,
                  bgcolor: "rgba(18, 18, 18, 0.94)",
                  border: `1px solid rgba(205,153,65,0.32)`,
                  textAlign: "center",
                  minWidth: "min(280px, 80vw)",
                  [mediaNoReducedMotion]: {
                    animation: `${kioskScoreReveal} 0.65s cubic-bezier(0.22, 1, 0.36, 1) both`,
                    animationDelay: "0.1s",
                  },
                  [mediaReducedMotion]: { animation: "none" },
                }}
              >
                <Typography sx={{ fontSize: "clamp(0.85rem, 1.4dvh, 1rem)", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", mb: 1 }}>
                  {t("resultScoreLabel")}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 0.2 }}>
                  <Typography component="span" sx={{ fontSize: "clamp(4rem, 8dvh, 7rem)", fontWeight: 900, lineHeight: 1 }}>
                    {score}
                  </Typography>
                  <Typography component="span" sx={{ fontSize: "clamp(4rem, 8dvh, 7rem)", fontWeight: 900, lineHeight: 1, color: BRAND_GOLD }}>
                    /
                  </Typography>
                  <Typography component="span" sx={{ fontSize: "clamp(2.5rem, 5dvh, 4rem)", fontWeight: 800, lineHeight: 1, opacity: 0.92 }}>
                    {total}
                  </Typography>
                </Box>
              </Box>

              <Typography
                sx={{
                  flex: 1,
                  fontSize: "clamp(1.2rem, 2.2dvh, 1.65rem)",
                  lineHeight: 1.45,
                  fontWeight: 600,
                  color: BRAND_GOLD,
                  textAlign: "center",
                  maxWidth: 560,
                }}
              >
                {supporting}
              </Typography>
            </Stack>

            <Box sx={{ width: "100%", maxWidth: 560, mx: "auto" }}>
              <Collapse in={!isClaimingPrize} timeout={collapseMs} collapsedSize={0}>
                <Stack spacing={1.5} sx={{ width: "100%" }}>
                  <Button
                    type="button"
                    variant="contained"
                    disableElevation
                    onClick={beginClaimFlow}
                    sx={{
                      minHeight: "clamp(72px, 6dvh, 96px)",
                      fontSize: "clamp(1.1rem, 2dvh, 1.35rem)",
                      fontWeight: 900,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      borderRadius: 2,
                      bgcolor: BRAND_GOLD,
                      color: "#0a0a0a",
                      gap: 1,
                      "&:hover": { bgcolor: "#d4a855" },
                      [mediaNoReducedMotion]:
                        scoreBand === "high"
                          ? {
                              animation: `${kioskResultCtaPulse} 1.65s ease-in-out infinite`,
                              animationDelay: "0.35s",
                            }
                          : scoreBand === "medium"
                            ? {
                                animation: `${kioskResultCtaPulseSoft} 2.35s ease-in-out infinite`,
                                animationDelay: "0.25s",
                              }
                            : {
                                animation: `${kioskResultCtaPulseSubtle} 3.2s ease-in-out infinite`,
                              },
                      [mediaReducedMotion]: { animation: "none" },
                    }}
                  >
                    {t("resultPrimaryCta")}
                    <Box component="span" aria-hidden sx={{ fontSize: "1.35rem" }}>
                      🎉
                    </Box>
                  </Button>

                  <Button
                    type="button"
                    variant="outlined"
                    onClick={goToAttract}
                    sx={{
                      minHeight: "clamp(72px, 6dvh, 96px)",
                      fontSize: "clamp(1.05rem, 1.9dvh, 1.25rem)",
                      fontWeight: 700,
                      borderRadius: 2,
                      borderWidth: 2,
                      borderColor: "rgba(205,153,65,0.45)",
                      color: "common.white",
                      textTransform: "none",
                      transition: `transform ${motion.durationFast}ms ${motion.easingOut}, border-color ${motion.duration}ms ease, background-color ${motion.duration}ms ease`,
                      [mediaNoReducedMotion]: {
                        animation: `${kioskSecondaryIdlePulse} 3.6s ease-in-out infinite`,
                      },
                      [mediaReducedMotion]: { animation: "none" },
                      "&:active": { transform: "scale(0.985)" },
                      "&:hover": {
                        borderWidth: 2,
                        borderColor: "rgba(205,153,65,0.65)",
                        bgcolor: "rgba(205,153,65,0.1)",
                      },
                    }}
                  >
                    {t("resultSecondaryCta")}
                  </Button>
                </Stack>
              </Collapse>

              <Collapse in={isClaimingPrize} timeout={collapseMs} collapsedSize={0}>
                <Box
                  role="region"
                  aria-label={t("resultClaimInlineTitle")}
                  sx={{
                    width: "100%",
                    p: { xs: 2.5, sm: 3.5 },
                    borderRadius: 2.5,
                    bgcolor: "rgba(12, 12, 12, 0.96)",
                    border: "1px solid rgba(205,153,65,0.28)",
                  }}
                >
                  <Typography
                    component="h2"
                    sx={{
                      fontSize: "clamp(1.25rem, 2.4dvh, 1.6rem)",
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                      mb: 1.5,
                      textAlign: "center",
                    }}
                  >
                    {t("resultClaimInlineTitle")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "clamp(1rem, 1.8dvh, 1.2rem)",
                      lineHeight: 1.5,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.92)",
                      textAlign: "center",
                      mb: 1.5,
                    }}
                  >
                    {t("resultClaimInlineBody")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "clamp(0.9rem, 1.5dvh, 1.05rem)",
                      lineHeight: 1.45,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.72)",
                      textAlign: "center",
                      mb: 2.5,
                    }}
                  >
                    {t("resultClaimInlineNote")}
                  </Typography>
                  <Button
                    type="button"
                    variant="contained"
                    disableElevation
                    onClick={goToAttract}
                    fullWidth
                    sx={{
                      minHeight: "clamp(72px, 6dvh, 96px)",
                      fontSize: "clamp(1.05rem, 2dvh, 1.3rem)",
                      fontWeight: 900,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      borderRadius: 2,
                      bgcolor: BRAND_GOLD,
                      color: "#0a0a0a",
                      "&:hover": { bgcolor: "#d4a855" },
                    }}
                  >
                    {t("resultFinishCta")}
                  </Button>
                </Box>
              </Collapse>
            </Box>
          </Box>
        </Stack>
      </KioskScreen>
    </Box>
  );
}
