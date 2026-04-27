/**
 * Rutas resueltas por Vite (`import` de binarios → URL en build).
 * `web/` = derivados optimizados (mismo contenido que los INAC / vlcsnap de ~4–40 MB en raíz).
 */
/** Logo recortado (solo transparencia); el PNG completo `logo.png` tenía canvas 1920×1080 con mucho aire. */
import logoUrl from "../assets/logo-kiosk.png";
import attractHero from "../assets/web/attract-hero.jpg";
import resultHero from "../assets/web/result-hero.jpg";
import kioskAmbient from "../assets/web/kiosk-ambient.jpg";

export const MEDIA_ASSETS = {
  logo: logoUrl,
  /** Placa inicial (desde INAC_2025-03-0700890). */
  attractHero,
  /** Resultado (desde Inac_2024-12-100035 20). */
  resultHero,
  /** Fondo suave shell: frame vlc → JPEG liviano. */
  kioskAmbient,
} as const;
