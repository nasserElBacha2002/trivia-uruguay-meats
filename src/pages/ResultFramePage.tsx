import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BrandLogo } from "../components/BrandLogo";
import { KioskLayout } from "../components/layout/KioskLayout";
import { MEDIA_ASSETS } from "../config/mediaAssets";
import { ROUTES } from "../config/routes";
import { getQuizContent } from "../content/quizContent";
import { useCompleteQuizSession } from "../features/result/useCompleteQuizSession";
import { useSessionStore } from "../features/session/useSessionStore";
import { BRAND_GOLD } from "../theme/appTheme";

function ResultHeroBand({ failed, onFail }: { failed: boolean; onFail: () => void }) {
  if (failed) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          minHeight: 120,
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
  const { state, resetSession } = useSessionStore();
  const [heroFailed, setHeroFailed] = useState(false);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);

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

  const onHeroFail = () => setHeroFailed(true);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        width: "100%",
        minHeight: 0,
        overflow: "hidden",
        bgcolor: "#000000",
        color: "text.primary",
      }}
    >
      <Dialog open={claimDialogOpen} onClose={() => setClaimDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800 }}>{t("resultClaimDialogTitle")}</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 1.5, opacity: 0.9 }}>{t("resultClaimDialogIntro")}</Typography>
          <Typography sx={{ lineHeight: 1.5, opacity: 0.88 }}>{t("resultClaimDialogBody")}</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1, flexWrap: "wrap" }}>
          <Button type="button" onClick={() => setClaimDialogOpen(false)}>
            {t("resultClaimDialogClose")}
          </Button>
          <Button
            type="button"
            variant="contained"
            disableElevation
            onClick={goToAttract}
            sx={{ bgcolor: BRAND_GOLD, color: "#0a0a0a", "&:hover": { bgcolor: "#d4a855" } }}
          >
            {t("resultClaimDialogFinish")}
          </Button>
        </DialogActions>
      </Dialog>

      <KioskLayout
        header={<BrandLogo prominence="standard" />}
        rootSx={{ height: "100%", maxHeight: "100%" }}
        contentSx={{ justifyContent: "flex-start", py: 0.5, pb: 1 }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 720,
            mx: "auto",
            flex: "1 1 0%",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            overflow: "hidden",
            px: { xs: 1.25, sm: 2 },
            pb: 0.5,
          }}
        >
          {syncFailed ? (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "stretch", sm: "center" }}
              sx={{
                flexShrink: 0,
                mb: 1,
                p: 1.25,
                borderRadius: 2,
                border: `1px solid rgba(205,153,65,0.4)`,
                bgcolor: "rgba(20,20,20,0.92)",
              }}
            >
              <Typography sx={{ flex: 1, fontSize: "0.88rem" }}>{t("resultCompleteSyncError")}</Typography>
              <Button type="button" variant="outlined" size="small" onClick={retryComplete} sx={{ flexShrink: 0 }}>
                {t("resultCompleteRetry")}
              </Button>
            </Stack>
          ) : null}

          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: 560,
              mx: "auto",
              flexShrink: 0,
              height: "clamp(150px, 22vh, 320px)",
              maxHeight: "min(32vh, 320px)",
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid rgba(205,153,65,0.22)",
            }}
          >
            <ResultHeroBand failed={heroFailed} onFail={onHeroFail} />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%)",
              }}
            />
          </Box>

          <Stack
            spacing={{ xs: 1, sm: 1.15 }}
            sx={{
              flex: "1 1 0%",
              minHeight: 0,
              mt: 0.75,
              width: "100%",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignSelf: "center",
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                bgcolor: "rgba(24,24,24,0.95)",
                border: `1px solid rgba(205,153,65,0.35)`,
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(247,242,234,0.88)",
                  textAlign: "center",
                }}
              >
                {t("resultBandLabel")}: {t(scoreLabelKey)}
              </Typography>
            </Box>

            <Typography
              component="h1"
              sx={{
                fontSize: "clamp(1.2rem, min(3.6vw, 4.5dvh), 1.95rem)",
                lineHeight: 1.08,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                textAlign: "center",
                flexShrink: 0,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {headline}
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1.25, sm: 2 }}
              alignItems="stretch"
              sx={{ flexShrink: 0, width: "100%" }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  width: { xs: "100%", sm: 200 },
                  maxWidth: { xs: 280, sm: "none" },
                  alignSelf: { xs: "center", sm: "flex-start" },
                  p: { xs: 1.75, sm: 2 },
                  borderRadius: 2.5,
                  bgcolor: "rgba(18, 18, 18, 0.94)",
                  border: `1px solid rgba(205,153,65,0.32)`,
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(247,242,234,0.88)",
                    mb: 0.75,
                  }}
                >
                  {t("resultScoreLabel")}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 0.15 }}>
                  <Typography component="span" sx={{ fontSize: "clamp(2.5rem, 8vw, 3.5rem)", fontWeight: 900, lineHeight: 1 }}>
                    {score}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "clamp(2.5rem, 8vw, 3.5rem)",
                      fontWeight: 900,
                      lineHeight: 1,
                      color: BRAND_GOLD,
                    }}
                  >
                    /
                  </Typography>
                  <Typography component="span" sx={{ fontSize: "clamp(1.5rem, 5vw, 2.1rem)", fontWeight: 800, lineHeight: 1, opacity: 0.92 }}>
                    {total}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography
                  sx={{
                    fontSize: "clamp(0.88rem, min(2.4vw, 3.2dvh), 1.1rem)",
                    lineHeight: 1.38,
                    fontWeight: 600,
                    color: BRAND_GOLD,
                    textAlign: "center",
                    display: "-webkit-box",
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {supporting}
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={1} sx={{ width: "100%", maxWidth: 520, mx: "auto", alignItems: "stretch", flexShrink: 0, pt: 0.35, pb: 0.25 }}>
              <Button
                type="button"
                variant="contained"
                disableElevation
                onClick={() => setClaimDialogOpen(true)}
                sx={{
                  minHeight: 64,
                  px: 3,
                  py: 1.25,
                  borderRadius: 2,
                  bgcolor: BRAND_GOLD,
                  color: "#0a0a0a",
                  fontSize: "clamp(0.92rem, 2.2vw, 1rem)",
                  fontWeight: 900,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  gap: 1,
                  "&:hover": { bgcolor: "#d4a855" },
                }}
              >
                {t("resultPrimaryCta")}
                <Box component="span" aria-hidden sx={{ fontSize: "1.2rem", lineHeight: 1 }}>
                  🎉
                </Box>
              </Button>

              <Button
                type="button"
                variant="outlined"
                onClick={goToAttract}
                sx={{
                  minHeight: 64,
                  px: 3,
                  borderRadius: 2,
                  borderWidth: 2,
                  borderColor: "rgba(205,153,65,0.45)",
                  color: "common.white",
                  bgcolor: "rgba(255,255,255,0.04)",
                  fontSize: "clamp(0.88rem, 2vw, 0.98rem)",
                  fontWeight: 700,
                  textTransform: "none",
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
          </Stack>
        </Box>
      </KioskLayout>
    </Box>
  );
}
