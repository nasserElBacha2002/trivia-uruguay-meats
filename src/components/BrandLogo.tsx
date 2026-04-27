import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MEDIA_ASSETS } from "../config/mediaAssets";

type BrandLogoProps = {
  /** Ancho máximo referencial (px) en `standard` (pantallas internas); ignorado en `hero`. */
  size?: number;
  /** `hero`: placa inicial (280–420px). `standard`: 140–180px, centrado con el contenedor. */
  prominence?: "hero" | "standard";
};

export function BrandLogo({ size = 160, prominence = "standard" }: BrandLogoProps) {
  const { t } = useTranslation();
  const [assetMissing, setAssetMissing] = useState(false);

  if (assetMissing) {
    return (
      <Box
        sx={{
          maxWidth: prominence === "hero" ? 420 : Math.max(size, 120),
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
        mx: "auto",
        width:
          prominence === "hero"
            ? "clamp(280px, 42vw, 420px)"
            : { xs: "clamp(140px, 36vw, 180px)", sm: "clamp(148px, 28vw, 176px)", md: size },
        maxWidth: "100%",
        height: "auto",
        objectFit: "contain",
        filter: prominence === "standard" ? "drop-shadow(0 2px 12px rgba(0,0,0,0.5))" : "none",
      }}
      onError={() => setAssetMissing(true)}
    />
  );
}
