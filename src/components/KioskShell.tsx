import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "../config/routes";
import { useKioskGuards } from "../hooks/useKioskGuards";
import { useInactivityReset } from "../hooks/useInactivityReset";
import { MEDIA_ASSETS } from "../config/mediaAssets";
import { BRAND_GOLD } from "../theme/appTheme";

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
        height: "100dvh",
        maxHeight: "100vh",
        width: "100vw",
        maxWidth: "100%",
        position: "relative",
        color: "text.primary",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#000000",
        boxSizing: "border-box",
        background: isAttract
          ? "#000000"
          : `radial-gradient(circle at 12% 10%, rgba(205,153,65,0.1) 0%, transparent 42%), radial-gradient(circle at 88% 92%, rgba(205,153,65,0.06) 0%, #000000 45%), #000000`,
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
            opacity: 0.1,
          }}
        />
      ) : null}

      <Box
        sx={{
          position: "relative",
          zIndex: 50,
          flexShrink: 0,
          height: 7,
          width: "100%",
          bgcolor: "rgba(255,255,255,0.1)",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: threadWidth,
            bgcolor: BRAND_GOLD,
            transition: "width 240ms ease",
            boxShadow: `0 0 20px rgba(205, 153, 65, 0.45)`,
          }}
        />
      </Box>

      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          flex: "1 1 0%",
          minHeight: 0,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
