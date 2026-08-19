import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { KioskFooter } from "./KioskFooter";

export type KioskScreenVariant = "default" | "hero";

export type KioskScreenProps = {
  variant?: KioskScreenVariant;
  header: ReactNode;
  /** Si no se pasa, se usa `KioskFooter`. `null` = sin pie. */
  footer?: ReactNode | null;
  children: ReactNode;
  /** Foto de campaña a pantalla completa, con velo negro para leer texto. */
  backdropSrc?: string;
  /** p.ej. `bgcolor: 'transparent'` en attract sobre foto */
  rootSx?: SxProps<Theme>;
};

const gridRows: Record<KioskScreenVariant, string> = {
  default: "minmax(180px, 18dvh) minmax(0, 1fr) minmax(72px, 8dvh)",
  hero: "minmax(240px, 24dvh) minmax(0, 1fr) minmax(72px, 8dvh)",
};

/**
 * Layout global del kiosk: CSS grid de tres filas (header / main / footer).
 * Ocupa el 100% del alto del padre; `KioskShell` fija el viewport (`100dvh` / `100vh`).
 */
export function KioskScreen({ variant = "default", header, footer, children, backdropSrc, rootSx }: KioskScreenProps) {
  const resolvedFooter = footer === undefined ? <KioskFooter /> : footer;

  return (
    <Box
      sx={[
        {
          position: "relative",
          width: "100%",
          minHeight: "100%",
          height: "100%",
          maxHeight: "100%",
          overflowX: "hidden",
          overflowY: "auto",
          bgcolor: "#000000",
          color: "text.primary",
          display: "grid",
          gridTemplateRows: gridRows[variant],
          gridTemplateAreas: '"khead" "kmain" "kfoot"',
          boxSizing: "border-box",
        },
        ...(rootSx ? [rootSx] : []),
      ] as SxProps<Theme>}
    >
      {backdropSrc ? (
        <>
          <Box
            component="img"
            src={backdropSrc}
            alt=""
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.7) 42%, rgba(0,0,0,0.84) 100%)",
            }}
          />
        </>
      ) : null}
      <Box
        sx={{
          gridArea: "khead",
          position: "relative",
          zIndex: 1,
          minHeight: 0,
          overflow: "visible",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {header}
      </Box>

      <Box
        sx={{
          gridArea: "kmain",
          position: "relative",
          zIndex: 1,
          minHeight: 0,
          overflowX: "hidden",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        {children}
      </Box>

      {resolvedFooter !== null ? (
        <Box sx={{ gridArea: "kfoot", position: "relative", zIndex: 1, minHeight: 0, overflow: "hidden" }}>{resolvedFooter}</Box>
      ) : null}
    </Box>
  );
}
