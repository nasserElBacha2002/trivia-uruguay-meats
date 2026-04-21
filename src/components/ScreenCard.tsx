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
        borderRadius: 3,
        p: { xs: 3, md: 5 },
        border: "1px solid",
        borderColor: "rgba(0, 47, 108, 0.12)",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Box>
        <Typography variant="h3" color="primary.main">
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="h6" sx={{ mt: 1, color: "text.secondary" }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
    </Paper>
  );
}
