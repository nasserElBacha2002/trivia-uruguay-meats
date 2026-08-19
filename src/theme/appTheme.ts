import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    brand: {
      gold: string;
      goldMuted: string;
      surface: string;
    };
  }

  interface PaletteOptions {
    brand?: {
      gold: string;
      goldMuted: string;
      surface: string;
    };
  }
}

/** Campaign accent — PANTONE 7407 C / client spec */
export const BRAND_GOLD = "#CD9941";

/** Campaign display face (GFS Didot OFL — Didot Regular). Italic via font-style. */
export const FONT_DIDOT = '"GFS Didot", "Didot", serif';

export const appTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: BRAND_GOLD,
      contrastText: "#0a0a0a",
    },
    secondary: {
      main: BRAND_GOLD,
      contrastText: "#0a0a0a",
    },
    text: {
      primary: "#F7F2EA",
      secondary: "rgba(247, 242, 234, 0.72)",
    },
    background: {
      default: "#000000",
      paper: "#121212",
    },
    brand: {
      gold: BRAND_GOLD,
      goldMuted: "rgba(205, 153, 65, 0.55)",
      surface: "#141414",
    },
  },
  typography: {
    fontFamily: "'PT Sans', sans-serif",
    h1: { fontFamily: FONT_DIDOT, fontWeight: 400, lineHeight: 1.08, fontSize: "3.2rem" },
    h2: { fontFamily: FONT_DIDOT, fontWeight: 400, lineHeight: 1.12, fontSize: "2.4rem" },
    h3: { fontFamily: FONT_DIDOT, fontWeight: 400, lineHeight: 1.15, fontSize: "2rem" },
    h4: { fontFamily: FONT_DIDOT, fontWeight: 400, lineHeight: 1.2, fontSize: "1.6rem" },
    h5: { fontWeight: 700, lineHeight: 1.3, fontSize: "1.35rem" },
    h6: { fontWeight: 700, lineHeight: 1.3 },
    button: { fontWeight: 700, textTransform: "none" },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 68,
          minWidth: 220,
          borderRadius: 14,
          paddingInline: 28,
          fontSize: "1.05rem",
          letterSpacing: "0.01em",
        },
        contained: {
          background: `linear-gradient(135deg, ${BRAND_GOLD} 0%, #b88735 100%)`,
          color: "#0a0a0a",
          "&:hover": {
            background: `linear-gradient(135deg, #d4a855 0%, ${BRAND_GOLD} 100%)`,
          },
        },
        outlined: {
          borderColor: "rgba(229, 226, 225, 0.36)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            minHeight: 62,
            borderRadius: 12,
          },
        },
      },
    },
  },
});
