import { Button, LinearProgress, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ScreenCard } from "../components/ScreenCard";
import { ROUTES } from "../config/routes";
import { quizPtContent } from "../content/quizContent";
import { useFlowState } from "../features/session/flowState";

export function QuizFramePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { markQuizCompleted } = useFlowState();
  const question = quizPtContent.questions[0];

  const handleAnswer = () => {
    markQuizCompleted();
    navigate(ROUTES.result);
  };

  return (
    <ScreenCard title={t("quizTitle", { current: question.order, total: quizPtContent.totalQuestions })}>
      <Stack gap={4} height="100%">
        <LinearProgress
          variant="determinate"
          value={(question.order / quizPtContent.totalQuestions) * 100}
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
        <Typography variant="h5">{question.prompt}</Typography>

        <ToggleButtonGroup
          exclusive
          orientation="vertical"
          fullWidth
          color="primary"
          sx={{
            gap: 1.2,
            "& .MuiToggleButton-root": {
              minHeight: 74,
              borderRadius: 3,
              border: "1px solid rgba(229,226,225,0.18)",
              backgroundColor: "rgba(28,27,27,0.76)",
              textAlign: "left",
              justifyContent: "flex-start",
              px: 2.4,
              color: "text.primary",
              fontSize: "1.03rem",
              "&.Mui-selected": {
                backgroundColor: "rgba(0,47,108,0.88)",
                borderColor: "secondary.main",
              },
            },
          }}
        >
          {question.options.map((option) => (
            <ToggleButton key={option.id} value={option.id}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Stack direction="row" justifyContent="flex-end" mt="auto">
          <Button variant="contained" onClick={handleAnswer}>
            {t("answerLabel")}
          </Button>
        </Stack>
      </Stack>
    </ScreenCard>
  );
}
