import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { BRAND_GOLD } from "../../theme/appTheme";

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
          fontSize: "clamp(0.62rem, 1.5vw, 0.75rem)",
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
  /** Área principal (pregunta, formulario, cards…). Sin scroll en el contenedor. */
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
 * Layout fijo vertical tipo kiosk (objetivo 1080×1920): tres bandas sin scroll global.
 * Header ~14–18% del alto, contenido flexible, footer ~7–8%.
 */
export function KioskLayout({ header, children, footer, rootSx, contentSx }: KioskLayoutProps) {
  const resolvedFooter = footer === undefined ? <KioskFooterBrand /> : footer;

  return (
    <Box
      sx={[
        {
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
          maxHeight: { xs: "18vh", sm: "17vh" },
          minHeight: { xs: "10vh", sm: "11vh" },
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          px: 2,
          pt: 0.5,
          pb: 0.5,
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
            px: { xs: 1.75, sm: 2.5 },
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
            minHeight: { xs: "6vh", sm: "7vh" },
            maxHeight: { xs: "9vh", sm: "8vh" },
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            borderTop: "1px solid rgba(205,153,65,0.1)",
            boxSizing: "border-box",
          }}
        >
          {resolvedFooter}
        </Box>
      ) : null}
    </Box>
  );
}
