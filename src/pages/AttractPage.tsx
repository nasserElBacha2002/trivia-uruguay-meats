import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BrandLogo } from "../components/BrandLogo";
import { ROUTES } from "../config/routes";
import { getQuizContent } from "../content/quizContent";
import { useSessionStore } from "../features/session/useSessionStore";

const ATTRACT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1595467458427-524719c85365?auto=format&fit=crop&w=2400&q=85";

export function AttractPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { state, resetSession, enterLanguage } = useSessionStore();
  const quizContent = getQuizContent("pt");
  const [heroImageFailed, setHeroImageFailed] = useState(false);

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
          src={ATTRACT_HERO_IMAGE}
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
              "radial-gradient(circle at 18% 22%, rgba(0,47,108,0.75) 0%, rgba(0,27,68,0.96) 55%), radial-gradient(circle at 88% 78%, rgba(255,184,28,0.12) 0%, rgba(0,27,68,0.98) 45%), #001b44",
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
          background: "linear-gradient(180deg, rgba(0, 27, 68, 0.4) 0%, rgba(0, 47, 108, 0.85) 100%)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(0, 27, 68, 0.08) 0%, rgba(0, 27, 68, 0.72) 100%)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: { xs: 40, md: 48 },
          left: { xs: 22, md: 38 },
          zIndex: 20,
        }}
      >
        <Box sx={{ filter: "brightness(0) invert(1)", height: 48, display: "flex", alignItems: "center" }}>
          <BrandLogo size={150} />
        </Box>
      </Box>

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

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              size="large"
              variant="contained"
              disableElevation
              onClick={() => {
                enterLanguage();
                navigate(ROUTES.language);
              }}
              sx={{
                minWidth: { xs: 300, md: 440 },
                minHeight: { xs: 84, md: 90 },
                px: { xs: 5, md: 8 },
                borderRadius: "10px",
                bgcolor: "secondary.main",
                color: "#001b44",
                backgroundImage: "none",
                fontSize: { xs: "1.25rem", md: "1.55rem" },
                fontWeight: 900,
                letterSpacing: { xs: "0.2em", md: "0.26em" },
                textTransform: "uppercase",
                boxShadow: "0 20px 60px rgba(0,27,68,0.4)",
                "&:hover": {
                  bgcolor: "secondary.main",
                  filter: "brightness(1.06)",
                  boxShadow: "0 22px 64px rgba(0,27,68,0.48)",
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
            >
              {quizContent.ctaLabel}
            </Button>
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
