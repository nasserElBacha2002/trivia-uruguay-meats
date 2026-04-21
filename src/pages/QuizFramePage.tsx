import { Box, Button, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ScreenCard } from "../components/ScreenCard";
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

        <Stack spacing={1.25}>
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
          <Box
            sx={{
              borderRadius: 2.5,
              px: 2,
              py: 1.5,
              border: "1px solid",
              borderColor: feedbackState.isCorrect ? "#4caf50" : "#ff6b6b",
              backgroundColor: feedbackState.isCorrect
                ? "rgba(76,175,80,0.14)"
                : "rgba(255,107,107,0.14)",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 700, mb: feedbackState.message ? 0.5 : 0 }}>
              {feedbackState.isCorrect ? t("answerCorrectLabel") : t("answerIncorrectLabel")}
            </Typography>
            {feedbackState.message ? (
              <Typography variant="body2" color="text.secondary">
                {feedbackState.message}
              </Typography>
            ) : null}
          </Box>
        ) : null}

        <Stack direction="row" justifyContent="flex-end" mt="auto">
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
  );
}
