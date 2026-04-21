import type { ParticipantLead } from "../../types/domain";

export type LeadFormValues = {
  name: string;
  email: string;
  country: string;
  buysUruguayMeat: string;
  sectorId: string;
};

export type LeadSubmission = ParticipantLead;
