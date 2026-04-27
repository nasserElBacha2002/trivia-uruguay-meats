import { keyframes } from "@emotion/react";
import { Box, Button, ButtonBase, LinearProgress, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { KioskHeader } from "../components/kiosk/KioskHeader";
import { KioskScreen } from "../components/kiosk/KioskScreen";
import { useQuizEngine } from "../features/quiz/useQuizEngine";
import { BRAND_GOLD } from "../theme/appTheme";
import { mediaNoReducedMotion, mediaReducedMotion, motion } from "../theme/motion";
import type { QuizQuestion, QuizQuestionOption } from "../types/quizContent";

const OPTION_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const quizOptionEnter = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
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

  const letterForId = (id: string) => {
    const idx = options.findIndex((o) => o.id === id);
    return OPTION_LETTERS[idx] ?? String(idx + 1);
  };

  return (
    <KioskScreen header={<KioskHeader logoSize="standard" progress={progressValue} />}>
      {feedbackState.isVisible ? (
        <QuizFeedbackLayout
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          questionsLength={questions.length}
          feedbackState={feedbackState}
          selectedOption={selectedOption}
          correctOption={correctOption}
          letterForId={letterForId}
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

      <Box sx={{ textAlign: "center", flexShrink: 0 }}>
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
            fontSize: "clamp(1.5rem, 3.2dvh, 2.35rem)",
            lineHeight: 1.12,
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          {currentQuestion.prompt}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Stack spacing={1.25} sx={{ width: "100%" }}>
          {options.map((option, index) => {
            const letter = OPTION_LETTERS[index] ?? String(index + 1);
            const isSelected = selectedOptionId === option.id;
            const awaiting = isSelected && !isAnswerPersistencePending;
            const staggerMs = index * 45;
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
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ position: "relative", zIndex: 1, width: "100%", pr: 1 }}>
                  <Typography className="quiz-option-letter" component="span" sx={{ ...optLetter, color: "rgba(255,255,255,0.9)", flexShrink: 0 }}>
                    {letter}
                  </Typography>
                  <Typography sx={optText}>{option.label}</Typography>
                </Stack>
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
  letterForId,
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
  letterForId: (id: string) => string;
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
        <Typography sx={{ fontSize: "clamp(1.2rem, 2.5dvh, 1.75rem)", fontWeight: 800, lineHeight: 1.15 }}>{currentQuestion.prompt}</Typography>
      </Box>

      {selectedOption ? (
        <Box sx={{ p: 1.5, borderRadius: 2, border: "1px solid rgba(205,153,65,0.35)", bgcolor: "rgba(255,255,255,0.06)" }}>
          <Stack direction="row" spacing={1.25} alignItems="flex-start">
            <Typography sx={{ ...optLetter, fontSize: "clamp(1.8rem, 3.5dvh, 2.5rem)", color: "secondary.main", flexShrink: 0 }}>
              {letterForId(selectedOption.id)}
            </Typography>
            <Typography sx={{ ...optText, fontSize: "clamp(1.1rem, 2dvh, 1.45rem)" }}>{selectedOption.label}</Typography>
          </Stack>
        </Box>
      ) : null}

      {!feedbackState.isCorrect && correctOption ? (
        <Box sx={{ p: 1.5, borderRadius: 2, border: "1px solid rgba(129,199,132,0.45)", bgcolor: "rgba(32, 72, 40, 0.25)" }}>
          <Stack direction="row" spacing={1.25} alignItems="flex-start">
            <Typography sx={{ ...optLetter, fontSize: "clamp(1.8rem, 3.5dvh, 2.5rem)", color: "rgba(200, 230, 205, 0.98)", flexShrink: 0 }}>
              {letterForId(correctOption.id)}
            </Typography>
            <Typography sx={{ ...optText, fontSize: "clamp(1.1rem, 2dvh, 1.45rem)", color: "rgba(232, 245, 234, 0.95)" }}>{correctOption.label}</Typography>
          </Stack>
        </Box>
      ) : null}

      <Box
        sx={{
          p: { xs: 2, sm: 2.25 },
          borderRadius: 2.5,
          border: "1px solid",
          borderColor: feedbackState.isCorrect ? "rgba(129,199,132,0.5)" : "rgba(239,128,128,0.5)",
          backgroundColor: feedbackState.isCorrect ? "rgba(32, 72, 40, 0.35)" : "rgba(72, 28, 28, 0.36)",
          width: "100%",
        }}
      >
        <Typography sx={{ fontSize: "clamp(1.25rem, 2.5dvh, 1.65rem)", fontWeight: 800 }}>
          {feedbackState.isCorrect ? t("answerCorrectLabel") : t("answerIncorrectLabel")}
        </Typography>
        {feedbackState.message ? (
          <Typography sx={{ mt: 1.25, fontSize: "clamp(1.15rem, 2.1dvh, 1.5rem)", lineHeight: 1.5, color: "rgba(247,242,234,0.93)" }}>
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
