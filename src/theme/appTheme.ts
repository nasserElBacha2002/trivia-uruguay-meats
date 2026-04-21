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
    mode: "dark",
    primary: {
      main: "#002F6C",
      contrastText: "#E5E2E1",
    },
    secondary: {
      main: "#FFB81C",
      contrastText: "#002F6C",
    },
    text: {
      primary: "#E5E2E1",
      secondary: "#AEADB3",
    },
    background: {
      default: "#131313",
      paper: "#1C1B1B",
    },
    brand: {
      blue: "#002F6C",
      yellow: "#FFB81C",
      gray: "#AEADB3",
    },
  },
  typography: {
    fontFamily: "'PT Sans', sans-serif",
    h1: { fontWeight: 700, lineHeight: 1.05, fontSize: "3.2rem" },
    h2: { fontWeight: 700, lineHeight: 1.1, fontSize: "2.4rem" },
    h3: { fontWeight: 700, lineHeight: 1.15, fontSize: "2rem" },
    h4: { fontWeight: 700, lineHeight: 1.2, fontSize: "1.6rem" },
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
          background: "linear-gradient(135deg, #002F6C 0%, #0F4A99 100%)",
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
