import type { ParticipantLead } from "../../types/domain";
import type { Language } from "../../types/domain";

export type LeadFormValues = {
  name: string;
  email: string;
  country: string;
  buysUruguayMeat: string;
  sectorId: string;
};

export type LeadSubmission = ParticipantLead;

export type BuysOptionId = "buys_yes" | "buys_no";
export type SectorOptionId =
  | "sector_importador"
  | "sector_distribuidor"
  | "sector_varejo_supermercado"
  | "sector_foodservice_restaurante"
  | "sector_industria"
  | "sector_outro";

const sectorMap: Record<SectorOptionId, LeadSubmission["sector"]> = {
  sector_importador: "importador",
  sector_distribuidor: "distribuidor",
  sector_varejo_supermercado: "varejo_supermercado",
  sector_foodservice_restaurante: "foodservice_restaurante",
  sector_industria: "industria",
  sector_outro: "outro",
};

export function mapLeadFormValuesToSubmission(
  values: Omit<LeadFormValues, "buysUruguayMeat" | "sectorId"> & {
    buysUruguayMeat: BuysOptionId;
    sectorId: SectorOptionId;
  },
  language: Language,
): LeadSubmission {
  return {
    name: values.name,
    email: values.email,
    country: values.country,
    buysUruguayMeat: values.buysUruguayMeat === "buys_yes",
    sector: sectorMap[values.sectorId],
    language,
  };
}
