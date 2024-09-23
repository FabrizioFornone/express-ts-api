import { Investment } from "../models";

export interface SanitizedInvestment {
  value: string;
  annual_rate: string;
  creation_date: Date;
}

export interface InvestmentsGroupedMetrics {
  data: Record<string, Investment[]>;
}
