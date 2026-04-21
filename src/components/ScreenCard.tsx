import type { ReactNode } from "react";
import { Box, Paper, Typography } from "@mui/material";

type ScreenCardProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function ScreenCard({ title, subtitle, children }: ScreenCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        borderRadius: 5,
        p: { xs: 3, md: 6 },
        border: "1px solid rgba(229,226,225,0.08)",
        background:
          "linear-gradient(180deg, rgba(42,42,42,0.92) 0%, rgba(28,27,27,0.92) 100%)",
        boxShadow: "0 30px 70px rgba(0,0,0,0.35)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Box sx={{ maxWidth: "min(1100px, 100%)" }}>
        <Typography variant="h2" color="text.primary">
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="h5" sx={{ mt: 1.5, color: "text.secondary", fontWeight: 400 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
    </Paper>
  );
}
