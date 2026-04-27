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
import { MEDIA_ASSETS } from "../config/mediaAssets";
import { ROUTES } from "../config/routes";
import { getQuizContent } from "../content/quizContent";
import { useCompleteQuizSession } from "../features/result/useCompleteQuizSession";
import { useSessionStore } from "../features/session/useSessionStore";
import { BRAND_GOLD } from "../theme/appTheme";

function EditorialHeroImage({
  failed,
  onFail,
}: {
  failed: boolean;
  onFail: () => void;
}) {
  if (failed) {
    return (
      <Box
        sx={{
          position: "absolute",
          inset: 0,
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
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
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
        display: "flex",
        flexDirection: "column",
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

      {/* Mobile / narrow: hero band */}
      <Box
        aria-hidden
        sx={{
          display: { xs: "block", md: "none" },
          position: "relative",
          width: "100%",
          height: { xs: 240, sm: 260 },
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <EditorialHeroImage failed={heroFailed} onFail={onHeroFail} />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.92) 100%)",
            pointerEvents: "none",
          }}
        />
      </Box>

      <Box sx={{ position: "relative", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <Box
          aria-hidden
          sx={{
            display: { xs: "none", md: "grid" },
            position: "absolute",
            inset: 0,
            gridTemplateColumns: "minmax(0, 7fr) minmax(0, 5fr)",
            zIndex: 0,
          }}
        >
          <Box sx={{ position: "relative", bgcolor: "#000000", overflow: "hidden" }}>
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle at 18% 28%, rgba(205,153,65,0.12) 0%, transparent 55%)",
                opacity: 1,
              }}
            />
          </Box>
          <Box
            sx={{
              position: "relative",
              minHeight: 0,
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 15% 100%)",
            }}
          >
            <EditorialHeroImage failed={heroFailed} onFail={onHeroFail} />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(200deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.55) 100%)",
                pointerEvents: "none",
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: { xs: "auto", md: "hidden" },
          }}
        >
          {syncFailed ? (
            <Box
              sx={{
                px: { xs: 2.5, sm: 4, md: 8 },
                pt: 2,
                maxWidth: 720,
                width: "100%",
                mx: "auto",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "stretch", sm: "center" }}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  border: `1px solid rgba(205,153,65,0.4)`,
                  bgcolor: "rgba(20,20,20,0.92)",
                }}
              >
                <Typography sx={{ flex: 1, fontSize: "0.9rem" }}>{t("resultCompleteSyncError")}</Typography>
                <Button type="button" variant="outlined" size="small" onClick={retryComplete} sx={{ flexShrink: 0 }}>
                  {t("resultCompleteRetry")}
                </Button>
              </Stack>
            </Box>
          ) : null}

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              px: { xs: 2.5, sm: 4, md: 8, lg: 10 },
              py: { xs: 2.5, md: 3 },
              width: "100%",
              maxWidth: { md: "min(56vw, 720px)", lg: 760 },
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignSelf: "flex-start",
                px: 2,
                py: 0.65,
                mb: { xs: 2, md: 2.5 },
                borderRadius: 1.5,
                bgcolor: "rgba(24,24,24,0.95)",
                border: `1px solid rgba(205,153,65,0.35)`,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(247,242,234,0.88)",
                }}
              >
                {t("resultBandLabel")}: {t(scoreLabelKey)}
              </Typography>
            </Box>

            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "clamp(1.85rem, 5.2vw, 2.55rem)", md: "clamp(2.25rem, 2.9vw, 3.35rem)" },
                lineHeight: 1.05,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                maxWidth: "min(640px, 100%)",
                mb: { xs: 2.5, md: 3.5 },
              }}
            >
              {headline}
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "stretch" }}
              spacing={{ xs: 2.5, sm: 3, md: 4 }}
              sx={{ mb: { xs: 3, md: 4 }, maxWidth: "min(900px, 100%)" }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  width: { xs: "100%", sm: 220, md: 240 },
                  alignSelf: { xs: "center", sm: "flex-start" },
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 2.5,
                  bgcolor: "rgba(18, 18, 18, 0.94)",
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  border: `1px solid rgba(205,153,65,0.32)`,
                  boxShadow: "0 24px 48px rgba(0,0,0,0.35)",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(247,242,234,0.88)",
                    mb: 1.25,
                  }}
                >
                  {t("resultScoreLabel")}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 0.15 }}>
                  <Typography
                    component="span"
                    sx={{ fontSize: { xs: "3.75rem", md: "4.5rem" }, fontWeight: 900, lineHeight: 1 }}
                  >
                    {score}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: { xs: "3.75rem", md: "4.5rem" },
                      fontWeight: 900,
                      lineHeight: 1,
                      color: BRAND_GOLD,
                      textShadow: "0 0 22px rgba(205,153,65,0.35)",
                    }}
                  >
                    /
                  </Typography>
                  <Typography
                    component="span"
                    sx={{ fontSize: { xs: "2.35rem", md: "2.75rem" }, fontWeight: 800, lineHeight: 1, opacity: 0.92 }}
                  >
                    {total}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Typography
                  sx={{
                    fontSize: { xs: "1.28rem", md: "1.48rem" },
                    lineHeight: 1.45,
                    fontWeight: 600,
                    color: BRAND_GOLD,
                    maxWidth: 520,
                    letterSpacing: "0.01em",
                  }}
                >
                  {supporting}
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={1.75} sx={{ width: "100%", maxWidth: 520, alignItems: "flex-start" }}>
              <Button
                type="button"
                variant="contained"
                disableElevation
                onClick={() => setClaimDialogOpen(true)}
                sx={{
                  minHeight: { xs: 64, md: 76 },
                  px: { xs: 3, md: 5 },
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: BRAND_GOLD,
                  color: "#0a0a0a",
                  fontSize: { xs: "1rem", md: "1.08rem" },
                  fontWeight: 900,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  boxShadow: "0 14px 36px rgba(0,0,0,0.32)",
                  gap: 1.25,
                  "&:hover": {
                    bgcolor: "#d4a855",
                    boxShadow: "0 18px 44px rgba(0,0,0,0.38)",
                  },
                }}
              >
                {t("resultPrimaryCta")}
                <Box component="span" aria-hidden sx={{ fontSize: "1.35rem", lineHeight: 1 }}>
                  🎉
                </Box>
              </Button>

              <Button
                type="button"
                variant="outlined"
                onClick={goToAttract}
                sx={{
                  minHeight: { xs: 54, md: 58 },
                  px: { xs: 3, md: 4.5 },
                  borderRadius: 2,
                  borderWidth: 2,
                  borderColor: "rgba(205,153,65,0.45)",
                  color: "common.white",
                  bgcolor: "rgba(255,255,255,0.04)",
                  fontSize: { xs: "0.95rem", md: "1.02rem" },
                  fontWeight: 700,
                  textTransform: "none",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

