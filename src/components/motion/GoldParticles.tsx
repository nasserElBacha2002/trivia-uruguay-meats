import { Box, useMediaQuery } from "@mui/material";
import { kioskParticleDrift, kioskParticleDriftMedium, kioskParticleDriftSubtle } from "../../animations/kioskKeyframes";
import { BRAND_GOLD } from "../../theme/appTheme";

export type GoldParticlesProps = {
  /** Number of specks (e.g. high ~14, medium 6–8, low 2–3). */
  count?: number;
  /** Scales motion “busyness”: >1 shorter drift cycles, <1 slower/softer. */
  intensity?: number;
  /** Base seconds for drift; variance added per particle. */
  durationBase?: number;
  /** Opacity of the whole particle layer (0–1). */
  opacityMax?: number;
  /** Keyframe preset — sets peak brightness and drift feel. */
  drift?: "full" | "medium" | "subtle";
};

const driftKeyframes = {
  full: kioskParticleDrift,
  medium: kioskParticleDriftMedium,
  subtle: kioskParticleDriftSubtle,
} as const;

/**
 * Drifting gold specks over the result hero — `drift` + `count` tune visibility per score band.
 */
export function GoldParticles({
  count = 14,
  intensity = 1,
  durationBase = 5.5,
  opacityMax = 1,
  drift = "full",
}: GoldParticlesProps) {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  if (reduceMotion) return null;

  const keyframe = driftKeyframes[drift];
  const safeCount = Math.max(0, Math.min(24, Math.round(count)));
  const safeLayerOpacity = Math.max(0.2, Math.min(1, opacityMax));
  const durScale = Math.max(0.65, Math.min(1.4, 1 / intensity));

  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
        opacity: safeLayerOpacity,
      }}
    >
      {Array.from({ length: safeCount }).map((_, i) => {
        const left = ((i * 67 + 11) % 92) + 4;
        const dur = (durationBase + (i % 5) * 0.55) * durScale;
        const delay = i * 0.38;
        const size = 2 + (i % 3) + (drift === "full" ? 1 : 0);
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
              animation: `${keyframe} ${dur}s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </Box>
  );
}
