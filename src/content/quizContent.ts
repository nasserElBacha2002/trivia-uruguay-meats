import quizPtRaw from "../mocks/quiz-pt.json";
import quizEnRaw from "./quiz-en.json";
import type { QuizContent } from "../types/quizContent";
import type { Language } from "../types/domain";

const quizContentByLanguage: Record<Language, QuizContent> = {
  pt: quizPtRaw as QuizContent,
  en: quizEnRaw as QuizContent,
};

export function getQuizContent(language: Language): QuizContent {
  return quizContentByLanguage[language];
}
