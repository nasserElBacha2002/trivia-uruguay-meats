/**
 * Rutas resueltas por Vite (`import` de binarios → URL en build).
 * `web/` = derivados optimizados (mismo contenido que los INAC / vlcsnap de ~4–40 MB en raíz).
 */
/** Logo recortado (solo transparencia); el PNG completo `logo.png` tenía canvas 1920×1080 con mucho aire. */
import logoUrl from "../assets/logo-kiosk.png";
import attractHero from "../assets/web/attract-hero.jpg";
import resultHero from "../assets/web/result-hero.jpg";
import kioskAmbient from "../assets/web/kiosk-ambient.jpg";
import stageLanguage from "../assets/web/stage-language.jpg";
import stageForm from "../assets/web/stage-form.jpg";
import stageQuiz1 from "../assets/web/stage-quiz-1.jpg";
import stageQuiz2 from "../assets/web/stage-quiz-2.jpg";
import stageQuiz3 from "../assets/web/stage-quiz-3.jpg";
import stageQuiz4 from "../assets/web/stage-quiz-4.jpg";
import stageQuiz5 from "../assets/web/stage-quiz-5.jpg";

const quizStagePhotos = [stageQuiz1, stageQuiz2, stageQuiz3, stageQuiz4, stageQuiz5, kioskAmbient] as const;

export const MEDIA_ASSETS = {
  logo: logoUrl,
  /** Placa inicial (desde INAC_2025-03-0700890). */
  attractHero,
  /** Resultado (desde Inac_2024-12-100035 20). */
  resultHero,
  /** Fondo shell / última pregunta del quiz. */
  kioskAmbient,
  stageLanguage,
  stageForm,
} as const;

export function getQuizStagePhoto(questionIndex: number): string {
  const safeIndex = ((questionIndex % quizStagePhotos.length) + quizStagePhotos.length) % quizStagePhotos.length;
  return quizStagePhotos[safeIndex];
}
