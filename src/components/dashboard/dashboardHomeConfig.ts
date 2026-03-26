import type { DashboardQuickAction } from "@/components/dashboard/DashboardQuickActions";
import type { LineChartDatum } from "@/components/charts/ChartCard";

export const RANGE_DATA: Record<string, LineChartDatum[]> = {
  "Last 30 Days": [
    { x: 0, y: 250 },
    { x: 1, y: 230 },
    { x: 2, y: 260 },
    { x: 3, y: 180 },
    { x: 4, y: 100 },
    { x: 5, y: 150 },
    { x: 6, y: 80 },
    { x: 7, y: 10 },
    { x: 8, y: 90 },
    { x: 9, y: 40 },
    { x: 10, y: 60 },
  ],
  "90D": [
    { x: 0, y: 200 },
    { x: 1, y: 185 },
    { x: 2, y: 235 },
    { x: 3, y: 160 },
    { x: 4, y: 145 },
    { x: 5, y: 205 },
    { x: 6, y: 175 },
    { x: 7, y: 210 },
    { x: 8, y: 260 },
    { x: 9, y: 245 },
    { x: 10, y: 290 },
  ],
  "1Y": [
    { x: 0, y: 110 },
    { x: 1, y: 125 },
    { x: 2, y: 140 },
    { x: 3, y: 155 },
    { x: 4, y: 165 },
    { x: 5, y: 190 },
    { x: 6, y: 220 },
    { x: 7, y: 260 },
    { x: 8, y: 285 },
    { x: 9, y: 320 },
    { x: 10, y: 360 },
  ],
};

export const QUICK_ACTIONS: DashboardQuickAction[] = [
  {
    label: "Generate Report",
    icon: "auto_graph",
    accent: "text-accent-cobalt",
    panelClass: "accent-card-cobalt border-secondary/18",
    iconShellClass: "bg-secondary/12",
    metricClass: "text-secondary",
    description: "Compile the monthly board export.",
  },
  {
    label: "Invite User",
    icon: "person_add",
    accent: "text-success",
    panelClass: "accent-card-emerald border-success/18",
    iconShellClass: "bg-success/12",
    metricClass: "text-success",
    description: "Create a new access link instantly.",
  },
  {
    label: "Sync Billing",
    icon: "sync",
    accent: "text-warning",
    panelClass: "accent-card-amber border-warning/18",
    iconShellClass: "bg-warning/12",
    metricClass: "text-warning",
    description: "Refresh invoices and payment health.",
  },
];

export const DASHBOARD_TIME_RANGES = ["Last 30 Days", "90D", "1Y"];
