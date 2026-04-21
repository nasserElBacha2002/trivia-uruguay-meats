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
          sx={{ height: 12, borderRadius: 99 }}
        />
        <Typography variant="h5">{question.prompt}</Typography>

        <ToggleButtonGroup exclusive orientation="vertical" fullWidth color="primary">
          {question.options.map((option) => (
            <ToggleButton key={option.id} value={option.id}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Stack direction="row" justifyContent="flex-end" mt="auto">
          <Button onClick={handleAnswer}>{t("answerLabel")}</Button>
        </Stack>
      </Stack>
    </ScreenCard>
  );
}
