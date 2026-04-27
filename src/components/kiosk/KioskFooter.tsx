import { Box, Typography } from "@mui/material";
import { BRAND_GOLD } from "../../theme/appTheme";

/** Pie fijo del kiosk: solo marca URUGUAY LAMB (sin position fixed). */
export function KioskFooter() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        boxSizing: "border-box",
        px: 2,
        borderTop: "1px solid rgba(205,153,65,0.12)",
      }}
    >
      <Box sx={{ width: 32, height: 5, bgcolor: BRAND_GOLD, borderRadius: 999, flexShrink: 0 }} />
      <Typography
        component="span"
        sx={{
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontWeight: 800,
          fontSize: "clamp(0.95rem, 1.3vw, 1.35rem)",
          color: "text.primary",
        }}
      >
        URUGUAY LAMB
      </Typography>
    </Box>
  );
}
