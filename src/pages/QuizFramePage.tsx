import { Box, Button, ButtonBase, LinearProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { KioskRightOcclusion } from "../components/layout/KioskRightOcclusion";
import { useQuizEngine } from "../features/quiz/useQuizEngine";
import type { QuizQuestionOption } from "../types/quizContent";

const OPTION_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function QuizFramePage() {
  const { t } = useTranslation();
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
  } = useQuizEngine();

  const options = currentQuestion.options;
  const lastIndexSpansRow = options.length === 3;

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
                background: "linear-gradient(90deg, rgba(255,184,28,0.95) 0%, rgba(31,101,199,0.95) 100%)",
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
                fontSize: "0.7rem",
                letterSpacing: "0.22em",
                fontWeight: 700,
                textTransform: "uppercase",
                opacity: 0.55,
              }}
            >
              {t("quizEyebrow", { current: currentQuestionIndex + 1, total: questions.length })}
            </Typography>

            <Typography
              component="h1"
              sx={{
                mx: "auto",
                maxWidth: "min(920px, 100%)",
                fontSize: { xs: "clamp(1.45rem, 4.2vw, 2.35rem)", md: "clamp(1.85rem, 2.8vw, 2.85rem)" },
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
              justifyContent: "center",
              py: { xs: 2, md: 2.5 },
            }}
          >
            <Box
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

                return (
                  <ButtonBase
                    key={option.id}
                    type="button"
                    disabled={feedbackState.isVisible}
                    onClick={() => answerWithOption(option.id)}
                    sx={{
                      gridColumn: spanFullRow ? { xs: "auto", md: "1 / -1" } : "auto",
                      justifyContent: "flex-start",
                      alignItems: "stretch",
                      textAlign: "left",
                      borderRadius: 2.5,
                      p: { xs: 2, md: 2.5 },
                      minHeight: { xs: 112, md: 124 },
                      border: "1px solid rgba(229,226,225,0.14)",
                      backgroundColor: "rgba(0,27,68,0.38)",
                      backdropFilter: "blur(14px)",
                      WebkitBackdropFilter: "blur(14px)",
                      color: "text.primary",
                      transition:
                        "background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
                      outline: "none",
                      boxShadow: isSelected && !feedbackState.isVisible ? "inset 0 0 0 1px rgba(255,184,28,0.45)" : "none",
                      ...(showCorrect && {
                        borderColor: "rgba(129,199,132,0.75)",
                        backgroundColor: "rgba(46,125,50,0.22)",
                        boxShadow: "inset 0 0 0 1px rgba(129,199,132,0.5)",
                      }),
                      ...(showIncorrect && {
                        borderColor: "rgba(239,83,80,0.65)",
                        backgroundColor: "rgba(183,28,28,0.2)",
                        boxShadow: "inset 0 0 0 1px rgba(239,83,80,0.45)",
                      }),
                      "&:hover:not(.Mui-disabled)": {
                        backgroundColor: "rgba(0,47,108,0.55)",
                        borderColor: "rgba(31,101,199,0.85)",
                        boxShadow: "0 0 0 1px rgba(255,184,28,0.35), 0 12px 36px rgba(0,0,0,0.28)",
                        transform: "translateY(-1px)",
                        "& .quiz-option-letter": {
                          color: "secondary.main",
                          textShadow: "0 0 18px rgba(255,184,28,0.35)",
                        },
                      },
                      "&.Mui-focusVisible": {
                        boxShadow: "0 0 0 2px rgba(255,184,28,0.65)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1, width: "100%" }}>
                      <Typography
                        className="quiz-option-letter"
                        component="span"
                        sx={{
                          fontSize: { xs: "2rem", md: "2.35rem" },
                          fontWeight: 800,
                          lineHeight: 1,
                          letterSpacing: "0.04em",
                          color: showCorrect ? "secondary.main" : showIncorrect ? "error.light" : "rgba(255,255,255,0.88)",
                          transition: "color 180ms ease, text-shadow 180ms ease",
                        }}
                      >
                        {letter}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: "0.95rem", md: "1.05rem" },
                          fontWeight: 700,
                          lineHeight: 1.35,
                          color: "rgba(245,245,245,0.92)",
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
                mb: { xs: 1.5, md: 2 },
                p: { xs: 2, md: 2.25 },
                borderRadius: 2.5,
                border: "1px solid",
                borderColor: feedbackState.isCorrect ? "rgba(129,199,132,0.45)" : "rgba(239,128,128,0.45)",
                backgroundColor: feedbackState.isCorrect ? "rgba(27,94,32,0.18)" : "rgba(183,28,28,0.14)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography sx={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.75 }}>
                {t("quizFeedbackHeading")}
              </Typography>
              <Typography sx={{ mt: 0.75, fontSize: "1.35rem", fontWeight: 800 }}>
                {feedbackState.isCorrect ? t("answerCorrectLabel") : t("answerIncorrectLabel")}
              </Typography>
              {feedbackState.message ? (
                <Typography sx={{ mt: 1.25, fontSize: "0.95rem", lineHeight: 1.45, opacity: 0.88 }}>
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
                    bgcolor: "primary.main",
                  }}
                >
                  {isLastQuestion ? t("seeResultLabel") : t("continueLabel")}
                </Button>
              ) : null}
            </Box>
          ) : null}

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
                bgcolor: "secondary.main",
                boxShadow: "0 0 16px rgba(255,184,28,0.45)",
              }}
            />
            <Typography sx={{ fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>
              {t("quizTapHint")}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
