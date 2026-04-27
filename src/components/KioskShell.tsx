import { Box, Typography } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "../config/routes";
import { useKioskGuards } from "../hooks/useKioskGuards";
import { useInactivityReset } from "../hooks/useInactivityReset";
import { MEDIA_ASSETS } from "../config/mediaAssets";
import { BRAND_GOLD } from "../theme/appTheme";
import { BrandLogo } from "./BrandLogo";

export function KioskShell() {
  useKioskGuards();
  useInactivityReset();
  const location = useLocation();

  const progressByRoute: Record<string, string> = {
    [ROUTES.attract]: "12%",
    [ROUTES.language]: "25%",
    [ROUTES.form]: "44%",
    [ROUTES.quiz]: "72%",
    [ROUTES.result]: "100%",
  };

  const threadWidth = progressByRoute[location.pathname] ?? "12%";
  const isAttract = location.pathname === ROUTES.attract;

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        color: "text.primary",
        overflow: "hidden",
        background: isAttract
          ? "#000000"
          : `radial-gradient(circle at 12% 10%, rgba(205,153,65,0.12) 0%, transparent 42%), radial-gradient(circle at 88% 92%, rgba(205,153,65,0.08) 0%, #000000 45%), #000000`,
      }}
    >
      {!isAttract ? (
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            backgroundImage: `url(${MEDIA_ASSETS.kioskAmbient})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.12,
          }}
        />
      ) : null}

      {!isAttract ? (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              borderRadius: "50%",
              filter: "blur(42px)",
              opacity: 0.22,
            },
            "&::before": {
              width: { xs: 260, md: 420 },
              height: { xs: 260, md: 420 },
              top: { xs: -90, md: -120 },
              right: { xs: -80, md: -100 },
              background: "rgba(205,153,65,0.35)",
            },
            "&::after": {
              width: { xs: 280, md: 500 },
              height: { xs: 280, md: 500 },
              bottom: { xs: -130, md: -170 },
              left: { xs: -110, md: -160 },
              background: "rgba(40,40,40,0.85)",
            },
          }}
        />
      ) : null}

      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 7,
          zIndex: 50,
          bgcolor: "rgba(255,255,255,0.1)",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: threadWidth,
            bgcolor: BRAND_GOLD,
            transition: "width 240ms ease",
            boxShadow: `0 0 24px rgba(205, 153, 65, 0.55)`,
          }}
        />
      </Box>

      {!isAttract ? (
        <Box
          sx={{
            position: "fixed",
            top: { xs: 22, md: 28 },
            left: { xs: 16, md: 28 },
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            maxWidth: { xs: "min(88vw, 220px)", md: "min(42vw, 280px)" },
          }}
        >
          <BrandLogo size={168} prominence="standard" />
        </Box>
      ) : null}

      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          pt: isAttract ? 0 : { xs: 13, md: 16 },
          px: isAttract ? 0 : { xs: 2.5, md: 5.5, lg: 8 },
          pb: isAttract ? 0 : { xs: 3, md: 4 },
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "100%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {!isAttract ? (
        <Box
          sx={{
            position: "fixed",
            left: { xs: 22, md: 38 },
            bottom: { xs: 20, md: 26 },
            zIndex: 25,
            display: "flex",
            alignItems: "center",
            gap: 1,
            pointerEvents: "none",
          }}
        >
          <Box sx={{ width: 28, height: 4, bgcolor: BRAND_GOLD, borderRadius: 999 }} />
          <Typography
            variant="caption"
            sx={{
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              opacity: 0.72,
              fontWeight: 800,
              fontSize: "0.7rem",
              color: "text.primary",
            }}
          >
            URUGUAY LAMB
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}
