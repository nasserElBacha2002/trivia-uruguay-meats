/**
 * Uruguay Lamb kiosk — shared @emotion keyframes.
 * Idle loops are gated in consuming components with `prefers-reduced-motion`.
 * Naming: `kiosk*` = global UI; `sector*` = form sector icon idles.
 */
import { keyframes } from "@emotion/react";

/** CTA “breathing” scale — kiosk attract; ~2.1s loop, no hover. */
export const kioskCtaBreathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
`;

/** Soft gold glow pulse on primary CTA shell. */
export const kioskCtaGoldGlow = keyframes`
  0%, 100% {
    box-shadow: 0 14px 36px rgba(0,0,0,0.45), 0 0 0 0 rgba(205,153,65,0);
  }
  50% {
    box-shadow: 0 16px 42px rgba(0,0,0,0.52), 0 0 32px rgba(205,153,65,0.38);
  }
`;

/** Brand logo first paint — premium fade + rise. */
export const kioskLogoEnter = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`;

/** Subtle idle float on logo / seal (single asset). */
export const kioskLogoFloat = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(0.45deg); }
`;

/** Language / tall cards — entrance. */
export const kioskCardEnterUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: translateY(0); }
`;

/** Horizontal gold shimmer sweep across cards (idle). */
export const kioskCardShimmerSweep = keyframes`
  0%, 12% { opacity: 0; transform: skewX(-12deg) translateX(-120%); }
  18% { opacity: 0.55; }
  28% { opacity: 0.45; transform: skewX(-12deg) translateX(220%); }
  35%, 100% { opacity: 0; transform: skewX(-12deg) translateX(220%); }
`;

/** Quiz question headline — change of question. */
export const kioskQuestionEnter = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

/**
 * Quiz option cards — idle motion (transform only).
 * Paused in UI when an option is selected or answer persistence runs; use with staggered `animation-delay`.
 */
export const quizOptionCardFloat = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); }
  50% { transform: translate3d(0, -5px, 0) scale(1.01) rotate(0.28deg); }
`;

/** Alternate phase / direction so adjacent cards do not move in lockstep. */
export const quizOptionCardFloatReverse = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); }
  50% { transform: translate3d(0, -4px, 0) scale(1.008) rotate(-0.26deg); }
`;

/** Incorrect feedback — restrained lateral shake. */
export const kioskShakeSubtle = keyframes`
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
`;

/** Correct outcome — soft green/gold aura pulse (one or few cycles via iteration count in sx). */
export const kioskCorrectGlowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(129,199,132,0.35), 0 0 0 0 rgba(205,153,65,0.15); }
  50% { box-shadow: 0 0 28px 2px rgba(129,199,132,0.45), 0 0 40px rgba(205,153,65,0.25); }
`;

/** Check mark pop-in for correct feedback. */
export const kioskCheckPop = keyframes`
  0% { opacity: 0; transform: scale(0.4) rotate(-12deg); }
  70% { opacity: 1; transform: scale(1.08) rotate(4deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
`;

/** Score card / headline reveal. */
export const kioskScoreReveal = keyframes`
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
`;

/** High score headline — restrained celebratory bounce. */
export const kioskHeadlineCelebrate = keyframes`
  0% { opacity: 0; transform: translateY(16px) scale(0.96); }
  55% { opacity: 1; transform: translateY(-4px) scale(1.02); }
  75% { transform: translateY(2px) scale(0.99); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

/** Result hero image — subtle zoom + fade. */
export const kioskResultHeroZoom = keyframes`
  from { opacity: 0; transform: scale(1.04); }
  to { opacity: 1; transform: scale(1); }
`;

/** Primary result CTA — gold pulse (intensity tuned per score band in sx). */
export const kioskResultCtaPulse = keyframes`
  0%, 100% { box-shadow: 0 10px 28px rgba(0,0,0,0.4), 0 0 0 0 rgba(205,153,65,0); }
  50% { box-shadow: 0 12px 36px rgba(0,0,0,0.48), 0 0 36px rgba(205,153,65,0.45); }
`;

/** Medium score — calmer gold breathing on CTA. */
export const kioskResultCtaPulseSoft = keyframes`
  0%, 100% { box-shadow: 0 10px 28px rgba(0,0,0,0.4), 0 0 0 0 rgba(205,153,65,0); }
  50% { box-shadow: 0 11px 32px rgba(0,0,0,0.44), 0 0 24px rgba(205,153,65,0.22); }
`;

/** Low score — very restrained lift of glow. */
export const kioskResultCtaPulseSubtle = keyframes`
  0%, 100% { box-shadow: 0 8px 24px rgba(0,0,0,0.38), 0 0 0 0 rgba(205,153,65,0); }
  50% { box-shadow: 0 9px 26px rgba(0,0,0,0.42), 0 0 14px rgba(205,153,65,0.12); }
`;

/** Secondary outlined CTA — low-key border pulse. */
export const kioskSecondaryIdlePulse = keyframes`
  0%, 100% { border-color: rgba(205,153,65,0.45); }
  50% { border-color: rgba(205,153,65,0.72); }
`;

/** Gold confetti / particles — vertical drift. */
export const kioskParticleDrift = keyframes`
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  8% { opacity: 0.55; }
  100% { transform: translateY(-100vh) translateX(12px); opacity: 0; }
`;

/** Sector idle: importador — vertical float. */
export const sectorIdleFloatY = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;

/** Sector idle: distribuidor — micro scale pulse. */
export const sectorIdlePulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
`;

/** Sector idle: varejo — minimal bounce. */
export const sectorIdleMiniBounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
`;

/** Sector idle: foodservice — subtle rotation wobble. */
export const sectorIdleWobble = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-2.5deg); }
  75% { transform: rotate(2.5deg); }
`;

/** Sector idle: indústria — slow gentle pulse. */
export const sectorIdleSlowPulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.88; }
`;

/** Sector idle: outro — whole-icon opacity pulse (reads as “dots” activity). */
export const sectorIdleOtherPulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
`;

/** Selection snap on sector / toggle cards. */
export const kioskSelectSnap = keyframes`
  0% { transform: scale(0.98); }
  100% { transform: scale(1); }
`;
