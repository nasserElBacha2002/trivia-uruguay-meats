import { Box, Typography } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "../config/routes";
import { useKioskGuards } from "../hooks/useKioskGuards";
import { useInactivityReset } from "../hooks/useInactivityReset";
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

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        color: "text.primary",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 10% 8%, rgba(0,47,108,0.6) 0%, rgba(0,27,68,0.94) 34%), radial-gradient(circle at 84% 88%, rgba(255,184,28,0.16) 0%, rgba(0,27,68,0.96) 38%), #001b44",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            borderRadius: "50%",
            filter: "blur(42px)",
            opacity: 0.3,
          },
          "&::before": {
            width: { xs: 260, md: 420 },
            height: { xs: 260, md: 420 },
            top: { xs: -90, md: -120 },
            right: { xs: -80, md: -100 },
            background: "rgba(255,184,28,0.45)",
          },
          "&::after": {
            width: { xs: 280, md: 500 },
            height: { xs: 280, md: 500 },
            bottom: { xs: -130, md: -170 },
            left: { xs: -110, md: -160 },
            background: "rgba(31,101,199,0.5)",
          },
        }}
      />

      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 7,
          zIndex: 50,
          bgcolor: "rgba(255,255,255,0.16)",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: threadWidth,
            bgcolor: "secondary.main",
            transition: "width 240ms ease",
            boxShadow: "0 0 24px rgba(255,184,28,0.7)",
          }}
        />
      </Box>

      <Box
        sx={{
          position: "fixed",
          top: { xs: 28, md: 38 },
          left: { xs: 22, md: 38 },
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <BrandLogo size={148} />
      </Box>

      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          pt: { xs: 12, md: 16 },
          px: { xs: 2.5, md: 5.5, lg: 8 },
          pb: { xs: 3, md: 4 },
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
        <Box sx={{ width: 28, height: 4, bgcolor: "secondary.main", borderRadius: 999 }} />
        <Typography
          variant="caption"
          sx={{ letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, fontWeight: 700 }}
        >
          Uruguay Meats
        </Typography>
      </Box>
    </Box>
  );
}
