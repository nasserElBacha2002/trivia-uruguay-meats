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

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .transform((value) => value.replace(/\s+/g, " ")),
  email: z
    .string()
    .trim()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  country: z
    .string()
    .trim()
    .min(1, "País é obrigatório")
    .transform((value) => value.replace(/\s+/g, " ")),
  buysUruguayMeat: z
    .string()
    .min(1, "Selecione uma opção")
    .pipe(z.enum(buysOptions)),
  sectorId: z
    .string()
    .min(1, "Selecione uma opção")
    .pipe(z.enum(sectorOptions)),
});

export type LeadSchema = z.infer<typeof leadSchema>;

export const leadDefaultValues: LeadFormValues = {
  name: "",
  email: "",
  country: "",
  buysUruguayMeat: "",
  sectorId: "",
};
