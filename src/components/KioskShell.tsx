import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useKioskGuards } from "../hooks/useKioskGuards";
import { BrandLogo } from "./BrandLogo";

export function KioskShell() {
  useKioskGuards();

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        background:
          "radial-gradient(circle at 8% 15%, rgba(0,47,108,0.38) 0%, rgba(19,19,19,1) 34%), radial-gradient(circle at 90% 90%, rgba(255,184,28,0.14) 0%, rgba(19,19,19,1) 36%)",
        color: "text.primary",
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "104px 1fr",
      }}
    >
      <Box
        component="header"
        sx={{
          display: "flex",
          alignItems: "center",
          px: { xs: 3, md: 5 },
          borderBottom: "1px solid",
          borderColor: "rgba(229,226,225,0.14)",
          bgcolor: "rgba(19,19,19,0.68)",
          backdropFilter: "blur(10px)",
        }}
      >
        <BrandLogo />
      </Box>

      <Container
        maxWidth={false}
        sx={{
          py: { xs: 3, md: 4 },
          px: { xs: 2.5, md: 5 },
          overflow: "hidden",
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}
