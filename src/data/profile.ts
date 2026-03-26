import { PRODUCT } from "@/config/product";
import type {
  ActivityRecord,
  LinkedAccount,
  ProfileDetailItem,
  ProfilePreferenceCard,
  SessionRecord,
} from "@/types/profile";

export const recentActivity: ActivityRecord[] = [
  {
    id: "activity_1",
    title: "Updated Q4 Revenue Report",
    subtitle: "2 hours ago • Financial Dashboard",
    icon: "update",
    iconWrapperClass: "bg-secondary/10",
    iconClass: "text-secondary",
  },
  {
    id: "activity_2",
    title: "Logged in from San Francisco",
    subtitle: "Today, 9:15 AM • Chrome on macOS",
    icon: "login",
    iconWrapperClass: "bg-primary/10",
    iconClass: "text-primary",
  },
  {
    id: "activity_3",
    title: "API Key Rotation Required",
    subtitle: "Yesterday • Security Alert",
    icon: "notification_important",
    iconWrapperClass: "bg-error/10",
    iconClass: "text-error",
  },
];

export const initialLinkedAccounts: LinkedAccount[] = [
  { id: "google", name: "Google", connected: true },
  { id: "github", name: "GitHub", connected: true },
];

export const initialSessions: SessionRecord[] = [
  { id: "session_1", device: "Chrome • macOS", detail: "192.168.1.1", active: true, icon: "laptop_mac" },
  { id: "session_2", device: `${PRODUCT.mobileAppName} • iOS`, detail: "2 days ago", active: false, icon: "smartphone" },
];

export const profileExpertise = ["SQL", "PYTHON", "BIGQUERY", "LOOKER", "D3.JS"];
export const profileAboutSummary =
  "Leading lifecycle analytics, reporting strategy, and workspace operations for the Nexus HQ product team since 2021.";

export const profileAboutDetails: ProfileDetailItem[] = [
  { icon: "alternate_email", label: "Email", value: PRODUCT.demoUser.email },
  { icon: "smartphone", label: "Phone", value: "+1 (555) 234-8902" },
  { icon: "schedule", label: "Timezone", value: "Pacific Time (UTC-7)" },
  { icon: "business", label: "Company", value: PRODUCT.companyName },
];

export const profilePreferenceCards: ProfilePreferenceCard[] = [
  { label: "Theme", value: "Deep Charcoal", icon: "palette" },
  { label: "Language", value: "English (US)", icon: "translate" },
  { label: "Storage", value: "1.2 GB / 10 GB", icon: "database" },
];

export const defaultTwoFactorEnabled = true;
