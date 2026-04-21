import {
  Box,
  Button,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ScreenCard } from "../components/ScreenCard";
import { ROUTES } from "../config/routes";
import { quizContent } from "../content/quizContent";
import { leadDefaultValues, leadSchema, type LeadSchema } from "../features/lead/leadSchema";
import {
  mapLeadFormValuesToSubmission,
  type LeadFormValues,
} from "../features/lead/leadTypes";
import { useSessionStore } from "../features/session/useSessionStore";

export function FormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, setLeadData, setCurrentStep } = useSessionStore();
  const fields = quizContent.dataCollection.fields;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LeadFormValues, unknown, LeadSchema>({
    resolver: zodResolver(leadSchema),
    defaultValues: leadDefaultValues,
    mode: "onChange",
  });

  const onSubmit = (values: LeadSchema) => {
    const payload = mapLeadFormValuesToSubmission(values, state.language);

    setLeadData(payload);
    setCurrentStep("quiz");
    navigate(ROUTES.quiz);
  };

  return (
    <ScreenCard title={t("formTitle")}>
      <Stack
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        gap={3}
        height="100%"
        justifyContent="space-between"
      >
        <Box
          sx={{
            display: "grid",
            gap: 2.5,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          {fields
            .filter((field) => field.type !== "single_select")
            .map((field) => (
              <Box key={field.id}>
                <TextField
                  fullWidth
                  label={field.label}
                  type={field.type}
                  {...register(field.id as "name" | "email" | "country")}
                  error={Boolean(errors[field.id as keyof LeadFormValues])}
                  helperText={errors[field.id as keyof LeadFormValues]?.message as string}
                />
              </Box>
            ))}
          {fields
            .filter((field) => field.type === "single_select")
            .map((field) => (
              <Controller
                key={field.id}
                name={field.id === "sector" ? "sectorId" : "buysUruguayMeat"}
                control={control}
                render={({ field: rhfField }) => (
                  <Box sx={{ gridColumn: { xs: "auto", md: "1 / span 2" } }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {field.label}
                    </Typography>
                    <ToggleButtonGroup
                      value={rhfField.value}
                      exclusive
                      fullWidth
                      onChange={(_, nextValue: string | null) => {
                        rhfField.onChange(nextValue ?? "");
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
                    <Typography variant="body2" sx={{ mt: 0.75, color: "#ffb4ab", minHeight: 22 }}>
                      {field.id === "sector"
                        ? errors.sectorId?.message
                        : errors.buysUruguayMeat?.message}
                    </Typography>
                  </Box>
                )}
              />
            ))}
        </Box>

        <Stack direction="row" justifyContent="flex-end" mt={1}>
          <Button variant="contained" type="submit" disabled={!isValid || isSubmitting}>
            {t("continueLabel")}
          </Button>
        </Stack>
      </Stack>
    </ScreenCard>
  );
}
