import { keyframes } from "@emotion/react";
import { Box, Button, ButtonBase, LinearProgress, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  kioskCheckPop,
  kioskCorrectGlowPulse,
  kioskQuestionEnter,
  kioskShakeSubtle,
  quizOptionCardFloat,
  quizOptionCardFloatReverse,
} from "../animations/kioskKeyframes";
import { KioskHeader } from "../components/kiosk/KioskHeader";
import { KioskScreen } from "../components/kiosk/KioskScreen";
import { getQuizStagePhoto } from "../config/mediaAssets";
import { useQuizEngine } from "../features/quiz/useQuizEngine";
import { BRAND_GOLD, FONT_DIDOT } from "../theme/appTheme";
import { mediaNoReducedMotion, mediaReducedMotion, motion } from "../theme/motion";
import type { QuizQuestion, QuizQuestionOption } from "../types/quizContent";

/** Card mount: opacity only so inner shell can run transform idle without fighting this animation. */
const quizOptionEnter = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const quizOptionSheen = keyframes`
  0%, 14% { opacity: 0; transform: skewX(-10deg) translateX(-58%); }
  16% { opacity: 0.42; }
  27% { opacity: 0.38; transform: skewX(-10deg) translateX(122%); }
  32%, 100% { opacity: 0; transform: skewX(-10deg) translateX(122%); }
`;

const finePointerHover = "@media (hover: hover) and (pointer: fine)";

const optLetter = {
  fontSize: "clamp(2.4rem, 5dvh, 4rem)",
  fontWeight: 800,
  lineHeight: 1,
  letterSpacing: "0.04em",
} as const;

const optText = {
  fontSize: "clamp(1.25rem, 2.4dvh, 1.8rem)",
  fontWeight: 700,
  lineHeight: 1.35,
  color: "rgba(247,242,234,0.96)",
  wordBreak: "break-word" as const,
};

/** Larger option copy while feedback is visible (after answering). */
const optTextAfterAnswer = {
  ...optText,
  fontSize: "clamp(1.42rem, 2.75dvh, 2.05rem)",
  lineHeight: 1.38,
} as const;

const optBadgeAfterAnswer = {
  ...optLetter,
  fontSize: "clamp(2.35rem, 4.6dvh, 3.35rem)",
} as const;

const cardMinH = "clamp(120px, 10dvh, 180px)";

export function QuizFramePage() {
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
  const quizSheenEnabled = !feedbackState.isVisible && !isAnswerPersistencePending;

  const selectedOption = useMemo(
    () => options.find((o) => o.id === selectedOptionId),
    [options, selectedOptionId],
  );
  const correctOption = useMemo(
    () => options.find((o) => o.id === currentQuestion.correctOptionId),
    [options, currentQuestion.correctOptionId],
  );

  const numberForOptionId = (id: string) => {
    const idx = options.findIndex((o) => o.id === id);
    return idx >= 0 ? String(idx + 1) : "?";
  };

  return (
    <KioskScreen header={<KioskHeader logoSize="standard" progress={progressValue} />} backdropSrc={getQuizStagePhoto(currentQuestionIndex)}>
      {feedbackState.isVisible ? (
        <QuizFeedbackLayout
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          questionsLength={questions.length}
          feedbackState={feedbackState}
          selectedOption={selectedOption}
          correctOption={correctOption}
          numberForOptionId={numberForOptionId}
          canContinue={canContinue}
          isLastQuestion={isLastQuestion}
          continueToNext={continueToNext}
        />
      ) : (
        <QuizQuestionLayout
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          questionsLength={questions.length}
          options={options}
          quizSheenEnabled={quizSheenEnabled}
          isAnswerPersistencePending={isAnswerPersistencePending}
          answerPersistError={answerPersistError}
          dismissAnswerPersistError={dismissAnswerPersistError}
          answerWithOption={answerWithOption}
          selectedOptionId={selectedOptionId}
        />
      )}
    </KioskScreen>
  );
}

function QuizQuestionLayout({
  currentQuestion,
  currentQuestionIndex,
  questionsLength,
  options,
  quizSheenEnabled,
  isAnswerPersistencePending,
  answerPersistError,
  dismissAnswerPersistError,
  answerWithOption,
  selectedOptionId,
}: {
  currentQuestion: QuizQuestion;
  currentQuestionIndex: number;
  questionsLength: number;
  options: QuizQuestionOption[];
  quizSheenEnabled: boolean;
  isAnswerPersistencePending: boolean;
  answerPersistError: string | null;
  dismissAnswerPersistError: () => void;
  answerWithOption: (id: string) => Promise<void>;
  selectedOptionId: string | null;
}) {
  const { t } = useTranslation();

  /** Idle float only while reading — stops on tap or while answer persists; feedback view handles motion. */
  const optionFloatIdle = selectedOptionId == null && !isAnswerPersistencePending;

  return (
    <Stack
      spacing={1.5}
      sx={{
        flex: 1,
        minHeight: 0,
        width: "100%",
        maxWidth: "min(900px, 88vw)",
        mx: "auto",
        px: 2,
        py: 1,
      }}
    >
      {answerPersistError ? (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center" sx={{ p: 1.5, borderRadius: 2, border: "1px solid rgba(239,128,128,0.5)", bgcolor: "rgba(183,28,28,0.18)" }}>
          <Typography sx={{ flex: 1, fontSize: "1rem", color: "#ffb4ab" }}>{answerPersistError}</Typography>
          <Button type="button" variant="outlined" size="small" onClick={dismissAnswerPersistError}>
            {t("quizApiAnswerDismiss")}
          </Button>
        </Stack>
      ) : null}
      {isAnswerPersistencePending ? (
        <LinearProgress variant="indeterminate" sx={{ height: 4, borderRadius: 99, bgcolor: "rgba(255,255,255,0.08)", "& .MuiLinearProgress-bar": { bgcolor: "secondary.main" } }} />
      ) : null}

      <Box
        key={currentQuestion.id}
        sx={{
          textAlign: "center",
          flexShrink: 0,
          [mediaNoReducedMotion]: {
            animation: `${kioskQuestionEnter} 0.48s cubic-bezier(0.22, 1, 0.36, 1) both`,
          },
          [mediaReducedMotion]: { animation: "none" },
        }}
      >
        <Typography
          sx={{
            mb: 1,
            fontSize: "clamp(0.85rem, 1.6dvh, 1rem)",
            letterSpacing: "0.18em",
            fontWeight: 700,
            textTransform: "uppercase",
            opacity: 0.65,
          }}
        >
          {t("quizEyebrow", { current: currentQuestionIndex + 1, total: questionsLength })}
        </Typography>
        <Typography
          component="h1"
          sx={{
            fontFamily: FONT_DIDOT,
            fontSize: "clamp(1.5rem, 3.2dvh, 2.35rem)",
            lineHeight: 1.18,
            fontWeight: 400,
            letterSpacing: "0.01em",
            color: "#F7F2EA",
            textShadow: "0 2px 16px rgba(0,0,0,0.9)",
          }}
        >
          {currentQuestion.prompt}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Stack spacing={1.25} sx={{ width: "100%" }}>
          {options.map((option, index) => {
            const optionNumber = String(index + 1);
            const isSelected = selectedOptionId === option.id;
            const awaiting = isSelected && !isAnswerPersistencePending;
            const staggerMs = index * 45;
            const floatDurationSec = 4.05 + (index % 4) * 0.28;
            const floatDelaySec = 0.42 + index * 0.58;
            const floatKeyframes = index % 2 === 0 ? quizOptionCardFloat : quizOptionCardFloatReverse;
            return (
              <ButtonBase
                key={option.id}
                type="button"
                disabled={isAnswerPersistencePending}
                onClick={() => void answerWithOption(option.id)}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  width: "100%",
                  justifyContent: "flex-start",
                  alignItems: "stretch",
                  textAlign: "left",
                  borderRadius: 2.5,
                  p: 2,
                  minHeight: cardMinH,
                  border: "1px solid rgba(205,153,65,0.3)",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  color: "text.primary",
                  transition: `background-color ${motion.duration}ms ${motion.easingOut}, border-color ${motion.duration}ms`,
                  "&:active:not(.Mui-disabled) .quiz-option-inner": {
                    transform: "scale(0.985)",
                  },
                  [mediaNoReducedMotion]: {
                    animation: `${quizOptionEnter} ${motion.durationSlow}ms ${motion.easing} both`,
                    animationDelay: `${staggerMs}ms`,
                  },
                  ...(awaiting || (isSelected && isAnswerPersistencePending)
                    ? {
                        borderColor: "rgba(205,153,65,0.65)",
                        backgroundColor: "rgba(205,153,65,0.14)",
                        boxShadow: `0 0 0 2px rgba(205,153,65,0.45), 0 12px 28px rgba(0,0,0,0.35)`,
                      }
                    : {}),
                  [finePointerHover]: {
                    "&:hover:not(.Mui-disabled)": {
                      backgroundColor: "rgba(205,153,65,0.12)",
                      borderColor: "rgba(205,153,65,0.5)",
                    },
                  },
                  ...(quizSheenEnabled
                    ? {
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          inset: 0,
                          left: "-35%",
                          width: "42%",
                          zIndex: 0,
                          pointerEvents: "none",
                          background:
                            "linear-gradient(102deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
                          [mediaNoReducedMotion]: {
                            animation: `${quizOptionSheen} 12s cubic-bezier(0.45, 0, 0.25, 1) infinite`,
                            animationDelay: `${0.45 + index * 1.35}s`,
                          },
                          [mediaReducedMotion]: { display: "none" },
                        },
                      }
                    : {}),
                }}
              >
                <Box
                  className="quiz-option-float-shell"
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    width: "100%",
                    display: "flex",
                    alignItems: "stretch",
                    flex: 1,
                    minWidth: 0,
                    ...(optionFloatIdle
                      ? {
                          [mediaNoReducedMotion]: {
                            animation: `${floatKeyframes} ${floatDurationSec}s ease-in-out infinite`,
                            animationDelay: `${floatDelaySec}s`,
                            willChange: "transform",
                          },
                          [mediaReducedMotion]: { animation: "none", transform: "none" },
                        }
                      : {
                          [mediaNoReducedMotion]: { animation: "none", transform: "none", willChange: "auto" },
                          [mediaReducedMotion]: { animation: "none", transform: "none" },
                        }),
                  }}
                >
                  <Stack
                    className="quiz-option-inner"
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{
                      position: "relative",
                      zIndex: 2,
                      width: "100%",
                      pr: 1,
                      transition: `transform ${motion.durationFast}ms ${motion.easingOut}`,
                    }}
                  >
                    <Typography className="quiz-option-letter" component="span" sx={{ ...optLetter, color: "rgba(255,255,255,0.9)", flexShrink: 0 }}>
                      {optionNumber}
                    </Typography>
                    <Typography sx={optText}>{option.label}</Typography>
                  </Stack>
                </Box>
              </ButtonBase>
            );
          })}
        </Stack>
      </Box>

      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} sx={{ flexShrink: 0, py: 0.5, opacity: 0.65 }}>
        <Box sx={{ width: 4, height: 28, borderRadius: 1, bgcolor: BRAND_GOLD }} />
        <Typography sx={{ fontSize: "clamp(0.95rem, 1.7dvh, 1.15rem)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
          {t("quizTapHint")}
        </Typography>
      </Stack>
    </Stack>
  );
}

function QuizFeedbackLayout({
  currentQuestion,
  currentQuestionIndex,
  questionsLength,
  feedbackState,
  selectedOption,
  correctOption,
  numberForOptionId,
  canContinue,
  isLastQuestion,
  continueToNext,
}: {
  currentQuestion: QuizQuestion;
  currentQuestionIndex: number;
  questionsLength: number;
  feedbackState: { isCorrect: boolean; message: string | null };
  selectedOption?: QuizQuestionOption;
  correctOption?: QuizQuestionOption;
  numberForOptionId: (id: string) => string;
  canContinue: boolean;
  isLastQuestion: boolean;
  continueToNext: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Stack
      spacing={1.5}
      sx={{
        flex: 1,
        minHeight: 0,
        width: "100%",
        maxWidth: "min(900px, 88vw)",
        mx: "auto",
        px: 2,
        py: 1,
        justifyContent: "center",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography sx={{ fontSize: "clamp(0.8rem, 1.5dvh, 0.95rem)", letterSpacing: "0.16em", fontWeight: 700, textTransform: "uppercase", opacity: 0.6, mb: 0.5 }}>
          {t("quizEyebrow", { current: currentQuestionIndex + 1, total: questionsLength })}
        </Typography>
        <Typography sx={{ fontFamily: FONT_DIDOT, fontSize: "clamp(1.2rem, 2.5dvh, 1.75rem)", fontWeight: 400, lineHeight: 1.2, color: "#F7F2EA", textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}>{currentQuestion.prompt}</Typography>
      </Box>

      {selectedOption ? (
        <Box sx={{ p: 1.5, borderRadius: 2, border: "1px solid rgba(205,153,65,0.35)", bgcolor: "rgba(255,255,255,0.06)" }}>
          <Stack direction="row" spacing={1.25} alignItems="flex-start">
            <Typography sx={{ ...optBadgeAfterAnswer, color: "secondary.main", flexShrink: 0 }}>
              {numberForOptionId(selectedOption.id)}
            </Typography>
            <Typography sx={optTextAfterAnswer}>{selectedOption.label}</Typography>
          </Stack>
        </Box>
      ) : null}

      {!feedbackState.isCorrect && correctOption ? (
        <Box sx={{ p: 1.5, borderRadius: 2, border: "1px solid rgba(129,199,132,0.45)", bgcolor: "rgba(32, 72, 40, 0.25)" }}>
          <Stack direction="row" spacing={1.25} alignItems="flex-start">
            <Typography sx={{ ...optBadgeAfterAnswer, color: "rgba(200, 230, 205, 0.98)", flexShrink: 0 }}>
              {numberForOptionId(correctOption.id)}
            </Typography>
            <Typography sx={{ ...optTextAfterAnswer, color: "rgba(232, 245, 234, 0.95)" }}>{correctOption.label}</Typography>
          </Stack>
        </Box>
      ) : null}

      <Box
        key={`${currentQuestion.id}-${feedbackState.isCorrect ? "ok" : "no"}`}
        sx={{
          p: { xs: 2, sm: 2.25 },
          borderRadius: 2.5,
          border: "1px solid",
          borderColor: feedbackState.isCorrect ? "rgba(129,199,132,0.5)" : "rgba(239,128,128,0.5)",
          backgroundColor: feedbackState.isCorrect ? "rgba(32, 72, 40, 0.35)" : "rgba(72, 28, 28, 0.36)",
          width: "100%",
          [mediaNoReducedMotion]: feedbackState.isCorrect
            ? { animation: `${kioskCorrectGlowPulse} 1.75s ease-in-out 2` }
            : { animation: `${kioskShakeSubtle} 0.48s ease-out both` },
          [mediaReducedMotion]: { animation: "none" },
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center">
          {feedbackState.isCorrect ? (
            <Box
              aria-hidden
              sx={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "rgba(129,199,132,0.2)",
                border: "1px solid rgba(129,199,132,0.55)",
                color: "rgba(200, 230, 205, 0.98)",
                [mediaNoReducedMotion]: {
                  animation: `${kioskCheckPop} 0.55s cubic-bezier(0.22, 1, 0.36, 1) both`,
                },
              }}
            >
              <Box component="svg" viewBox="0 0 24 24" sx={{ width: 26, height: 26, fill: "currentColor" }}>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </Box>
            </Box>
          ) : null}
          <Typography sx={{ fontSize: "clamp(1.48rem, 2.85dvh, 2rem)", fontWeight: 800 }}>
            {feedbackState.isCorrect ? t("answerCorrectLabel") : t("answerIncorrectLabel")}
          </Typography>
        </Stack>
        {feedbackState.message ? (
          <Typography sx={{ mt: 1.25, fontFamily: FONT_DIDOT, fontStyle: "italic", fontSize: "clamp(1.38rem, 2.55dvh, 1.82rem)", lineHeight: 1.45, color: "rgba(247,242,234,0.93)" }}>
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
              minHeight: "clamp(68px, 6dvh, 88px)",
              fontSize: "clamp(1.05rem, 1.9dvh, 1.25rem)",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              borderRadius: 2,
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
  );
}
