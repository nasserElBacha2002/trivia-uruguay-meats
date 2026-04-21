export type Language = "pt" | "en";

export type Sector =
  | "importador"
  | "distribuidor"
  | "varejo_supermercado"
  | "foodservice_restaurante"
  | "industria"
  | "otro";

export type AnswerOption = {
  id: string;
  label: Record<Language, string>;
};

export type Question = {
  id: string;
  prompt: Record<Language, string>;
  options: AnswerOption[];
  correctOptionId: string;
};

export type ParticipantLead = {
  name: string;
  email: string;
  country: string;
  sector: Sector;
  buysUruguayMeat: boolean;
  language: Language;
};
