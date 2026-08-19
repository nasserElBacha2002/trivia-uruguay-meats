/**
 * TEMPORAL FASE 2 — bootstrap zero-config.
 * El backend desktop no lee `.env`. Estas credenciales permiten arrancar y probar `/admin`.
 * NO son la password de producción. Fase posterior: hash compilado (scrypt/argon2).
 */
export const DESKTOP_ADMIN_CONFIG = {
  username: "admin",
  password: "admin",
  secureCookie: false,
} as const;
