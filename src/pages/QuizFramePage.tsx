import { keyframes } from "@emotion/react";
import { Box, Button, ButtonBase, LinearProgress, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
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

const quizFeedbackIconIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

/** Reflejo plateado muy tenue; tramo corto + larga pausa (no “loading”) */
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

export function QuizFramePage() {
  const { t } = useTranslation();
  const theme = useTheme();
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

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        width: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <KioskRightOcclusion zIndex={0} />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          px: { xs: 2, md: 4, lg: 6 },
          py: { xs: 1.5, md: 2 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 960,
            mx: "auto",
            flexShrink: 0,
            mb: { xs: 2, md: 2.5 },
          }}
        >
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: 4,
              borderRadius: 99,
              mb: 2,
              bgcolor: "rgba(229,226,225,0.12)",
              "& .MuiLinearProgress-bar": {
                background: `linear-gradient(90deg, ${BRAND_GOLD} 0%, rgba(232, 200, 130, 0.95) 100%)`,
              },
            }}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            width: "100%",
            maxWidth: 1040,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <Box sx={{ flexShrink: 0, textAlign: "center", px: { xs: 0, md: 2 } }}>
            <Typography
              component="p"
              sx={{
                mb: { xs: 1.25, md: 1.75 },
                fontSize: "0.78rem",
                letterSpacing: "0.2em",
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
                fontSize: { xs: "clamp(1.55rem, 4.4vw, 2.5rem)", md: "clamp(1.95rem, 2.9vw, 3rem)" },
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
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              py: { xs: 2, md: 2.5 },
            }}
          >
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
                display: "flex",
                flexDirection: "column",
                WebkitOverflowScrolling: "touch",
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
                    mb: 2,
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
                    mb: 2,
                    flexShrink: 0,
                    height: 3,
                    borderRadius: 99,
                    bgcolor: "rgba(255,255,255,0.08)",
                    "& .MuiLinearProgress-bar": { bgcolor: "secondary.main" },
                  }}
                />
              ) : null}
              <Box
                sx={{
                  flex: feedbackState.isVisible ? "0 0 auto" : "1 1 0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: feedbackState.isVisible ? "flex-start" : "center",
                  minHeight: feedbackState.isVisible ? "auto" : { xs: "min(52vh, 420px)", md: "min(48vh, 480px)" },
                }}
              >
                <Box
                  key={currentQuestion.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                    gap: { xs: 1.15, md: 1.5 },
                    width: "100%",
                    maxWidth: 920,
                    mx: "auto",
                    alignContent: "center",
                  }}
                >
                  {options.map((option: QuizQuestionOption, index: number) => {
                    const letter = OPTION_LETTERS[index] ?? String(index + 1);
                    const isSelected = selectedOptionId === option.id;
                    const isCorrect = option.id === currentQuestion.correctOptionId;
                    const showCorrect = feedbackState.isVisible && isCorrect;
                    const showIncorrect =
                      feedbackState.isVisible &&
                      isSelected &&
                      selectedOptionId !== currentQuestion.correctOptionId;
                    const spanFullRow = lastIndexSpansRow && index === options.length - 1;
                    const awaitingFeedback = isSelected && !feedbackState.isVisible;
                    const dimPeer =
                      feedbackState.isVisible && !showCorrect && !showIncorrect && !isSelected;
                    const staggerMs = index * (compactStagger ? 40 : 48);

                    return (
                      <ButtonBase
                        key={option.id}
                        type="button"
                        disabled={feedbackState.isVisible || isAnswerPersistencePending}
                        onClick={() => void answerWithOption(option.id)}
                        sx={{
                          position: "relative",
                          overflow: "hidden",
                          gridColumn: spanFullRow ? { xs: "auto", md: "1 / -1" } : "auto",
                          justifyContent: "flex-start",
                          alignItems: "stretch",
                          textAlign: "left",
                          borderRadius: 2.5,
                          p: { xs: 2, md: 2.5 },
                          minHeight: { xs: 112, md: 124 },
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
                          ...(showCorrect && {
                            borderColor: "rgba(124, 168, 132, 0.88)",
                            backgroundColor: "rgba(38, 78, 48, 0.35)",
                            boxShadow:
                              "inset 0 0 0 1px rgba(140, 188, 148, 0.55), 0 12px 32px rgba(0, 24, 12, 0.35)",
                          }),
                          ...(showIncorrect && {
                            borderColor: "rgba(196, 112, 112, 0.82)",
                            backgroundColor: "rgba(88, 32, 32, 0.32)",
                            boxShadow:
                              "inset 0 0 0 1px rgba(210, 130, 130, 0.5), 0 12px 28px rgba(40, 8, 8, 0.28)",
                          }),
                          ...(dimPeer && {
                            opacity: 0.42,
                            filter: "saturate(0.75)",
                            transform: "scale(0.995)",
                          }),
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
                          "&&.Mui-disabled": {
                            cursor: "not-allowed",
                            ...(dimPeer
                              ? {
                                  opacity: 0.42,
                                  filter: "saturate(0.75)",
                                  WebkitTextFillColor: "unset",
                                }
                              : {
                                  opacity: 1,
                                  filter: "none",
                                  WebkitTextFillColor: "unset",
                                }),
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
                        {(showCorrect || showIncorrect) && (
                          <Box
                            aria-hidden
                            sx={{
                              position: "absolute",
                              top: { xs: 10, md: 12 },
                              right: { xs: 10, md: 14 },
                              zIndex: 4,
                              width: { xs: 30, md: 32 },
                              height: { xs: 30, md: 32 },
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: { xs: "1rem", md: "1.05rem" },
                              fontWeight: 800,
                              lineHeight: 1,
                              color: showCorrect ? "rgba(232, 245, 234, 0.98)" : "rgba(255, 218, 218, 0.96)",
                              bgcolor: showCorrect ? "rgba(52, 96, 62, 0.62)" : "rgba(112, 44, 44, 0.58)",
                              border: "1px solid",
                              borderColor: showCorrect ? "rgba(150, 198, 160, 0.55)" : "rgba(210, 140, 140, 0.5)",
                              [mediaNoReducedMotion]: {
                                animation: `${quizFeedbackIconIn} ${motion.duration}ms ${motion.easing} both`,
                              },
                            }}
                          >
                            {showCorrect ? "✓" : "✕"}
                          </Box>
                        )}
                        <Box
                          sx={{
                            position: "relative",
                            zIndex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: 1,
                            width: "100%",
                            pr: 4,
                          }}
                        >
                          <Typography
                            className="quiz-option-letter"
                            component="span"
                            sx={{
                              fontSize: { xs: "2.1rem", md: "2.45rem" },
                              fontWeight: 800,
                              lineHeight: 1,
                              letterSpacing: "0.04em",
                              color: showCorrect
                                ? "rgba(230, 248, 232, 0.98)"
                                : showIncorrect
                                  ? "rgba(255, 200, 200, 0.95)"
                                  : "rgba(255,255,255,0.88)",
                              transition: `color ${motion.durationFast}ms ${motion.easingOut}, text-shadow ${motion.durationFast}ms ${motion.easingOut}`,
                            }}
                          >
                            {letter}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: "1.12rem", md: "1.22rem" },
                              fontWeight: 700,
                              lineHeight: 1.38,
                              color: "rgba(247,242,234,0.96)",
                              pr: 1,
                            }}
                          >
                            {option.label}
                          </Typography>
                        </Box>
                      </ButtonBase>
                    );
                  })}
                </Box>
              </Box>

              {feedbackState.isVisible ? (
                <Box
                  sx={{
                    flexShrink: 0,
                    width: "100%",
                    maxWidth: 920,
                    mx: "auto",
                    mt: { xs: 2.5, md: 3 },
                    mb: { xs: 1.5, md: 2 },
                    p: { xs: 2, md: 2.25 },
                    borderRadius: 2.5,
                    border: "1px solid",
                    borderColor: feedbackState.isCorrect ? "rgba(129,199,132,0.5)" : "rgba(239,128,128,0.5)",
                    backgroundColor: feedbackState.isCorrect ? "rgba(32, 72, 40, 0.35)" : "rgba(72, 28, 28, 0.38)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Typography sx={{ fontSize: { xs: "1.42rem", md: "1.55rem" }, fontWeight: 800, color: "text.primary" }}>
                    {feedbackState.isCorrect ? t("answerCorrectLabel") : t("answerIncorrectLabel")}
                  </Typography>
                  {feedbackState.message ? (
                    <Typography
                      sx={{
                        mt: 1.5,
                        fontSize: { xs: "1.08rem", md: "1.16rem" },
                        lineHeight: 1.5,
                        color: "rgba(247,242,234,0.92)",
                      }}
                    >
                      {feedbackState.message}
                    </Typography>
                  ) : null}
                  {canContinue ? (
                    <Button
                      variant="contained"
                      fullWidth
                      disableElevation
                      onClick={continueToNext}
                      sx={{
                        mt: 2,
                        minHeight: 52,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
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
              ) : null}
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
              pb: { xs: 0.5, md: 1 },
              opacity: feedbackState.isVisible ? 0 : 0.62,
              pointerEvents: feedbackState.isVisible ? "none" : "auto",
              transition: "opacity 200ms ease",
            }}
          >
            <Box
              aria-hidden
              sx={{
                width: 3,
                height: 32,
                borderRadius: 1,
                bgcolor: BRAND_GOLD,
                boxShadow: "0 0 16px rgba(205,153,65,0.45)",
              }}
            />
            <Typography
              sx={{
                fontSize: "0.85rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "rgba(247,242,234,0.7)",
              }}
            >
              {t("quizTapHint")}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
