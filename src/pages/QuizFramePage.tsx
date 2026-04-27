import { keyframes } from "@emotion/react";
import { Box, Button, ButtonBase, LinearProgress, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BrandLogo } from "../components/BrandLogo";
import { KioskLayout } from "../components/layout/KioskLayout";
import { KioskRightOcclusion } from "../components/layout/KioskRightOcclusion";
import { useQuizEngine } from "../features/quiz/useQuizEngine";
import { BRAND_GOLD } from "../theme/appTheme";
import { mediaNoReducedMotion, mediaReducedMotion, motion } from "../theme/motion";
import type { QuizQuestionOption } from "../types/quizContent";

const OPTION_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const quizOptionEnter = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const quizOptionSheen = keyframes`
  0%, 14% {
    opacity: 0;
    transform: skewX(-10deg) translateX(-58%);
  }
  16% {
    opacity: 0.42;
  }
  27% {
    opacity: 0.38;
    transform: skewX(-10deg) translateX(122%);
  }
  32%, 100% {
    opacity: 0;
    transform: skewX(-10deg) translateX(122%);
  }
`;

const finePointerHover = "@media (hover: hover) and (pointer: fine)";

const optionLetterSx = {
  fontSize: "clamp(2rem, min(5vw, 8dvh), 3rem)",
  fontWeight: 800,
  lineHeight: 1,
  letterSpacing: "0.04em",
} as const;

const optionLabelSx = {
  fontSize: "clamp(1rem, min(2.3vw, 3.8dvh), 1.25rem)",
  fontWeight: 700,
  lineHeight: 1.35,
  color: "rgba(247,242,234,0.96)",
  wordBreak: "break-word",
} as const;

const cardMinHeight = "clamp(92px, min(10vh, 12dvh), 130px)";

export function QuizFramePage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down("md"));
  const compactStagger = useMediaQuery(theme.breakpoints.down("md"));
  const {
    currentQuestion,
    currentQuestionIndex,
    feedbackState,
    progressValue,
    isLastQuestion,
    selectedOptionId,
    canContinue,
    answerWithOption,
    continueToNext,
    questions,
    isAnswerPersistencePending,
    answerPersistError,
    dismissAnswerPersistError,
  } = useQuizEngine();

  const options = currentQuestion.options;
  const lastIndexSpansRow = options.length === 3;
  const quizSheenEnabled = !feedbackState.isVisible && !isAnswerPersistencePending;

  const selectedOption = useMemo(
    () => options.find((o) => o.id === selectedOptionId),
    [options, selectedOptionId],
  );
  const correctOption = useMemo(
    () => options.find((o) => o.id === currentQuestion.correctOptionId),
    [options, currentQuestion.correctOptionId],
  );

  const letterForOptionId = (id: string) => {
    const idx = options.findIndex((o) => o.id === id);
    const letter = OPTION_LETTERS[idx] ?? String(idx + 1);
    return letter;
  };

  const gridTemplateColumns = isNarrow ? "1fr" : "repeat(2, minmax(0, 1fr))";

  const quizHeader = (
    <Stack alignItems="center" spacing={1} sx={{ width: "100%", maxWidth: "min(560px, 92vw)", px: 0.5 }}>
      <BrandLogo prominence="standard" />
      <LinearProgress
        variant="determinate"
        value={progressValue}
        sx={{
          width: "100%",
          height: 5,
          borderRadius: 99,
          bgcolor: "rgba(229,226,225,0.12)",
          "& .MuiLinearProgress-bar": {
            background: `linear-gradient(90deg, ${BRAND_GOLD} 0%, rgba(232, 200, 130, 0.95) 100%)`,
          },
        }}
      />
    </Stack>
  );

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%", minHeight: 0, overflow: "hidden" }}>
      <KioskRightOcclusion zIndex={0} />

      <KioskLayout
        header={quizHeader}
        rootSx={{ position: "relative", zIndex: 1, height: "100%", maxHeight: "100%" }}
        contentSx={{ justifyContent: "flex-start", py: 0.5 }}
      >
        <Box
          sx={{
            flex: "1 1 0%",
            minHeight: 0,
            width: "100%",
            maxWidth: 1040,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            overflow: "hidden",
            px: { xs: 1.25, sm: 2 },
          }}
        >
          <Box sx={{ flexShrink: 0, textAlign: "center", px: { xs: 0, sm: 1 } }}>
            <Typography
              component="p"
              sx={{
                mb: 0.75,
                fontSize: "clamp(0.65rem, min(1.8vw, 2.2dvh), 0.78rem)",
                letterSpacing: "0.16em",
                fontWeight: 700,
                textTransform: "uppercase",
                opacity: 0.62,
                color: "rgba(247,242,234,0.85)",
              }}
            >
              {t("quizEyebrow", { current: currentQuestionIndex + 1, total: questions.length })}
            </Typography>

            <Typography
              component="h1"
              sx={{
                mx: "auto",
                maxWidth: "min(920px, 100%)",
                fontSize: "clamp(1.1rem, min(3.2vw, 4.2dvh), 1.9rem)",
                lineHeight: 1.12,
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              {currentQuestion.prompt}
            </Typography>
          </Box>

          <Box
            sx={{
              flex: "1 1 0%",
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              py: { xs: 0.75, sm: 1 },
            }}
          >
            <Box
              sx={{
                flex: "1 1 0%",
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {answerPersistError ? (
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  alignItems={{ xs: "stretch", sm: "center" }}
                  sx={{
                    maxWidth: 920,
                    width: "100%",
                    mx: "auto",
                    mb: 1.5,
                    flexShrink: 0,
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid rgba(239,128,128,0.5)",
                    bgcolor: "rgba(183,28,28,0.18)",
                  }}
                >
                  <Typography sx={{ flex: 1, fontSize: "0.92rem", color: "#ffb4ab" }}>{answerPersistError}</Typography>
                  <Button type="button" variant="outlined" size="small" onClick={dismissAnswerPersistError} sx={{ flexShrink: 0 }}>
                    {t("quizApiAnswerDismiss")}
                  </Button>
                </Stack>
              ) : null}
              {isAnswerPersistencePending ? (
                <LinearProgress
                  variant="indeterminate"
                  sx={{
                    maxWidth: 920,
                    width: "100%",
                    mx: "auto",
                    mb: 1.5,
                    flexShrink: 0,
                    height: 3,
                    borderRadius: 99,
                    bgcolor: "rgba(255,255,255,0.08)",
                    "& .MuiLinearProgress-bar": { bgcolor: "secondary.main" },
                  }}
                />
              ) : null}

              {feedbackState.isVisible ? (
                <Stack spacing={1.25} sx={{ width: "100%", maxWidth: 920, mx: "auto", flex: "1 1 0%", minHeight: 0, overflow: "hidden" }}>
                  {selectedOption ? (
                    <Box
                      sx={{
                        flexShrink: 0,
                        p: 1.25,
                        borderRadius: 2,
                        border: "1px solid rgba(205,153,65,0.35)",
                        bgcolor: "rgba(255,255,255,0.05)",
                      }}
                    >
                      <Stack direction="row" spacing={1.25} alignItems="flex-start">
                        <Typography component="span" sx={{ ...optionLetterSx, color: "secondary.main", flexShrink: 0 }}>
                          {letterForOptionId(selectedOption.id)}
                        </Typography>
                        <Typography sx={{ ...optionLabelSx, pt: 0.25 }}>{selectedOption.label}</Typography>
                      </Stack>
                    </Box>
                  ) : null}
                  {!feedbackState.isCorrect && correctOption ? (
                    <Box
                      sx={{
                        flexShrink: 0,
                        p: 1.25,
                        borderRadius: 2,
                        border: "1px solid rgba(129,199,132,0.45)",
                        bgcolor: "rgba(32, 72, 40, 0.22)",
                      }}
                    >
                      <Stack direction="row" spacing={1.25} alignItems="flex-start">
                        <Typography component="span" sx={{ ...optionLetterSx, color: "rgba(200, 230, 205, 0.98)", flexShrink: 0 }}>
                          {letterForOptionId(correctOption.id)}
                        </Typography>
                        <Typography sx={{ ...optionLabelSx, color: "rgba(232, 245, 234, 0.95)", pt: 0.25 }}>{correctOption.label}</Typography>
                      </Stack>
                    </Box>
                  ) : null}

                  <Box
                    sx={{
                      flex: "1 1 0%",
                      minHeight: 0,
                      display: "flex",
                      flexDirection: "column",
                      p: { xs: 1.25, sm: 1.5 },
                      borderRadius: 2.5,
                      border: "1px solid",
                      borderColor: feedbackState.isCorrect ? "rgba(129,199,132,0.5)" : "rgba(239,128,128,0.5)",
                      backgroundColor: feedbackState.isCorrect ? "rgba(32, 72, 40, 0.35)" : "rgba(72, 28, 28, 0.38)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Typography sx={{ fontSize: "clamp(1.05rem, min(2.8vw, 3.5dvh), 1.3rem)", fontWeight: 800, color: "text.primary", flexShrink: 0 }}>
                      {feedbackState.isCorrect ? t("answerCorrectLabel") : t("answerIncorrectLabel")}
                    </Typography>
                    {feedbackState.message ? (
                      <Box
                        sx={{
                          mt: 1,
                          flex: "1 1 0%",
                          minHeight: 0,
                          maxHeight: "min(32dvh, 280px)",
                          overflowY: "auto",
                          WebkitOverflowScrolling: "touch",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "clamp(0.88rem, min(2.2vw, 3dvh), 1.05rem)",
                            lineHeight: 1.45,
                            color: "rgba(247,242,234,0.92)",
                          }}
                        >
                          {feedbackState.message}
                        </Typography>
                      </Box>
                    ) : null}
                    {canContinue ? (
                      <Button
                        variant="contained"
                        fullWidth
                        disableElevation
                        onClick={continueToNext}
                        sx={{
                          mt: 1.25,
                          flexShrink: 0,
                          minHeight: 64,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          fontWeight: 800,
                          borderRadius: 2,
                          backgroundImage: "none",
                          bgcolor: BRAND_GOLD,
                          color: "#0a0a0a",
                          "&:hover": { bgcolor: "#d4a855" },
                        }}
                      >
                        {isLastQuestion ? t("seeResultLabel") : t("continueLabel")}
                      </Button>
                    ) : null}
                  </Box>
                </Stack>
              ) : (
                <Box
                  sx={{
                    flex: "1 1 0%",
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    overflow: "visible",
                  }}
                >
                  <Box
                    key={currentQuestion.id}
                    sx={{
                      display: "grid",
                      gridTemplateColumns,
                      gap: { xs: 1, sm: 1.15 },
                      width: "100%",
                      maxWidth: 920,
                      mx: "auto",
                      alignContent: "center",
                    }}
                  >
                    {options.map((option: QuizQuestionOption, index: number) => {
                      const letter = OPTION_LETTERS[index] ?? String(index + 1);
                      const isSelected = selectedOptionId === option.id;
                      const awaitingFeedback = isSelected && !feedbackState.isVisible;
                      const spanFullRow = lastIndexSpansRow && index === options.length - 1 && !isNarrow;
                      const staggerMs = index * (compactStagger ? 40 : 48);

                      return (
                        <ButtonBase
                          key={option.id}
                          type="button"
                          disabled={isAnswerPersistencePending}
                          onClick={() => void answerWithOption(option.id)}
                          sx={{
                            position: "relative",
                            overflow: "hidden",
                            gridColumn: spanFullRow ? "1 / -1" : "auto",
                            justifyContent: "flex-start",
                            alignItems: "stretch",
                            textAlign: "left",
                            borderRadius: 2.5,
                            p: { xs: 1.35, sm: 1.5 },
                            minHeight: cardMinHeight,
                            alignSelf: "stretch",
                            border: "1px solid rgba(205,153,65,0.28)",
                            backgroundColor: "rgba(255,255,255,0.06)",
                            backdropFilter: "blur(14px)",
                            WebkitBackdropFilter: "blur(14px)",
                            color: "text.primary",
                            outline: "none",
                            willChange: "transform, opacity",
                            transitionProperty: "background-color, border-color, box-shadow, transform, opacity, filter",
                            transitionDuration: `${motion.duration}ms`,
                            transitionTimingFunction: motion.easingOut,
                            [mediaReducedMotion]: {
                              transitionDuration: "0.01ms",
                              willChange: "auto",
                            },
                            [mediaNoReducedMotion]: {
                              animation: `${quizOptionEnter} ${motion.durationSlow}ms ${motion.easing} both`,
                              animationDelay: `${staggerMs}ms`,
                            },
                            boxShadow:
                              awaitingFeedback || (isSelected && isAnswerPersistencePending)
                                ? `0 0 0 2px rgba(205,153,65,0.55), inset 0 0 0 1px rgba(205,153,65,0.22), 0 10px 28px rgba(0,0,0,0.35)`
                                : "0 1px 0 rgba(255,255,255,0.05) inset",
                            ...(awaitingFeedback || (isSelected && isAnswerPersistencePending)
                              ? {
                                  borderColor: "rgba(205,153,65,0.65)",
                                  backgroundColor: "rgba(205,153,65,0.12)",
                                }
                              : {}),
                            [finePointerHover]: {
                              "&:hover:not(.Mui-disabled)": {
                                backgroundColor: "rgba(205,153,65,0.14)",
                                borderColor: "rgba(205,153,65,0.55)",
                                boxShadow: `0 0 0 1px rgba(205,153,65,0.35), 0 14px 36px rgba(0,0,0,0.38)`,
                                transform: { xs: "translateY(-1px)", md: "translateY(-2px)" },
                                "& .quiz-option-letter": {
                                  color: BRAND_GOLD,
                                  textShadow: "0 0 18px rgba(205,153,65,0.35)",
                                },
                              },
                            },
                            "&:active:not(.Mui-disabled)": {
                              transform: "scale(0.985) translateY(0)",
                              transitionDuration: `${motion.durationFast}ms`,
                            },
                            "&.Mui-focusVisible": {
                              zIndex: 2,
                              boxShadow: `0 0 0 2px rgba(205,153,65,0.9), 0 0 0 5px rgba(0, 0, 0, 0.85), 0 12px 32px rgba(0,0,0,0.35)`,
                            },
                            ...(quizSheenEnabled
                              ? {
                                  "&::after": {
                                    content: '""',
                                    position: "absolute",
                                    inset: 0,
                                    top: "-2px",
                                    bottom: "-2px",
                                    left: "-35%",
                                    width: "42%",
                                    zIndex: 0,
                                    pointerEvents: "none",
                                    background:
                                      "linear-gradient(102deg, transparent 0%, rgba(230, 234, 238, 0.035) 38%, rgba(255, 255, 255, 0.075) 50%, rgba(218, 224, 230, 0.04) 62%, transparent 100%)",
                                    [mediaNoReducedMotion]: {
                                      animation: `${quizOptionSheen} 12s cubic-bezier(0.45, 0, 0.25, 1) infinite`,
                                      animationDelay: `${0.45 + index * 1.35}s`,
                                    },
                                    [mediaReducedMotion]: {
                                      display: "none",
                                    },
                                  },
                                }
                              : {}),
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              zIndex: 1,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              gap: 0.75,
                              width: "100%",
                              pr: 1,
                            }}
                          >
                            <Typography className="quiz-option-letter" component="span" sx={{ ...optionLetterSx, color: "rgba(255,255,255,0.88)" }}>
                              {letter}
                            </Typography>
                            <Typography sx={optionLabelSx}>{option.label}</Typography>
                          </Box>
                        </ButtonBase>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              flexShrink: 0,
              width: "100%",
              maxWidth: 920,
              mx: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.75,
              pt: 0.25,
              pb: { xs: 0.35, sm: 0.5 },
              opacity: feedbackState.isVisible ? 0 : 0.62,
              pointerEvents: feedbackState.isVisible ? "none" : "auto",
              transition: "opacity 200ms ease",
            }}
          >
            <Box
              aria-hidden
              sx={{
                width: 3,
                height: 28,
                borderRadius: 1,
                bgcolor: BRAND_GOLD,
                boxShadow: "0 0 16px rgba(205,153,65,0.45)",
              }}
            />
            <Typography
              sx={{
                fontSize: "clamp(0.75rem, min(2vw, 2.5dvh), 0.88rem)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "rgba(247,242,234,0.7)",
              }}
            >
              {t("quizTapHint")}
            </Typography>
          </Box>
        </Box>
      </KioskLayout>
    </Box>
  );
}
