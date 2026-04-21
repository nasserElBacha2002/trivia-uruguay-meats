import { Box, Button, Paper, Stack, TextField, ToggleButton, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { sectorOptionIcon } from "../components/icons/sectorOptionIcon";
import { KioskRightOcclusion } from "../components/layout/KioskRightOcclusion";
import { ROUTES } from "../config/routes";
import { getQuizContent } from "../content";
import { createLeadSchema, leadDefaultValues, type LeadSchema } from "../features/lead/leadSchema";
import {
  mapLeadFormValuesToSubmission,
  type LeadFormValues,
} from "../features/lead/leadTypes";
import { useSessionStore } from "../features/session/useSessionStore";
import { createParticipantSession } from "../services/triviaApi";
import type { QuizDataCollectionField, QuizFieldOption } from "../types/quizContent";

const compactFieldSx = {
  "& .MuiInputBase-root": {
    minHeight: 52,
    borderRadius: 2,
    fontSize: "0.95rem",
    background: "linear-gradient(140deg, rgba(0,47,108,0.5) 0%, rgba(22,22,22,0.78) 100%)",
  },
  "& .MuiOutlinedInput-input": {
    py: 1.1,
    px: 1.25,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(229,226,225,0.14)",
  },
  "& .MuiFormHelperText-root": {
    ml: 0,
    mt: 0.35,
    fontSize: "0.72rem",
    minHeight: 18,
    lineHeight: 1.2,
  },
} as const;

export function FormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state, setLeadData, setCurrentStep } = useSessionStore();
  const leadSchema = useMemo(() => createLeadSchema(t), [t]);
  const currentQuizContent = getQuizContent(state.language);
  const fields: QuizDataCollectionField[] = currentQuizContent.dataCollection.fields;

  const nameField = fields.find((f) => f.id === "name");
  const emailField = fields.find((f) => f.id === "email");
  const countryField = fields.find((f) => f.id === "country");
  const buysField = fields.find((f) => f.id === "buysUruguayMeat");
  const sectorField = fields.find((f) => f.id === "sector");

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LeadFormValues, unknown, LeadSchema>({
    resolver: zodResolver(leadSchema),
    defaultValues: leadDefaultValues,
    mode: "onChange",
  });

  const onSubmit = async (values: LeadSchema) => {
    const payload = mapLeadFormValuesToSubmission(values, state.language);
    const quizMeta = getQuizContent(state.language);

    try {
      const { participantId, sessionId } = await createParticipantSession({
        name: payload.name,
        email: payload.email,
        country: payload.country,
        sectorId: values.sectorId,
        buysUruguayMeat: payload.buysUruguayMeat,
        language: payload.language,
        quizVersion: quizMeta.slug,
      });
      setLeadData(payload, { participantId, sessionId });
      setCurrentStep("quiz");
      navigate(ROUTES.quiz);
    } catch (err) {
      console.error(err);
      setError("root", {
        type: "server",
        message: t("apiParticipantError"),
      });
    }
  };

  const renderTextBlock = (field: QuizDataCollectionField | undefined, regKey: "name" | "email" | "country") => {
    if (!field) return null;
    return (
      <Box>
        <Typography
          sx={{
            mb: 0.45,
            fontSize: "0.68rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 700,
            opacity: 0.68,
          }}
        >
          {field.label}
        </Typography>
        <TextField
          fullWidth
          placeholder={field.label}
          type={field.type}
          {...register(regKey)}
          error={Boolean(errors[regKey])}
          helperText={errors[regKey]?.message as string}
          InputLabelProps={{ shrink: false }}
          sx={compactFieldSx}
        />
      </Box>
    );
  };

  const buysToggleSx = {
    minHeight: 48,
    borderRadius: "10px",
    border: "1px solid rgba(229,226,225,0.14)",
    background: "linear-gradient(140deg, rgba(0,47,108,0.45) 0%, rgba(22,22,22,0.78) 100%)",
    textTransform: "none",
    fontWeight: 700,
    fontSize: "0.95rem",
    color: "text.primary",
    py: 0.5,
    "&.Mui-selected": {
      background: "linear-gradient(145deg, rgba(0,47,108,0.95) 0%, rgba(18,86,186,0.92) 100%)",
      borderColor: "secondary.main",
      color: "common.white",
    },
  } as const;

  const sectorToggleSx = {
    minWidth: 0,
    minHeight: 0,
    height: "100%",
    maxHeight: "100%",
    width: "100%",
    boxSizing: "border-box",
    alignSelf: "stretch",
    justifySelf: "stretch",
    borderRadius: 2,
    px: 0.4,
    py: 0.45,
    border: "1px solid rgba(229,226,225,0.12)",
    background: "linear-gradient(160deg, rgba(0,47,108,0.38) 0%, rgba(20,20,20,0.82) 100%)",
    textTransform: "none",
    flexDirection: "column",
    gap: 0.25,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    "&.Mui-selected": {
      background: "linear-gradient(145deg, rgba(0,47,108,0.96) 0%, rgba(18,86,186,0.92) 100%)",
      borderColor: "secondary.main",
      color: "common.white",
      boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
    },
  } as const;

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%", overflow: "hidden" }}>
      <KioskRightOcclusion zIndex={0} />
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
          px: { xs: 1, md: 2.5 },
          py: { xs: 0.85, md: 1 },
          display: "grid",
          gridTemplateRows: "auto minmax(0, 1fr) auto",
          rowGap: { xs: 0.65, md: 0.85 },
          alignContent: "stretch",
        }}
      >
        <Stack spacing={0.35} sx={{ minWidth: 0, maxWidth: 960, width: "100%", mx: "auto" }}>
          <Typography
            sx={{
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontSize: "0.65rem",
              opacity: 0.55,
              fontWeight: 700,
            }}
          >
            {t("formEyebrow")}
          </Typography>
          <Typography sx={{ fontSize: { xs: "1.55rem", md: "2.1rem" }, lineHeight: 1.08, fontWeight: 700 }}>
            {t("formTitle")}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "0.8rem", md: "0.88rem" },
              opacity: 0.72,
              maxWidth: 720,
              lineHeight: 1.35,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {t("formIntro")}
          </Typography>
        </Stack>

        <Box
          sx={{
            minHeight: 0,
            minWidth: 0,
            overflow: "hidden",
            width: "100%",
            maxWidth: 960,
            mx: "auto",
            display: "grid",
            gridTemplateRows: "auto auto minmax(0, 1fr)",
            alignContent: "start",
            gap: { xs: 0.75, md: 0.95 },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: { xs: 0.85, md: 1 },
              minHeight: 0,
            }}
          >
            {renderTextBlock(nameField, "name")}
            {renderTextBlock(emailField, "email")}
            {countryField ? (
              <Box sx={{ gridColumn: { xs: "auto", md: "1 / -1" } }}>{renderTextBlock(countryField, "country")}</Box>
            ) : null}
          </Box>

          {buysField ? (
            <Controller
              name="buysUruguayMeat"
              control={control}
              render={({ field: rhfField }) => (
                <Box sx={{ minHeight: 0 }}>
                  <Typography
                    sx={{
                      mb: 0.4,
                      fontSize: "0.68rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      opacity: 0.68,
                    }}
                  >
                    {buysField.label}
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 0.75,
                    }}
                  >
                    {(buysField.options ?? []).map((option: QuizFieldOption) => (
                      <ToggleButton
                        key={option.id}
                        type="button"
                        value={option.id}
                        selected={rhfField.value === option.id}
                        onClick={() => {
                          rhfField.onChange(rhfField.value === option.id ? "" : option.id);
                        }}
                        sx={buysToggleSx}
                      >
                        {option.label}
                      </ToggleButton>
                    ))}
                  </Box>
                  <Typography sx={{ mt: 0.3, color: "#ffb4ab", fontSize: "0.72rem", minHeight: 18 }}>
                    {errors.buysUruguayMeat?.message}
                  </Typography>
                </Box>
              )}
            />
          ) : null}

          {sectorField ? (
            <Controller
              name="sectorId"
              control={control}
              render={({ field: rhfField }) => (
                <Box
                  sx={{
                    minHeight: 0,
                    minWidth: 0,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    sx={{
                      mb: 0.4,
                      fontSize: "0.68rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      opacity: 0.68,
                      flexShrink: 0,
                    }}
                  >
                    {sectorField.label}
                  </Typography>
                  <Box
                    role="radiogroup"
                    aria-label={sectorField.label}
                    sx={{
                      flex: 1,
                      minHeight: 0,
                      width: "100%",
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                      gridTemplateRows: "repeat(2, minmax(0, 1fr))",
                      gap: 0.65,
                      alignContent: "stretch",
                      justifyContent: "stretch",
                    }}
                  >
                    {(sectorField.options ?? []).map((option: QuizFieldOption) => (
                      <ToggleButton
                        key={option.id}
                        type="button"
                        value={option.id}
                        selected={rhfField.value === option.id}
                        onClick={() => {
                          rhfField.onChange(rhfField.value === option.id ? "" : option.id);
                        }}
                        sx={sectorToggleSx}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.2,
                            minHeight: 0,
                            minWidth: 0,
                            width: "100%",
                            flex: 1,
                          }}
                        >
                          <Box sx={{ flexShrink: 0, lineHeight: 0, "& svg": { fontSize: "1.35rem" } }}>
                            {sectorOptionIcon(option.id)}
                          </Box>
                          <Typography
                            sx={{
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              textAlign: "center",
                              lineHeight: 1.15,
                              px: 0.15,
                              minHeight: 0,
                              minWidth: 0,
                              width: "100%",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              wordBreak: "break-word",
                            }}
                          >
                            {option.label}
                          </Typography>
                        </Box>
                      </ToggleButton>
                    ))}
                  </Box>
                  <Typography sx={{ mt: 0.3, color: "#ffb4ab", fontSize: "0.72rem", minHeight: 18, flexShrink: 0 }}>
                    {errors.sectorId?.message}
                  </Typography>
                </Box>
              )}
            />
          ) : null}
        </Box>

        {errors.root?.message ? (
          <Typography
            role="alert"
            sx={{
              color: "#ffb4ab",
              fontSize: "0.88rem",
              maxWidth: 960,
              width: "100%",
              mx: "auto",
              px: 0.5,
            }}
          >
            {errors.root.message}
          </Typography>
        ) : null}

        <Paper
          elevation={0}
          sx={{
            minWidth: 0,
            maxWidth: 960,
            width: "100%",
            mx: "auto",
            borderRadius: 2.5,
            p: { xs: 1, md: 1.15 },
            border: "1px solid rgba(229,226,225,0.12)",
            bgcolor: "rgba(0,27,68,0.5)",
          }}
        >
          <Button
            variant="contained"
            type="submit"
            disableElevation
            disabled={!isValid || isSubmitting}
            fullWidth
            sx={{
              minHeight: 52,
              fontSize: { xs: "1rem", md: "1.08rem" },
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 800,
              borderRadius: 2,
              backgroundImage: "none",
              bgcolor: "primary.main",
            }}
          >
            {t("continueLabel")}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
