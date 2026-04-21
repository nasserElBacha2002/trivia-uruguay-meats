import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    brand: {
      blue: string;
      yellow: string;
      gray: string;
    };
  }

  interface PaletteOptions {
    brand?: {
      blue: string;
      yellow: string;
      gray: string;
    };
  }
}

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#002F6C",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FFB81C",
      contrastText: "#002F6C",
    },
    text: {
      primary: "#000000",
      secondary: "#AEADB3",
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
    brand: {
      blue: "#002F6C",
      yellow: "#FFB81C",
      gray: "#AEADB3",
    },
  },
  typography: {
    fontFamily: "'PT Sans', sans-serif",
    h1: { fontWeight: 700, lineHeight: 1.1 },
    h2: { fontWeight: 700, lineHeight: 1.1 },
    h3: { fontWeight: 700, lineHeight: 1.2 },
    h4: { fontWeight: 700, lineHeight: 1.2 },
    h5: { fontWeight: 700, lineHeight: 1.3 },
    h6: { fontWeight: 700, lineHeight: 1.3 },
    button: { fontWeight: 700, textTransform: "none" },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 56,
          minWidth: 180,
          paddingInline: 24,
          fontSize: "1rem",
        },
      },
    },
  },
});
