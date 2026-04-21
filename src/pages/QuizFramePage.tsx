import { Box, Button, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ScreenCard } from "../components/ScreenCard";
import { KioskRightOcclusion } from "../components/layout/KioskRightOcclusion";
import { useQuizEngine } from "../features/quiz/useQuizEngine";

export function QuizFramePage() {
  const { t } = useTranslation();
  const {
    currentQuestion,
    currentQuestionIndex,
    feedbackState,
    progressValue,
    isLastQuestion,
    selectedOptionId,
    canSubmit,
    canContinue,
    selectOption,
    submitCurrentAnswer,
    continueToNext,
    questions,
  } = useQuizEngine();

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%", overflow: "hidden" }}>
      <KioskRightOcclusion zIndex={0} />
      <Box sx={{ position: "relative", zIndex: 1, height: "100%" }}>
        <ScreenCard title={t("quizTitle", { current: currentQuestionIndex + 1, total: questions.length })}>
      <Stack gap={4} height="100%">
        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{
            height: 12,
            borderRadius: 99,
            bgcolor: "rgba(229,226,225,0.15)",
            "& .MuiLinearProgress-bar": {
              background:
                "linear-gradient(135deg, rgba(255,184,28,0.96) 0%, rgba(0,47,108,0.96) 100%)",
            },
          }}
        />
        <Typography variant="h5">{currentQuestion.prompt}</Typography>

        <Stack spacing={1.25} sx={{ flex: 1, minHeight: 0, overflow: "auto", pr: 0.5 }}>
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrect = option.id === currentQuestion.correctOptionId;
            const showCorrect = feedbackState.isVisible && isCorrect;
            const showIncorrect =
              feedbackState.isVisible &&
              isSelected &&
              selectedOptionId !== currentQuestion.correctOptionId;

            return (
              <Paper
                key={option.id}
                component="button"
                type="button"
                onClick={() => selectOption(option.id)}
                disabled={feedbackState.isVisible}
                sx={{
                  width: "100%",
                  minHeight: 74,
                  borderRadius: 3,
                  border: "1px solid rgba(229,226,225,0.18)",
                  backgroundColor: "rgba(28,27,27,0.76)",
                  color: "text.primary",
                  px: 2.4,
                  py: 1.75,
                  textAlign: "left",
                  cursor: feedbackState.isVisible ? "default" : "pointer",
                  transition: "all 140ms ease",
                  outline: "none",
                  boxShadow: isSelected ? "0 0 0 1px rgba(255,184,28,0.9) inset" : "none",
                  ...(showCorrect && {
                    borderColor: "#4caf50",
                    backgroundColor: "rgba(76,175,80,0.18)",
                  }),
                  ...(showIncorrect && {
                    borderColor: "#ff6b6b",
                    backgroundColor: "rgba(255,107,107,0.16)",
                  }),
                }}
              >
                <Typography variant="h6" sx={{ fontSize: "1.03rem", fontWeight: 700 }}>
                  {option.label}
                </Typography>
              </Paper>
            );
          })}
        </Stack>

        {feedbackState.isVisible ? (
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              px: 2.5,
              py: 2,
              border: "1px solid",
              borderColor: feedbackState.isCorrect ? "rgba(76,175,80,0.55)" : "rgba(255,107,107,0.55)",
              background:
                feedbackState.isCorrect
                  ? "linear-gradient(135deg, rgba(76,175,80,0.16) 0%, rgba(19,19,19,0.55) 65%)"
                  : "linear-gradient(135deg, rgba(255,107,107,0.14) 0%, rgba(19,19,19,0.55) 65%)",
              boxShadow: "0 18px 40px rgba(0,0,0,0.28)",
            }}
          >
            <Typography variant="overline" sx={{ letterSpacing: 1.2, opacity: 0.85 }}>
              {t("quizFeedbackHeading")}
            </Typography>
            <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 800 }}>
              {feedbackState.isCorrect ? t("answerCorrectLabel") : t("answerIncorrectLabel")}
            </Typography>
            {feedbackState.message ? (
              <Typography variant="body1" sx={{ mt: 1.25, color: "text.secondary" }}>
                {feedbackState.message}
              </Typography>
            ) : null}
          </Paper>
        ) : null}

        <Stack direction="row" justifyContent="flex-end" mt="auto" sx={{ pt: 1 }}>
          {canContinue ? (
            <Button variant="contained" onClick={continueToNext}>
              {isLastQuestion ? t("seeResultLabel") : t("continueLabel")}
            </Button>
          ) : (
            <Button variant="contained" onClick={submitCurrentAnswer} disabled={!canSubmit}>
              {t("answerLabel")}
            </Button>
          )}
        </Stack>
      </Stack>
        </ScreenCard>
      </Box>
    </Box>
  );
}
