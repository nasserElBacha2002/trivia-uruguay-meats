import { Box, Button, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ScreenCard } from "../components/ScreenCard";
import { ROUTES } from "../config/routes";
import { quizPtContent } from "../content/quizContent";
import { useFlowState } from "../features/session/flowState";

type OptionSelection = Record<string, string>;

export function FormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { markFormCompleted } = useFlowState();
  const [optionSelection, setOptionSelection] = useState<OptionSelection>({});

  const fields = useMemo(() => quizPtContent.dataCollection.fields, []);

  const submitStaticForm = () => {
    markFormCompleted();
    navigate(ROUTES.quiz);
  };

  return (
    <ScreenCard title={t("formTitle")}>
      <Stack gap={3} height="100%" justifyContent="space-between">
        <Box
          sx={{
            display: "grid",
            gap: 2.5,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          {fields.map((field) => {
            const isWideSelect = field.type === "single_select";
            const gridColumn = isWideSelect ? { xs: "auto", md: "1 / span 2" } : "auto";

            if (field.type === "single_select") {
              return (
                <Box key={field.id} sx={{ gridColumn }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {field.label}
                  </Typography>
                  <ToggleButtonGroup
                    value={optionSelection[field.id] ?? ""}
                    exclusive
                    fullWidth
                    onChange={(_, nextValue: string | null) => {
                      if (!nextValue) return;
                      setOptionSelection((prev) => ({ ...prev, [field.id]: nextValue }));
                    }}
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        field.id === "buysUruguayMeat"
                          ? "repeat(2, minmax(0, 1fr))"
                          : { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
                      gap: 1.2,
                      "& .MuiToggleButton-root": {
                        minHeight: 64,
                        borderRadius: 3,
                        border: "1px solid rgba(229,226,225,0.18)",
                        backgroundColor: "rgba(28,27,27,0.76)",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "text.primary",
                        "&.Mui-selected": {
                          backgroundColor: "rgba(0,47,108,0.88)",
                          borderColor: "secondary.main",
                          color: "common.white",
                        },
                      },
                    }}
                  >
                    {(field.options ?? []).map((option) => (
                      <ToggleButton key={option.id} value={option.id}>
                        {option.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>
              );
            }

            return (
              <Box key={field.id}>
                <TextField fullWidth label={field.label} type={field.type} />
              </Box>
            );
          })}
        </Box>

        <Stack direction="row" justifyContent="flex-end" mt={1}>
          <Button variant="contained" onClick={submitStaticForm}>
            {t("continueLabel")}
          </Button>
        </Stack>
      </Stack>
    </ScreenCard>
  );
}
