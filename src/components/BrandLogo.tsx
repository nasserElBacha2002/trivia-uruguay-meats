import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { kioskLogoEnter, kioskLogoFloat } from "../animations/kioskKeyframes";
import { MEDIA_ASSETS } from "../config/mediaAssets";
import { mediaNoReducedMotion, mediaReducedMotion } from "../theme/motion";

type BrandLogoProps = {
  prominence?: "hero" | "standard";
  /** Attract hero: one-shot fade/slide in + subtle floating idle on the lockup. */
  brandMotion?: "attract";
};

export function BrandLogo({ prominence = "standard", brandMotion }: BrandLogoProps) {
  const { t } = useTranslation();
  const [assetMissing, setAssetMissing] = useState(false);

  const heroW = "clamp(420px, 46vw, 680px)";
  const standardW = "clamp(300px, 30vw, 460px)";

  if (assetMissing) {
    return (
      <Box
        sx={{
          width: prominence === "hero" ? heroW : standardW,
          maxWidth: "100%",
          border: "1px dashed rgba(205, 153, 65, 0.65)",
          borderRadius: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 1.25,
          bgcolor: "rgba(205, 153, 65, 0.08)",
          margin: "0 auto",
        }}
      >
        <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 800, textAlign: "center", letterSpacing: "0.12em" }}>
          {t("missingLogoLabel")}
        </Typography>
      </Box>
    );
  }

  const imgSx = {
    display: "block",
    margin: "0 auto",
    width: prominence === "hero" ? heroW : standardW,
    maxWidth: "100%",
    height: "auto",
    objectFit: "contain" as const,
    filter: prominence === "standard" ? "drop-shadow(0 2px 12px rgba(0,0,0,0.5))" : "none",
  };

  if (brandMotion === "attract") {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          [mediaNoReducedMotion]: {
            animation: `${kioskLogoEnter} 0.85s cubic-bezier(0.22, 1, 0.36, 1) both`,
          },
          [mediaReducedMotion]: { animation: "none" },
        }}
      >
        <Box
          sx={{
            display: "inline-block",
            [mediaNoReducedMotion]: {
              animation: `${kioskLogoFloat} 5.5s ease-in-out infinite`,
              animationDelay: "0.75s",
            },
            [mediaReducedMotion]: { animation: "none" },
          }}
        >
          <Box
            component="img"
            src={MEDIA_ASSETS.logo}
            alt="Uruguay Lamb"
            sx={imgSx}
            onError={() => setAssetMissing(true)}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={MEDIA_ASSETS.logo}
      alt="Uruguay Lamb"
      sx={imgSx}
      onError={() => setAssetMissing(true)}
    />
  );
}
