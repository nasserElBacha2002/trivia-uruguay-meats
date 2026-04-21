import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type BrandLogoProps = {
  size?: number;
};

export function BrandLogo({ size = 120 }: BrandLogoProps) {
  const { t } = useTranslation();
  const [assetMissing, setAssetMissing] = useState(false);

  if (assetMissing) {
    return (
      <Box
        sx={{
          width: size,
          height: size * 0.32,
          border: "1px dashed rgba(255,184,28,0.7)",
          borderRadius: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 1,
          bgcolor: "rgba(0,47,108,0.25)",
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "secondary.main", fontWeight: 700, textAlign: "center" }}
        >
          {t("missingLogoLabel")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src="/assets/uruguay-meats-logo.svg"
      alt="Uruguay Meats"
      sx={{
        width: size,
        height: size * 0.32,
        objectFit: "contain",
        display: "block",
      }}
      onError={(event) => {
        event.currentTarget.style.display = "none";
        setAssetMissing(true);
      }}
    />
  );
}
