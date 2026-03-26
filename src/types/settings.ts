export type SettingsTab = "General" | "Security" | "Notifications" | "API Keys" | "Integrations" | "Danger Zone";
export type NotificationChannel = "Product Updates" | "Security Alerts" | "Weekly Digest" | "Billing Events";
export type IntegrationSetting = "Slack Alerts" | "CRM Sync" | "Warehouse Export";

export interface GeneralSettingsState {
  organizationName: string;
  timezone: string;
  language: string;
  workspaceId: string;
}

export interface SecuritySettingsState {
  requireSso: boolean;
  enforceMfa: boolean;
  sessionTimeout: string;
  auditLogs: boolean;
}

export interface ApiKeyRecord {
  id: string;
  label: string;
  value: string;
  lastUsed: string;
  scope: string;
  revealed: boolean;
}

export type NotificationState = Record<NotificationChannel, boolean>;
export type IntegrationSettingsState = Record<IntegrationSetting, boolean>;
