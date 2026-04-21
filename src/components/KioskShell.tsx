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
        backgroundColor: "background.default",
        color: "text.primary",
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "88px 1fr",
      }}
    >
      <Box
        component="header"
        sx={{
          display: "flex",
          alignItems: "center",
          px: 4,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "common.white",
        }}
      >
        <BrandLogo />
      </Box>

      <Container
        maxWidth={false}
        sx={{
          py: 4,
          px: { xs: 3, md: 6 },
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
