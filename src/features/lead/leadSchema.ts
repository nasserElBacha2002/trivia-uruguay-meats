import { z } from "zod";
import type { BuysOptionId, LeadFormValues, SectorOptionId } from "./leadTypes";

export const buysOptions = ["buys_yes", "buys_no"] as const satisfies readonly BuysOptionId[];
export const sectorOptions = [
  "sector_importador",
  "sector_distribuidor",
  "sector_varejo_supermercado",
  "sector_foodservice_restaurante",
  "sector_industria",
  "sector_outro",
] as const satisfies readonly SectorOptionId[];

type TranslateFn = (key: string) => string;

export function createLeadSchema(t: TranslateFn) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, t("validationNameRequired"))
      .transform((value) => value.replace(/\s+/g, " ")),
    email: z
      .string()
      .trim()
      .min(1, t("validationEmailRequired"))
      .email(t("validationEmailInvalid")),
    country: z
      .string()
      .trim()
      .min(1, t("validationCountryRequired"))
      .transform((value) => value.replace(/\s+/g, " ")),
    buysUruguayMeat: z
      .string()
      .min(1, t("validationSelectRequired"))
      .pipe(z.enum(buysOptions)),
    sectorId: z
      .string()
      .min(1, t("validationSelectRequired"))
      .pipe(z.enum(sectorOptions)),
  });
}

export type LeadSchema = z.infer<ReturnType<typeof createLeadSchema>>;

export const leadDefaultValues: LeadFormValues = {
  name: "",
  email: "",
  country: "",
  buysUruguayMeat: "",
  sectorId: "",
};
