import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MEDIA_ASSETS } from "../config/mediaAssets";

type BrandLogoProps = {
  prominence?: "hero" | "standard";
};

export function BrandLogo({ prominence = "standard" }: BrandLogoProps) {
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

  return (
    <Box
      component="img"
      src={MEDIA_ASSETS.logo}
      alt="Uruguay Lamb"
      sx={{
        display: "block",
        margin: "0 auto",
        width: prominence === "hero" ? heroW : standardW,
        maxWidth: "100%",
        height: "auto",
        objectFit: "contain",
        filter: prominence === "standard" ? "drop-shadow(0 2px 12px rgba(0,0,0,0.5))" : "none",
      }}
      onError={() => setAssetMissing(true)}
    />
  );
}
