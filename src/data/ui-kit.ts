import type { LineChartDatum } from "@/components/charts/ChartCard";
import type { ShowcaseRow } from "@/types/ui-kit";

export const uiKitChartData: LineChartDatum[] = [
  { x: 0, y: 120 },
  { x: 1, y: 162 },
  { x: 2, y: 150 },
  { x: 3, y: 188 },
  { x: 4, y: 236 },
  { x: 5, y: 214 },
  { x: 6, y: 280 },
];

export const uiKitPreviewTimeRanges = ["Preview"];

export const uiKitShowcaseRows: ShowcaseRow[] = [
  { id: "KIT-201", name: "Revenue Insights", owner: "Alex Rivera", status: "active", value: "$24,900" },
  { id: "KIT-202", name: "User Provisioning", owner: "Sarah Chen", status: "pending", value: "184 tasks" },
  { id: "KIT-203", name: "Audit Snapshot", owner: "Marcus Wright", status: "inactive", value: "Paused" },
  { id: "KIT-204", name: "Billing Recovery", owner: "Aisha Rahman", status: "error", value: "$3,120 at risk" },
];
