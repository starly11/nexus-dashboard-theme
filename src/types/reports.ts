export type ReportFormat = "CSV" | "PDF" | "JSON";
export type ReportRange = "Last 30 Days" | "Last Quarter" | "Year to Date" | "Custom Range";
export type ScheduleState = "active" | "inactive";

export interface ReportPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  iconWrapperClass: string;
  iconColorClass: string;
  categoryClass: string;
  accentBorderClass: string;
  accentTextClass: string;
}

export interface ScheduleRecord {
  id: string;
  name: string;
  frequency: "Weekly" | "Monthly" | "Quarterly";
  lastSent: string;
  nextSend: string;
  status: ScheduleState;
  accentDotClass: string;
}
