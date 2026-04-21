export type Language = "pt" | "en";

export type Sector =
  | "importador"
  | "distribuidor"
  | "varejo_supermercado"
  | "foodservice_restaurante"
  | "industria"
  | "outro";

export type ParticipantLead = {
  name: string;
  email: string;
  country: string;
  sector: Sector;
  buysUruguayMeat: boolean;
  language: Language;
};
