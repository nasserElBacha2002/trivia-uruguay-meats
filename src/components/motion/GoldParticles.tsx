import { Box, useMediaQuery } from "@mui/material";
import { kioskParticleDrift } from "../../animations/kioskKeyframes";
import { BRAND_GOLD } from "../../theme/appTheme";

const COUNT = 14;

/** Subtle drifting gold specks — high-score result only; disabled with reduced motion. */
export function GoldParticles() {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  if (reduceMotion) return null;

  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {Array.from({ length: COUNT }).map((_, i) => {
        const left = ((i * 67 + 11) % 92) + 4;
        const dur = 5.5 + (i % 5) * 0.55;
        const delay = i * 0.35;
        const size = 3 + (i % 3);
        return (
          <Box
            key={i}
            sx={{
              position: "absolute",
              left: `${left}%`,
              bottom: "-6%",
              width: size,
              height: size,
              borderRadius: "50%",
              bgcolor: BRAND_GOLD,
              opacity: 0,
              animation: `${kioskParticleDrift} ${dur}s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </Box>
  );
}
