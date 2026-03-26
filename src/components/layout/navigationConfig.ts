import type { NavItem } from "@/types/navigation";

export type { NavItem } from "@/types/navigation";

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard", section: "Core" },
  { label: "Analytics", icon: "insights", href: "/analytics" },
  { label: "Users", icon: "group", href: "/users" },
  { label: "Billing", icon: "payments", href: "/billing" },
  { label: "UI Kit", icon: "widgets", href: "/ui-kit" },
  { label: "Reports", icon: "description", href: "/reports", section: "Operations" },
  { label: "Notifications", icon: "notifications", href: "/notifications" },
  { label: "Team", icon: "hub", href: "/team" },
  { label: "Integrations", icon: "extension", href: "/integrations" },
  { label: "Support", icon: "help", href: "/support" },
  { label: "Settings", icon: "settings", href: "/settings", section: "Account" },
  { label: "Profile", icon: "account_circle", href: "/profile" },
  { label: "Login", icon: "login", href: "/login", section: "Auth" },
  { label: "Signup", icon: "person_add", href: "/signup" },
];

export const NAV_ICON_ACCENTS: Record<string, { iconClass: string; chipClass: string }> = {
  dashboard: { iconClass: "text-primary", chipClass: "bg-primary/12 ring-1 ring-primary/12" },
  insights: { iconClass: "text-secondary", chipClass: "bg-secondary/12 ring-1 ring-secondary/12" },
  notifications: { iconClass: "text-accent-orange", chipClass: "bg-warning/12 ring-1 ring-warning/15" },
  group: { iconClass: "text-success", chipClass: "bg-success/12 ring-1 ring-success/12" },
  payments: { iconClass: "text-warning", chipClass: "bg-warning/12 ring-1 ring-warning/15" },
  widgets: { iconClass: "text-accent-indigo", chipClass: "bg-primary/12 ring-1 ring-primary/12" },
  description: { iconClass: "text-error", chipClass: "bg-error/10 ring-1 ring-error/12" },
  hub: { iconClass: "text-accent-violet", chipClass: "bg-primary/12 ring-1 ring-primary/12" },
  extension: { iconClass: "text-accent-cobalt", chipClass: "bg-secondary/12 ring-1 ring-secondary/12" },
  settings: { iconClass: "text-tertiary", chipClass: "bg-tertiary/10 ring-1 ring-tertiary/10" },
  help: { iconClass: "text-info", chipClass: "bg-info/12 ring-1 ring-info/12" },
  login: { iconClass: "text-primary", chipClass: "bg-primary/12 ring-1 ring-primary/12" },
  person_add: { iconClass: "text-accent-orange", chipClass: "bg-accent-orange/12 ring-1 ring-accent-orange/12" },
  account_circle: { iconClass: "text-primary-fixed", chipClass: "bg-primary-fixed/10 ring-1 ring-primary-fixed/10" },
};
