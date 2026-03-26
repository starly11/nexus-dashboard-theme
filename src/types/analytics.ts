export type AnalyticsRange = "30D" | "90D" | "1Y";
export type AnalyticsFunnelSection = "Acquisition" | "Activation" | "Retention";
export type AnalyticsTrendTone = "text-success" | "text-secondary" | "text-error";

export interface AnalyticsRangeConfig {
  chartPath: string;
  compareLabel: string;
  dau: string;
  mau: string;
  trend: string;
}

export interface RegionItem {
  name: string;
  percentage: number;
  accent: string;
  hotspotClass: string;
  value: string;
}

export interface FunnelMetric {
  label: string;
  value: string;
  width: string;
  fillClass: string;
}

export interface PageMetric {
  path: string;
  views: string;
  avgTime: string;
  trend: string;
  exitRate: string;
  trendTone: AnalyticsTrendTone;
}
