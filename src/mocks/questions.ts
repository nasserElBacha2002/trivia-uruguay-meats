import type { Question } from "../types/domain";

export const mockQuestions: Question[] = [
  {
    id: "q1",
    prompt: {
      pt: "Que tipo de carnes o Uruguai exporta ao Brasil?",
      en: "What kinds of meat does Uruguay export to Brazil?",
    },
    options: [
      { id: "a", label: { pt: "Carne bovina e ovina", en: "Beef and lamb" } },
      { id: "b", label: { pt: "Bovina, ovina e aves", en: "Beef, lamb and poultry" } },
      { id: "c", label: { pt: "Somente bovina", en: "Only beef" } },
    ],
    correctOptionId: "a",
  },
];
