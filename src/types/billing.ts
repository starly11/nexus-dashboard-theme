export type BillingCycle = "Monthly" | "Annual";
export type PlanTier = "Growth" | "Enterprise" | "Scale";
export type InvoiceStatus = "Paid" | "Processing" | "Overdue";

export interface PlanDetails {
  tier: PlanTier;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  apiLimit: number;
  seatsLimit: number;
  storageLimitTb: number;
  accentClass: string;
}

export interface UsageMetric {
  label: string;
  usedValue: number;
  limitValue: number;
  displayValue: string;
  displayLimit: string;
  accentBarClass: string;
  accentTextClass: string;
}

export interface InvoiceRecord {
  id: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
  period: string;
  method: string;
}

export interface PaymentMethodState {
  brand: string;
  last4: string;
  expiry: string;
  holder: string;
}
