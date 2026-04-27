import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { BRAND_GOLD } from "../../theme/appTheme";

const kioskVars = {
  "--kiosk-footer-min": "clamp(48px, 5.5dvh, 72px)",
  "--kiosk-header-max": "min(40dvh, 360px)",
} as const;

/** Marca fija en el pie del kiosk (no “Uruguay Meats”). */
export function KioskFooterBrand() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.25,
        width: "100%",
        height: "100%",
        minHeight: 44,
        flexShrink: 0,
        pointerEvents: "none",
      }}
    >
      <Box sx={{ width: 28, height: 4, bgcolor: BRAND_GOLD, borderRadius: 999 }} />
      <Typography
        component="span"
        sx={{
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          fontWeight: 800,
          fontSize: "clamp(0.62rem, min(1.5vw, 2.2dvh), 0.78rem)",
          color: "text.primary",
          opacity: 0.88,
        }}
      >
        URUGUAY LAMB
      </Typography>
    </Box>
  );
}

export type KioskLayoutProps = {
  /** Barra superior: logo, progreso, etc. Centrado horizontalmente. */
  header?: ReactNode;
  /** Área principal (pregunta, formulario, cards…). Sin scroll global en la app. */
  children: ReactNode;
  /**
   * Pie fijo. Si no se pasa, se muestra `KioskFooterBrand`.
   * Pasar `null` para ocultar el pie por completo (casos raros).
   */
  footer?: ReactNode | null;
  /** Estilos del contenedor raíz (p.ej. `bgcolor: 'transparent'` en attract). */
  rootSx?: SxProps<Theme>;
  /** Estilos del área central (p.ej. `justifyContent: 'flex-start'` en formularios). */
  contentSx?: SxProps<Theme>;
};

/**
 * Layout vertical tipo kiosk: columna en todo el viewport disponible del padre.
 * Pensado para monitores táctiles verticales de resolución variable (sin asumir un tamaño fijo).
 */
export function KioskLayout({ header, children, footer, rootSx, contentSx }: KioskLayoutProps) {
  const resolvedFooter = footer === undefined ? <KioskFooterBrand /> : footer;

  return (
    <Box
      sx={[
        {
          ...kioskVars,
          width: "100%",
          height: "100%",
          maxHeight: "100%",
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#000000",
          color: "text.primary",
          boxSizing: "border-box",
        },
        ...(rootSx ? [rootSx] : []),
      ] as SxProps<Theme>}
    >
      <Box
        sx={{
          flex: "0 0 auto",
          maxHeight: "var(--kiosk-header-max)",
          width: "100%",
          overflow: "visible",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 1.5, sm: 2 },
          py: { xs: 0.75, sm: 1 },
          boxSizing: "border-box",
        }}
      >
        {header}
      </Box>

      <Box
        sx={[
          {
            flex: "1 1 0%",
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            px: { xs: 1.5, sm: 2.5 },
            boxSizing: "border-box",
          },
          ...(contentSx ? [contentSx] : []),
        ] as SxProps<Theme>}
      >
        {children}
      </Box>

      {resolvedFooter !== null ? (
        <Box
          sx={{
            flex: "0 0 auto",
            flexShrink: 0,
            minHeight: "var(--kiosk-footer-min)",
            maxHeight: "min(12dvh, 120px)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            borderTop: "1px solid rgba(205,153,65,0.1)",
            boxSizing: "border-box",
            pb: "max(0px, env(safe-area-inset-bottom, 0px))",
          }}
        >
          {resolvedFooter}
        </Box>
      ) : null}
    </Box>
  );
}
