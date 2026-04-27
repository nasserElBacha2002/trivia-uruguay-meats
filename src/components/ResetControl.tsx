import { Box, Button, Fade, IconButton, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../config/routes";
import { useSessionStore } from "../features/session/useSessionStore";
import { BRAND_GOLD } from "../theme/appTheme";
import { motion } from "../theme/motion";

/** Top-right kiosk manual reset: tap opens confirm; restart only after explicit confirmation. */
export function ResetControl() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resetSession } = useSessionStore();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const openConfirm = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const closeConfirm = useCallback(() => setConfirmOpen(false), []);

  const handleConfirm = () => {
    resetSession();
    navigate(ROUTES.attract, { replace: true });
    closeConfirm();
  };

  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirmOpen, closeConfirm]);

  const fadeMs = motion.duration;

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1400,
          pointerEvents: "none",
        }}
      >
        <IconButton
          type="button"
          aria-label={t("kioskManualResetAriaLabel")}
          onClick={(e) => {
            e.stopPropagation();
            openConfirm();
          }}
          onContextMenu={(e) => e.preventDefault()}
          disabled={confirmOpen}
          sx={{
            pointerEvents: "auto",
            width: 56,
            height: 56,
            p: 1,
            opacity: 0.72,
            color: BRAND_GOLD,
            bgcolor: "rgba(0,0,0,0.35)",
            border: `1px solid rgba(205,153,65,0.35)`,
            transition: `opacity ${motion.durationFast}ms ${motion.easing}, background-color ${motion.durationFast}ms ${motion.easing}`,
            "&:hover": {
              opacity: 1,
              bgcolor: "rgba(205,153,65,0.12)",
              borderColor: "rgba(205,153,65,0.55)",
            },
            "&:focus-visible": {
              opacity: 1,
              outline: `2px solid ${BRAND_GOLD}`,
              outlineOffset: 2,
            },
            "&.Mui-disabled": { opacity: 0.35 },
          }}
        >
          <Box component="svg" viewBox="0 0 24 24" aria-hidden sx={{ width: 28, height: 28, fill: "currentColor" }}>
            <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
          </Box>
        </IconButton>
      </Box>

      <Fade in={confirmOpen} timeout={fadeMs} mountOnEnter unmountOnExit>
        <Box
          role="presentation"
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
            bgcolor: "rgba(0,0,0,0.62)",
            backdropFilter: "blur(4px)",
          }}
          onClick={closeConfirm}
        >
          <Box
            role="dialog"
            aria-modal="true"
            aria-labelledby="kiosk-reset-title"
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: "100%",
              maxWidth: 360,
              p: { xs: 2.25, sm: 3 },
              borderRadius: 2.5,
              bgcolor: "rgba(14,14,14,0.98)",
              border: `1px solid rgba(205,153,65,0.35)`,
              boxShadow: "0 16px 48px rgba(0,0,0,0.55)",
            }}
          >
            <Typography id="kiosk-reset-title" variant="h6" component="h2" sx={{ fontWeight: 900, mb: 1.25, textAlign: "center" }}>
              {t("kioskResetConfirmTitle")}
            </Typography>
            <Typography sx={{ mb: 2.5, color: "text.secondary", textAlign: "center", fontSize: "1rem", lineHeight: 1.45 }}>
              {t("kioskResetConfirmBody")}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row-reverse" }} spacing={1.25} justifyContent="stretch">
              <Button
                type="button"
                variant="contained"
                disableElevation
                onClick={handleConfirm}
                sx={{
                  flex: 1,
                  minHeight: 52,
                  minWidth: 0,
                  bgcolor: BRAND_GOLD,
                  color: "#0a0a0a",
                  "&:hover": { bgcolor: "#d4a855" },
                }}
              >
                {t("kioskResetConfirm")}
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={closeConfirm}
                sx={{ flex: 1, minHeight: 52, minWidth: 0, borderColor: "rgba(205,153,65,0.45)", color: "common.white" }}
              >
                {t("kioskResetCancel")}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </>
  );
}
