import { Box } from "@mui/material";
import type { ReactNode } from "react";
import {
  sectorIdleFloatY,
  sectorIdleMiniBounce,
  sectorIdleOtherPulse,
  sectorIdlePulse,
  sectorIdleSlowPulse,
  sectorIdleWobble,
} from "../../animations/kioskKeyframes";
import { mediaNoReducedMotion, mediaReducedMotion } from "../../theme/motion";

const sectorIdleCss: Record<string, string | undefined> = {
  sector_importador: `${sectorIdleFloatY} 3.2s ease-in-out infinite`,
  sector_distribuidor: `${sectorIdlePulse} 2.8s ease-in-out infinite`,
  sector_varejo_supermercado: `${sectorIdleMiniBounce} 2.4s ease-in-out infinite`,
  sector_foodservice_restaurante: `${sectorIdleWobble} 3.6s ease-in-out infinite`,
  sector_industria: `${sectorIdleSlowPulse} 4.2s ease-in-out infinite`,
  sector_outro: `${sectorIdleOtherPulse} 2.2s ease-in-out infinite`,
};

/**
 * Wraps sector option icons with independent idle motion (kiosk, no hover).
 * Each sector id maps to a distinct subtle loop.
 */
export function SectorIconIdle({ optionId, children }: { optionId: string; children: ReactNode }) {
  const anim = sectorIdleCss[optionId] ?? sectorIdleCss.sector_outro;
  return (
    <Box
      sx={{
        lineHeight: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        [mediaNoReducedMotion]: anim ? { animation: anim } : undefined,
        [mediaReducedMotion]: { animation: "none" },
      }}
    >
      {children}
    </Box>
  );
}
