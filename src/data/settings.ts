import { PRODUCT } from "@/config/product";
import type {
  ApiKeyRecord,
  GeneralSettingsState,
  IntegrationSetting,
  IntegrationSettingsState,
  NotificationChannel,
  NotificationState,
  SecuritySettingsState,
  SettingsTab,
} from "@/types/settings";

export const settingsTabs: SettingsTab[] = ["General", "Security", "Notifications", "API Keys", "Integrations", "Danger Zone"];
export const notificationChannels: NotificationChannel[] = ["Product Updates", "Security Alerts", "Weekly Digest", "Billing Events"];
export const integrationSettingsOptions: IntegrationSetting[] = ["Slack Alerts", "CRM Sync", "Warehouse Export"];
export const defaultSettingsTab: SettingsTab = "General";
export const defaultSettingsLastSavedLabel = "Last updated 2 days ago";

export const settingsTimezoneOptions = [
  "(GMT-08:00) Pacific Time (US & Canada)",
  "(GMT+00:00) UTC",
  "(GMT+01:00) London, Lisbon",
  "(GMT+09:00) Tokyo, Seoul",
];
export const settingsLanguageOptions = [
  "English (United States)",
  "Spanish (Español)",
  "Japanese (日本語)",
  "German (Deutsch)",
];
export const settingsSessionTimeoutOptions = ["4 hours", "8 hours", "12 hours", "24 hours"];

export const initialGeneralSettings: GeneralSettingsState = {
  organizationName: PRODUCT.companyName,
  timezone: "(GMT-08:00) Pacific Time (US & Canada)",
  language: "English (United States)",
  workspaceId: PRODUCT.workspaceId,
};

export const initialSecuritySettings: SecuritySettingsState = {
  requireSso: true,
  enforceMfa: true,
  sessionTimeout: "12 hours",
  auditLogs: true,
};

export const initialNotificationSettings: NotificationState = {
  "Product Updates": true,
  "Security Alerts": true,
  "Weekly Digest": false,
  "Billing Events": true,
};

export const initialIntegrationSettings: IntegrationSettingsState = {
  "Slack Alerts": true,
  "CRM Sync": true,
  "Warehouse Export": false,
};

export const initialApiKeys: ApiKeyRecord[] = [
  {
    id: "key_primary",
    label: "Primary Server Key",
    value: "nx_live_3nf8d2h1x9q4u7p5",
    lastUsed: "12 mins ago",
    scope: "Full Access",
    revealed: false,
  },
  {
    id: "key_readonly",
    label: "Read Only Reporting Key",
    value: "nx_ro_1kd2m9z8r7p3c5v6",
    lastUsed: "Yesterday",
    scope: "Reports",
    revealed: false,
  },
];
