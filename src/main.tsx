import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./app/router";
import { SessionProvider } from "./features/session/useSessionStore";
import { appTheme } from "./theme/appTheme";
import "./i18n";
import "./app/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <SessionProvider>
        <RouterProvider router={appRouter} />
      </SessionProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
