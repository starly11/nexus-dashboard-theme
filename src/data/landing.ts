export interface LandingModule {
  title: string;
  description: string;
  href: string;
  icon: string;
  accent: string;
  accentShell: string;
}

export interface LandingFeaturePillar {
  title: string;
  description: string;
  icon: string;
  iconClass: string;
  shellClass: string;
}

export interface LandingBuyerFit {
  title: string;
  text: string;
  tone: string;
}

export const landingModules: LandingModule[] = [
  {
    title: "Dashboard",
    description: "Executive KPI overview, activity feed, chart storytelling, and recent transactions.",
    href: "/dashboard",
    icon: "dashboard",
    accent: "text-primary",
    accentShell: "bg-primary/12",
  },
  {
    title: "Analytics",
    description: "Depth charts, funnels, regional performance, and comparison workflows for growth teams.",
    href: "/analytics",
    icon: "insights",
    accent: "text-secondary",
    accentShell: "bg-secondary/12",
  },
  {
    title: "Users",
    description: "Search, filters, invite flows, status control, and table interactions for admin operations.",
    href: "/users",
    icon: "group",
    accent: "text-success",
    accentShell: "bg-success/12",
  },
  {
    title: "Billing",
    description: "Subscription plans, payment methods, invoices, and usage states for SaaS revenue teams.",
    href: "/billing",
    icon: "payments",
    accent: "text-warning",
    accentShell: "bg-warning/12",
  },
];

export const landingSellingPoints: string[] = [
  "Best fit for SaaS admin dashboards, analytics products, internal operations tools, and B2B control panels.",
  "Built with reusable React + TypeScript components, Tailwind design tokens, clear route organization, and real UI states.",
  "Includes auth, billing, users, reports, notifications, support, settings, and team workflows in one coherent product story.",
];

export const landingFeaturePillars: LandingFeaturePillar[] = [
  {
    title: "Reusable Architecture",
    description: "Component-driven React + TypeScript structure built to scale beyond a one-page demo.",
    icon: "deployed_code",
    iconClass: "text-primary",
    shellClass: "bg-primary/12",
  },
  {
    title: "Premium Visual System",
    description: "Tailwind token-based styling with layered surfaces, clear states, accent color, and motion polish.",
    icon: "palette",
    iconClass: "text-secondary",
    shellClass: "bg-secondary/12",
  },
  {
    title: "Real Product Flows",
    description: "Search, filters, tables, toggles, modals, auth, billing, reports, and support states across the app.",
    icon: "bolt",
    iconClass: "text-success",
    shellClass: "bg-success/12",
  },
  {
    title: "Launch-Ready Foundation",
    description: "Organized routes, sellable positioning, responsive layout, and ThemeForest packaging guidance included.",
    icon: "rocket_launch",
    iconClass: "text-warning",
    shellClass: "bg-warning/12",
  },
];

export const landingBuyerFit: LandingBuyerFit[] = [
  {
    title: "SaaS Admin Panel",
    text: "For startups shipping a polished internal or customer-facing control center quickly.",
    tone: "accent-card-violet",
  },
  {
    title: "Analytics Console",
    text: "For products centered on insights, revenue visibility, growth reporting, and KPI storytelling.",
    tone: "accent-card-cobalt",
  },
  {
    title: "Operations Workspace",
    text: "For billing ops, support teams, user management, and internal admin workflows.",
    tone: "accent-card-emerald",
  },
];
