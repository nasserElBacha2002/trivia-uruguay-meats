import { Box } from "@mui/material";

type KioskRightOcclusionProps = {
  /** Stacking order behind page content (default sits under z-index 1 content). */
  zIndex?: number;
};

/**
 * Vertical editorial panel on the right (Stitch-style): adds depth and anchors layout
 * across Language, Form, and Quiz. Pointer-events none; purely visual.
 */
export function KioskRightOcclusion({ zIndex = 0 }: KioskRightOcclusionProps) {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: { xs: "58%", sm: "48%", md: "40%", lg: "36%" },
          height: "100%",
          background:
            "linear-gradient(270deg, rgba(12,12,12,0.94) 0%, rgba(12,12,12,0.5) 42%, rgba(0,0,0,0) 100%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: { xs: "-6%", md: "-10%" },
          right: { xs: "-18%", md: "-8%" },
          width: { xs: "72%", md: "46%" },
          height: { xs: "72%", md: "118%" },
          borderRadius: 3,
          background:
            "linear-gradient(200deg, rgba(205,153,65,0.14) 0%, rgba(8,8,8,0.82) 45%, rgba(205,153,65,0.06) 100%)",
          opacity: 0.92,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          maskImage: "linear-gradient(120deg, transparent 0%, #000 38%, #000 100%)",
          WebkitMaskImage: "linear-gradient(120deg, transparent 0%, #000 38%, #000 100%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: { xs: "52%", md: "34%" },
          height: "100%",
          opacity: 0.12,
          backgroundImage:
            "repeating-linear-gradient(-12deg, rgba(255,255,255,0.09) 0px, rgba(255,255,255,0.09) 1px, transparent 1px, transparent 22px)",
        }}
      />
    </Box>
  );
}
