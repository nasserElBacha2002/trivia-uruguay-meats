import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { kioskCardShimmerSweep } from "../../animations/kioskKeyframes";
import { mediaNoReducedMotion, mediaReducedMotion } from "../../theme/motion";

type ShimmerOverlayProps = {
  /** Seconds between shimmer passes (base; stagger added separately on parent). */
  cycleSec?: number;
  /** Initial delay before first sweep (seconds). */
  delaySec?: number;
  sx?: SxProps<Theme>;
};

/**
 * Idle gold shimmer that crosses a card periodically — no hover.
 * Parent must be `position: relative` + `overflow: hidden`.
 */
export function ShimmerOverlay({ cycleSec = 7.5, delaySec = 0.4, sx }: ShimmerOverlayProps) {
  return (
    <Box
      aria-hidden
      sx={[
        {
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            left: "-40%",
            width: "38%",
            background: "linear-gradient(102deg, transparent 0%, rgba(255,255,255,0.12) 45%, transparent 100%)",
            [mediaNoReducedMotion]: {
              animation: `${kioskCardShimmerSweep} ${cycleSec}s cubic-bezier(0.45, 0, 0.25, 1) infinite`,
              animationDelay: `${delaySec}s`,
            },
            [mediaReducedMotion]: { display: "none" },
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  );
}
