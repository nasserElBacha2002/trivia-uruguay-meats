export const ROUTES = {
  attract: "/",
  admin: "/admin",
  language: "/language",
  form: "/form",
  quiz: "/quiz",
  result: "/result",
} as const;

export const ROUTE_ORDER = [
  ROUTES.attract,
  ROUTES.language,
  ROUTES.form,
  ROUTES.quiz,
  ROUTES.result,
] as const;
