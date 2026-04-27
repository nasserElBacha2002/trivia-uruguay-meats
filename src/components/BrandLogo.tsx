import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MEDIA_ASSETS } from "../config/mediaAssets";

type BrandLogoProps = {
  /** Ancho máximo referencial (px) en `standard` en desktop; ignorado en `hero`. */
  size?: number;
  /** `hero`: placa inicial (grande). `standard`: pantallas internas (más compacto). */
  prominence?: "hero" | "standard";
};

export function BrandLogo({ size = 152, prominence = "standard" }: BrandLogoProps) {
  const { t } = useTranslation();
  const [assetMissing, setAssetMissing] = useState(false);

  if (assetMissing) {
    return (
      <Box
        sx={{
          maxWidth: prominence === "hero" ? 440 : Math.max(size, 120),
          border: "1px dashed rgba(205, 153, 65, 0.65)",
          borderRadius: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 1.25,
          bgcolor: "rgba(205, 153, 65, 0.08)",
        }}
      >
        <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 800, textAlign: "center", letterSpacing: "0.12em" }}>
          {t("missingLogoLabel")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={MEDIA_ASSETS.logo}
      alt="Uruguay Lamb"
      sx={{
        display: "block",
        width:
          prominence === "hero"
            ? { xs: "min(88vw, 360px)", sm: "min(72vw, 400px)", md: 440 }
            : { xs: "clamp(120px, 36vw, 200px)", sm: "clamp(132px, 26vw, 176px)", md: size },
        maxWidth: "100%",
        height: "auto",
        objectFit: "contain",
        objectPosition: "left center",
        filter: prominence === "standard" ? "drop-shadow(0 2px 14px rgba(0,0,0,0.55))" : "none",
      }}
      onError={() => setAssetMissing(true)}
    />
  );
}
