export type Language = "pt" | "en";

export type SectorId =
  | "sector_importador"
  | "sector_distribuidor"
  | "sector_varejo_supermercado"
  | "sector_foodservice_restaurante"
  | "sector_industria"
  | "sector_outro";

export type ParticipantLead = {
  name: string;
  email: string;
  country: string;
  sectorId: SectorId;
  buysUruguayMeat: "buys_yes" | "buys_no";
  language: Language;
};
