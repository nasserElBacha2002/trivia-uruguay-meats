import { Box } from "@mui/material";

type BrandLogoProps = {
  size?: number;
};

export function BrandLogo({ size = 120 }: BrandLogoProps) {
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
        // Keep reserved area for the official logo until the real asset is provided.
        event.currentTarget.style.visibility = "hidden";
      }}
    />
  );
}
