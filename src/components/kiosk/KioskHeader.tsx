import { Box, LinearProgress, Stack } from "@mui/material";
import { BrandLogo } from "../BrandLogo";
import { BRAND_GOLD } from "../../theme/appTheme";

export type KioskHeaderLogoSize = "hero" | "standard";

export type KioskHeaderProps = {
  logoSize?: KioskHeaderLogoSize;
  /** 0–100: muestra barra bajo el logo. Omitir para ocultar barra. */
  progress?: number;
  /** Attract-only: logo entrance + idle float on the Uruguay Lamb lockup. */
  brandMotion?: "attract";
};

export function KioskHeader({ logoSize = "standard", progress, brandMotion }: KioskHeaderProps) {
  const showProgress = typeof progress === "number" && !Number.isNaN(progress);
  const headerMax =
    logoSize === "hero" ? "min(760px, 92vw)" : "min(520px, 88vw)";

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1.25}
      sx={{
        width: "100%",
        maxWidth: headerMax,
        mx: "auto",
        py: 1,
        boxSizing: "border-box",
        overflow: "visible",
        flexShrink: 0,
      }}
    >
      <BrandLogo prominence={logoSize === "hero" ? "hero" : "standard"} brandMotion={brandMotion} />
      {showProgress ? (
        <Box sx={{ width: "100%", maxWidth: "min(720px, 90vw)" }}>
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
                transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
              },
            }}
          />
        </Box>
      ) : null}
    </Stack>
  );
}
