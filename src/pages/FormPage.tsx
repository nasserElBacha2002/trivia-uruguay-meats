import { Box, Button, Paper, Stack, TextField, ToggleButton, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { kioskSelectSnap } from "../animations/kioskKeyframes";
import { sectorOptionIcon } from "../components/icons/sectorOptionIcon";
import { KioskHeader } from "../components/kiosk/KioskHeader";
import { KioskScreen } from "../components/kiosk/KioskScreen";
import { SectorIconIdle } from "../components/motion/SectorIconIdle";
import { ShimmerOverlay } from "../components/motion/ShimmerOverlay";
import { ROUTES } from "../config/routes";
import { getQuizContent } from "../content";
import { createLeadSchema, leadDefaultValues, type LeadSchema } from "../features/lead/leadSchema";
import {
  mapLeadFormValuesToSubmission,
  type LeadFormValues,
} from "../features/lead/leadTypes";
import { useSessionStore } from "../features/session/useSessionStore";
import { createParticipantSession } from "../services/triviaApi";
import { mediaNoReducedMotion, mediaReducedMotion, motion } from "../theme/motion";
import type { QuizDataCollectionField, QuizFieldOption } from "../types/quizContent";

const fieldRootSx = {
  "& .MuiInputBase-root": {
    minHeight: "clamp(64px, 6dvh, 88px)",
    borderRadius: 2,
    fontSize: "clamp(1.05rem, 2dvh, 1.2rem)",
    background: "linear-gradient(140deg, rgba(205,153,65,0.12) 0%, rgba(22,22,22,0.78) 100%)",
    transition: `box-shadow ${motion.duration}ms ease, border-color ${motion.duration}ms ease`,
  },
  "& .MuiOutlinedInput-input": {
    py: 1.5,
    px: 1.5,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(229,226,225,0.16)",
    transition: `border-color ${motion.duration}ms ease, box-shadow ${motion.duration}ms ease`,
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(205,153,65,0.78)",
    boxShadow: "0 0 0 1px rgba(205,153,65,0.35), 0 0 20px rgba(205,153,65,0.18)",
  },
  "& .MuiFormHelperText-root": {
    ml: 0,
    mt: 0.5,
    fontSize: "0.85rem",
    lineHeight: 1.25,
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

  const labelSx = {
    mb: 0.6,
    fontSize: "clamp(0.8rem, 1.5dvh, 0.95rem)",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    fontWeight: 700,
    opacity: 0.72,
  };

  const renderTextBlock = (field: QuizDataCollectionField | undefined, regKey: "name" | "email" | "country") => {
    if (!field) return null;
    return (
      <Box>
        <Typography sx={labelSx}>{field.label}</Typography>
        <TextField
          fullWidth
          placeholder={field.label}
          type={field.type}
          {...register(regKey)}
          error={Boolean(errors[regKey])}
          helperText={errors[regKey]?.message as string}
          InputLabelProps={{ shrink: false }}
          sx={fieldRootSx}
        />
      </Box>
    );
  };

  const buysToggleSx = {
    minHeight: "clamp(64px, 6dvh, 88px)",
    borderRadius: "12px",
    border: "1px solid rgba(229,226,225,0.14)",
    background: "linear-gradient(140deg, rgba(205,153,65,0.1) 0%, rgba(22,22,22,0.78) 100%)",
    textTransform: "none" as const,
    fontWeight: 700,
    fontSize: "clamp(1.05rem, 2dvh, 1.25rem)",
    color: "text.primary",
    py: 1,
    "&.Mui-selected": {
      background: "linear-gradient(145deg, rgba(205,153,65,0.24) 0%, rgba(12,12,12,0.94) 100%)",
      borderColor: "secondary.main",
      color: "common.white",
    },
  };

  const sectorToggleSx = {
    position: "relative" as const,
    overflow: "hidden" as const,
    minWidth: 0,
    width: "100%",
    minHeight: "clamp(88px, 9dvh, 120px)",
    borderRadius: 2,
    px: 1,
    py: 1,
    border: "1px solid rgba(229,226,225,0.12)",
    background: "linear-gradient(160deg, rgba(205,153,65,0.1) 0%, rgba(20,20,20,0.82) 100%)",
    textTransform: "none" as const,
    flexDirection: "column" as const,
    gap: 0.5,
    justifyContent: "center",
    alignItems: "center",
    transition: `transform ${motion.durationFast}ms ${motion.easingOut}, border-color ${motion.duration}ms ease`,
    "&:active": { transform: "scale(0.98)" },
    "&.Mui-selected": {
      background: "linear-gradient(145deg, rgba(205,153,65,0.22) 0%, rgba(10,10,10,0.94) 100%)",
      borderColor: "secondary.main",
      color: "common.white",
      boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
      [mediaNoReducedMotion]: {
        animation: `${kioskSelectSnap} 340ms cubic-bezier(0.16, 1, 0.3, 1)`,
      },
      [mediaReducedMotion]: { animation: "none" },
    },
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ height: "100%", minHeight: 0 }}>
      <KioskScreen header={<KioskHeader logoSize="standard" />}>
        <Stack
          spacing={1.25}
          sx={{
            flex: 1,
            minHeight: 0,
            width: "100%",
            maxWidth: "min(900px, 88vw)",
            mx: "auto",
            px: 2,
            py: 1,
            overflow: "auto",
          }}
        >
          <Stack spacing={0.75} sx={{ flexShrink: 0 }}>
            <Typography sx={{ ...labelSx, mb: 0 }}>{t("formEyebrow")}</Typography>
            <Typography sx={{ fontSize: "clamp(1.5rem, 3dvh, 2.1rem)", lineHeight: 1.1, fontWeight: 800 }}>
              {t("formTitle")}
            </Typography>
            <Typography sx={{ fontSize: "clamp(1rem, 1.8dvh, 1.2rem)", opacity: 0.78, lineHeight: 1.4, maxWidth: 820 }}>
              {t("formIntro")}
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 1.25,
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
                <Box>
                  <Typography sx={labelSx}>{buysField.label}</Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1 }}>
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
                  <Typography sx={{ mt: 0.5, color: "#ffb4ab", fontSize: "0.9rem" }}>{errors.buysUruguayMeat?.message}</Typography>
                </Box>
              )}
            />
          ) : null}

          {sectorField ? (
            <Controller
              name="sectorId"
              control={control}
              render={({ field: rhfField }) => (
                <Box>
                  <Typography sx={labelSx}>{sectorField.label}</Typography>
                  <Box
                    role="radiogroup"
                    aria-label={sectorField.label}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 1,
                    }}
                  >
                    {(sectorField.options ?? []).map((option: QuizFieldOption, sectorIdx: number) => (
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
                        <ShimmerOverlay cycleSec={9.2} delaySec={0.5 + sectorIdx * 0.55} />
                        <Box
                          sx={{
                            position: "relative",
                            zIndex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 0.5,
                            textAlign: "center",
                          }}
                        >
                          <SectorIconIdle optionId={option.id}>
                            <Box sx={{ lineHeight: 0, "& svg": { fontSize: "clamp(1.75rem, 3dvh, 2.25rem)" } }}>
                              {sectorOptionIcon(option.id)}
                            </Box>
                          </SectorIconIdle>
                          <Typography sx={{ fontSize: "clamp(0.95rem, 1.8dvh, 1.15rem)", fontWeight: 700, lineHeight: 1.25 }}>
                            {option.label}
                          </Typography>
                        </Box>
                      </ToggleButton>
                    ))}
                  </Box>
                  <Typography sx={{ mt: 0.5, color: "#ffb4ab", fontSize: "0.9rem" }}>{errors.sectorId?.message}</Typography>
                </Box>
              )}
            />
          ) : null}

          {errors.root?.message ? (
            <Typography role="alert" sx={{ color: "#ffb4ab", fontSize: "1rem" }}>
              {errors.root.message}
            </Typography>
          ) : null}

          <Paper
            elevation={0}
            sx={{
              flexShrink: 0,
              borderRadius: 2.5,
              p: 1.25,
              border: "1px solid rgba(229,226,225,0.12)",
              bgcolor: "rgba(12,12,12,0.75)",
            }}
          >
            <Button
              variant="contained"
              type="submit"
              disableElevation
              disabled={!isValid || isSubmitting}
              fullWidth
              sx={{
                minHeight: "clamp(72px, 6.5dvh, 96px)",
                fontSize: "clamp(1.1rem, 2dvh, 1.35rem)",
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
        </Stack>
      </KioskScreen>
    </Box>
  );
}
