export type IntegrationCategory =
  | "Communication"
  | "Automation"
  | "CRM"
  | "Developer"
  | "Analytics"
  | "Payments"
  | "Support";

export type IntegrationFilter = "All" | "Connected" | IntegrationCategory;

export interface IntegrationRecord {
  id: string;
  name: string;
  category: IntegrationCategory;
  description: string;
  connected: boolean;
  icon: string;
  actionLabel: string;
  tileClass: string;
  iconClass: string;
  statusToneClass: string;
}
