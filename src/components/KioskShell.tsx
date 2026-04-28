import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "../config/routes";
import { useKioskGuards } from "../hooks/useKioskGuards";
import { useInactivityReset } from "../hooks/useInactivityReset";
import { MEDIA_ASSETS } from "../config/mediaAssets";
import { ResetControl } from "./ResetControl";

export function KioskShell() {
  useKioskGuards();
  useInactivityReset();
  const location = useLocation();
  const isAttract = location.pathname === ROUTES.attract;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "100dvh",
        maxHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        position: "relative",
        color: "text.primary",
        overflowX: "hidden",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        bgcolor: "#000000",
        ...(isAttract
          ? {}
          : {
              backgroundImage: `radial-gradient(circle at 12% 10%, rgba(205,153,65,0.1) 0%, transparent 42%), radial-gradient(circle at 88% 92%, rgba(205,153,65,0.06) 0%, transparent 50%), url(${MEDIA_ASSETS.kioskAmbient})`,
              backgroundSize: "cover, cover, cover",
              backgroundPosition: "center, center, center",
              backgroundRepeat: "no-repeat, no-repeat, no-repeat",
              boxShadow: "inset 0 0 0 9999px rgba(0,0,0,0.88)",
            }),
      }}
    >
      <ResetControl />
      <Box
        sx={{
          flex: "1 1 0%",
          minHeight: 0,
          width: "100%",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
