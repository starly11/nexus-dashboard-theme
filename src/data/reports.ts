import type { ReportFormat, ReportPreset, ReportRange, ScheduleRecord } from "@/types/reports";

export const reportPresets: ReportPreset[] = [
  {
    id: "revenue-report",
    title: "Revenue Report",
    category: "Financial",
    description: "Detailed breakdown of gross revenue, net profit, and regional tax allocations across the billing stack.",
    icon: "payments",
    iconWrapperClass: "bg-primary/12",
    iconColorClass: "text-primary",
    categoryClass: "bg-primary/8 text-primary",
    accentBorderClass: "hover:border-primary/25",
    accentTextClass: "group-hover:text-primary",
  },
  {
    id: "user-growth",
    title: "User Growth",
    category: "Acquisition",
    description: "Analysis of daily active users, signup velocity, campaign efficiency, and conversion quality.",
    icon: "group_add",
    iconWrapperClass: "bg-secondary/12",
    iconColorClass: "text-secondary",
    categoryClass: "bg-secondary/8 text-secondary",
    accentBorderClass: "hover:border-secondary/25",
    accentTextClass: "group-hover:text-secondary",
  },
  {
    id: "churn-analysis",
    title: "Churn Analysis",
    category: "Retention",
    description: "In-depth study of attrition rates, exit signals, and lifecycle drop-off patterns across enterprise accounts.",
    icon: "person_remove",
    iconWrapperClass: "bg-error/10",
    iconColorClass: "text-error",
    categoryClass: "bg-error/8 text-error",
    accentBorderClass: "hover:border-error/25",
    accentTextClass: "group-hover:text-error",
  },
];

export const initialSchedules: ScheduleRecord[] = [
  {
    id: "weekly-digest",
    name: "Weekly Executive Digest",
    frequency: "Weekly",
    lastSent: "2024-10-23",
    nextSend: "2024-10-30",
    status: "active",
    accentDotClass: "bg-primary",
  },
  {
    id: "monthly-audit",
    name: "Monthly Infrastructure Audit",
    frequency: "Monthly",
    lastSent: "2024-10-01",
    nextSend: "2024-11-01",
    status: "active",
    accentDotClass: "bg-secondary",
  },
  {
    id: "compliance-sync",
    name: "Q3 Compliance Sync",
    frequency: "Quarterly",
    lastSent: "2024-09-30",
    nextSend: "Paused",
    status: "inactive",
    accentDotClass: "bg-error/60",
  },
];

export const reportRangeOptions: ReportRange[] = ["Last 30 Days", "Last Quarter", "Year to Date", "Custom Range"];
export const reportFormatOptions: ReportFormat[] = ["CSV", "PDF", "JSON"];
