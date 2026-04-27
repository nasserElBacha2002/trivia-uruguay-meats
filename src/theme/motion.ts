/** Shared motion tokens — Uruguay Lamb kiosk (premium, restrained). */
export const motion = {
  durationFast: 180,
  duration: 220,
  durationSlow: 260,
  /** Smooth ease-out for UI reveals */
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  /** Snappy interaction release */
  easingOut: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export const mediaNoReducedMotion = "@media (prefers-reduced-motion: no-preference)";
export const mediaReducedMotion = "@media (prefers-reduced-motion: reduce)";
