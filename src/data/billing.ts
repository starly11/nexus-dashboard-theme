import type {
  BillingCycle,
  InvoiceStatus,
  InvoiceRecord,
  PaymentMethodState,
  PlanDetails,
  PlanTier,
} from "@/types/billing";

export const planDetailsMap: Record<PlanTier, PlanDetails> = {
  Growth: {
    tier: "Growth",
    description: "For lean teams building repeatable operations.",
    monthlyPrice: 420,
    annualPrice: 378,
    apiLimit: 500_000,
    seatsLimit: 8,
    storageLimitTb: 2,
    accentClass: "text-secondary",
  },
  Enterprise: {
    tier: "Enterprise",
    description: "Dedicated resources for global scale operations.",
    monthlyPrice: 1200,
    annualPrice: 990,
    apiLimit: 1_000_000,
    seatsLimit: 15,
    storageLimitTb: 5,
    accentClass: "text-primary",
  },
  Scale: {
    tier: "Scale",
    description: "Advanced governance, higher caps, and white-glove support.",
    monthlyPrice: 1850,
    annualPrice: 1560,
    apiLimit: 2_000_000,
    seatsLimit: 30,
    storageLimitTb: 12,
    accentClass: "text-warning",
  },
};

export const initialInvoices: InvoiceRecord[] = [
  { id: "#INV-94128", date: "Sep 28, 2024", amount: 1200, status: "Paid", period: "Sep 01 - Sep 30", method: "Visa •••• 4242" },
  { id: "#INV-94127", date: "Aug 28, 2024", amount: 1200, status: "Paid", period: "Aug 01 - Aug 31", method: "Visa •••• 4242" },
  { id: "#INV-94126", date: "Jul 28, 2024", amount: 1200, status: "Paid", period: "Jul 01 - Jul 31", method: "Visa •••• 4242" },
  { id: "#INV-94125", date: "Jun 28, 2024", amount: 1200, status: "Paid", period: "Jun 01 - Jun 30", method: "Visa •••• 4242" },
  { id: "#INV-94124", date: "May 28, 2024", amount: 980, status: "Processing", period: "May 01 - May 31", method: "Visa •••• 4242" },
  { id: "#INV-94123", date: "Apr 28, 2024", amount: 980, status: "Overdue", period: "Apr 01 - Apr 30", method: "Visa •••• 4242" },
];

export const invoiceStatusVariants: Record<InvoiceStatus, "success" | "warning" | "error"> = {
  Paid: "success",
  Processing: "warning",
  Overdue: "error",
};

export const planOrder: PlanTier[] = ["Growth", "Enterprise", "Scale"];
export const billingCycles: BillingCycle[] = ["Monthly", "Annual"];
export const invoiceStatusFilters: Array<"All" | InvoiceStatus> = ["All", "Paid", "Processing", "Overdue"];

export const defaultPaymentMethod: PaymentMethodState = {
  brand: "Visa",
  last4: "4242",
  expiry: "12/26",
  holder: "Alex Rivera",
};
