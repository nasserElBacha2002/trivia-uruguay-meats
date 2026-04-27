import { Box, LinearProgress, Stack } from "@mui/material";
import { BrandLogo } from "../BrandLogo";
import { BRAND_GOLD } from "../../theme/appTheme";

export type KioskHeaderLogoSize = "hero" | "standard";

export type KioskHeaderProps = {
  logoSize?: KioskHeaderLogoSize;
  /** 0–100: muestra barra bajo el logo. Omitir para ocultar barra. */
  progress?: number;
};

export function KioskHeader({ logoSize = "standard", progress }: KioskHeaderProps) {
  const showProgress = typeof progress === "number" && !Number.isNaN(progress);

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1.25}
      sx={{
        width: "100%",
        maxWidth: "min(860px, 86vw)",
        mx: "auto",
        height: "100%",
        minHeight: 0,
        py: 1,
        boxSizing: "border-box",
      }}
    >
      <BrandLogo prominence={logoSize === "hero" ? "hero" : "standard"} />
      {showProgress ? (
        <Box sx={{ width: "100%", maxWidth: "min(760px, 82vw)" }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              width: "100%",
              height: "clamp(6px, 0.7dvh, 10px)",
              borderRadius: 99,
              bgcolor: "rgba(229,226,225,0.12)",
              "& .MuiLinearProgress-bar": {
                bgcolor: BRAND_GOLD,
                background: `linear-gradient(90deg, ${BRAND_GOLD} 0%, rgba(232, 200, 130, 0.95) 100%)`,
              },
            }}
          />
        </Box>
      ) : null}
    </Stack>
  );
}
