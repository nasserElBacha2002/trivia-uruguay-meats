import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { KioskRightOcclusion } from "../components/layout/KioskRightOcclusion";
import { ROUTES } from "../config/routes";
import { getQuizContent } from "../content";
import { createLeadSchema, leadDefaultValues, type LeadSchema } from "../features/lead/leadSchema";
import {
  mapLeadFormValuesToSubmission,
  type LeadFormValues,
} from "../features/lead/leadTypes";
import { useSessionStore } from "../features/session/useSessionStore";
import type { QuizDataCollectionField, QuizFieldOption } from "../types/quizContent";

export function FormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, setLeadData, setCurrentStep } = useSessionStore();
  const leadSchema = useMemo(() => createLeadSchema(t), [t]);
  const currentQuizContent = getQuizContent(state.language);
  const fields: QuizDataCollectionField[] = currentQuizContent.dataCollection.fields;

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
    <Box sx={{ position: "relative", height: "100%", width: "100%", overflow: "hidden" }}>
      <KioskRightOcclusion zIndex={0} />
      <Stack
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        gap={2.8}
        height="100%"
        sx={{
          position: "relative",
          zIndex: 1,
          px: { xs: 0.5, md: 2 },
          py: { xs: 1.5, md: 2.5 },
        }}
      >
      <Stack spacing={1.5} sx={{ maxWidth: 920, mt: { xs: 1.5, md: 3.5 }, px: { xs: 1, md: 2 } }}>
        <Typography
          sx={{
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontSize: { xs: "0.68rem", md: "0.78rem" },
            opacity: 0.58,
            fontWeight: 700,
          }}
        >
          Guest Profile
        </Typography>
        <Typography sx={{ fontSize: { xs: "2rem", md: "3.4rem" }, lineHeight: 1.06, fontWeight: 700 }}>
          {t("formTitle")}
        </Typography>
        <Typography sx={{ fontSize: { xs: "1rem", md: "1.22rem" }, opacity: 0.74, maxWidth: 780 }}>
          {t("formIntro")}
        </Typography>
      </Stack>

      <Stack sx={{ flex: 1, minHeight: 0, overflow: "auto", px: { xs: 1, md: 2.2 }, pb: 1.5 }} spacing={3}>
        <Box
          sx={{
            display: "grid",
            gap: 2.5,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          {fields
            .filter((field: QuizDataCollectionField) => field.type !== "single_select")
            .map((field: QuizDataCollectionField) => (
              <Box key={field.id}>
                <Typography
                  sx={{
                    mb: 0.95,
                    fontSize: "0.74rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    opacity: 0.72,
                  }}
                >
                  {field.label}
                </Typography>
                <TextField
                  fullWidth
                  placeholder={field.label}
                  type={field.type}
                  {...register(field.id as "name" | "email" | "country")}
                  error={Boolean(errors[field.id as keyof LeadFormValues])}
                  helperText={errors[field.id as keyof LeadFormValues]?.message as string}
                  InputLabelProps={{ shrink: false }}
                  sx={{
                    "& .MuiInputBase-root": {
                      background: "linear-gradient(140deg, rgba(0,47,108,0.56) 0%, rgba(22,22,22,0.8) 100%)",
                      borderRadius: 2.5,
                      minHeight: 70,
                      fontSize: "1.07rem",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(229,226,225,0.16)",
                    },
                    "& .MuiFormHelperText-root": {
                      ml: 0,
                      mt: 0.7,
                    },
                  }}
                />
              </Box>
            ))}

          {fields
            .filter((field: QuizDataCollectionField) => field.type === "single_select")
            .map((field: QuizDataCollectionField) => (
              <Controller
                key={field.id}
                name={field.id === "sector" ? "sectorId" : "buysUruguayMeat"}
                control={control}
                render={({ field: rhfField }) => (
                  <Box sx={{ gridColumn: { xs: "auto", md: "1 / span 2" } }}>
                    <Typography
                      sx={{
                        mb: 1.1,
                        fontSize: "0.74rem",
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        opacity: 0.72,
                      }}
                    >
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
                        gap: 1.3,
                        "& .MuiToggleButton-root": {
                          minHeight: field.id === "buysUruguayMeat" ? 78 : 92,
                          borderRadius: field.id === "buysUruguayMeat" ? 2.3 : 2.8,
                          border: "1px solid rgba(229,226,225,0.16)",
                          background:
                            field.id === "buysUruguayMeat"
                              ? "linear-gradient(140deg, rgba(0,47,108,0.52) 0%, rgba(22,22,22,0.8) 100%)"
                              : "linear-gradient(140deg, rgba(0,47,108,0.4) 0%, rgba(24,24,24,0.8) 100%)",
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: field.id === "buysUruguayMeat" ? "1.25rem" : "1rem",
                          color: "text.primary",
                          px: 1.6,
                          "&.Mui-selected": {
                            background: "linear-gradient(145deg, rgba(0,47,108,0.96) 0%, rgba(18,86,186,0.94) 100%)",
                            borderColor: "secondary.main",
                            color: "common.white",
                            boxShadow: "0 14px 34px rgba(0,0,0,0.35)",
                          },
                        },
                      }}
                    >
                      {(field.options ?? []).map((option: QuizFieldOption) => (
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

        <Paper
          elevation={0}
          sx={{
            mt: "auto",
            borderRadius: 3,
            p: { xs: 2, md: 2.6 },
            border: "1px solid rgba(229,226,225,0.14)",
            bgcolor: "rgba(0,27,68,0.56)",
          }}
        >
          <Button
            variant="contained"
            type="submit"
            disabled={!isValid || isSubmitting}
            fullWidth
            sx={{
              minHeight: { xs: 78, md: 92 },
              fontSize: { xs: "1.35rem", md: "1.7rem" },
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontWeight: 700,
              borderRadius: 2.4,
            }}
          >
            {t("continueLabel")}
          </Button>
        </Paper>
      </Stack>
      </Stack>
    </Box>
  );
}
