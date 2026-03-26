import type {
  AnalyticsFunnelSection,
  AnalyticsRange,
  AnalyticsRangeConfig,
  FunnelMetric,
  PageMetric,
  RegionItem,
} from "@/types/analytics";

export const analyticsRangeConfig: Record<AnalyticsRange, AnalyticsRangeConfig> = {
  "30D": {
    chartPath: "M0,82 Q110,20 220,56 T440,34 T660,70 T840,18 L1000,50",
    compareLabel: "+12.4%",
    dau: "128.2k",
    mau: "1.96M",
    trend: "Momentum accelerating in enterprise segments.",
  },
  "90D": {
    chartPath: "M0,70 Q110,42 220,60 T440,28 T660,54 T840,22 L1000,30",
    compareLabel: "+18.1%",
    dau: "146.9k",
    mau: "2.41M",
    trend: "Retention recovered after onboarding refresh.",
  },
  "1Y": {
    chartPath: "M0,90 Q110,85 220,68 T440,52 T660,34 T840,12 L1000,8",
    compareLabel: "+34.7%",
    dau: "162.4k",
    mau: "3.18M",
    trend: "Annual expansion curve is compounding steadily.",
  },
};

export const analyticsFunnels: Record<AnalyticsRange, Record<AnalyticsFunnelSection, FunnelMetric[]>> = {
  "30D": {
    Acquisition: [
      { label: "Total Visits", value: "4.2M", width: "100%", fillClass: "bg-primary/20" },
      { label: "Signup Start", value: "2.7M", width: "65%", fillClass: "bg-primary/20" },
      { label: "Completed", value: "924k", width: "22%", fillClass: "bg-primary/20" },
    ],
    Activation: [
      { label: "Onboarded", value: "812k", width: "100%", fillClass: "bg-secondary/20" },
      { label: "First Action", value: "341k", width: "42%", fillClass: "bg-secondary/20" },
      { label: "Verified", value: "146k", width: "18%", fillClass: "bg-secondary/20" },
    ],
    Retention: [
      { label: "W1 Return", value: "74.2%", width: "100%", fillClass: "bg-tertiary/20" },
      { label: "W4 Return", value: "35.6%", width: "48%", fillClass: "bg-tertiary/20" },
      { label: "Core Power", value: "22.1%", width: "30%", fillClass: "bg-tertiary/20" },
    ],
  },
  "90D": {
    Acquisition: [
      { label: "Total Visits", value: "9.8M", width: "100%", fillClass: "bg-primary/20" },
      { label: "Signup Start", value: "5.9M", width: "60%", fillClass: "bg-primary/20" },
      { label: "Completed", value: "2.1M", width: "24%", fillClass: "bg-primary/20" },
    ],
    Activation: [
      { label: "Onboarded", value: "1.7M", width: "100%", fillClass: "bg-secondary/20" },
      { label: "First Action", value: "946k", width: "56%", fillClass: "bg-secondary/20" },
      { label: "Verified", value: "504k", width: "28%", fillClass: "bg-secondary/20" },
    ],
    Retention: [
      { label: "W1 Return", value: "78.6%", width: "100%", fillClass: "bg-tertiary/20" },
      { label: "W4 Return", value: "42.8%", width: "54%", fillClass: "bg-tertiary/20" },
      { label: "Core Power", value: "27.3%", width: "37%", fillClass: "bg-tertiary/20" },
    ],
  },
  "1Y": {
    Acquisition: [
      { label: "Total Visits", value: "42.6M", width: "100%", fillClass: "bg-primary/20" },
      { label: "Signup Start", value: "28.4M", width: "67%", fillClass: "bg-primary/20" },
      { label: "Completed", value: "11.6M", width: "31%", fillClass: "bg-primary/20" },
    ],
    Activation: [
      { label: "Onboarded", value: "9.4M", width: "100%", fillClass: "bg-secondary/20" },
      { label: "First Action", value: "5.2M", width: "55%", fillClass: "bg-secondary/20" },
      { label: "Verified", value: "2.6M", width: "27%", fillClass: "bg-secondary/20" },
    ],
    Retention: [
      { label: "W1 Return", value: "81.8%", width: "100%", fillClass: "bg-tertiary/20" },
      { label: "W4 Return", value: "49.4%", width: "60%", fillClass: "bg-tertiary/20" },
      { label: "Core Power", value: "33.7%", width: "41%", fillClass: "bg-tertiary/20" },
    ],
  },
};

export const analyticsRanges: AnalyticsRange[] = ["30D", "90D", "1Y"];
export const analyticsFunnelSections: AnalyticsFunnelSection[] = ["Acquisition", "Activation", "Retention"];
export const analyticsGridLineKeys = ["grid-1", "grid-2", "grid-3", "grid-4", "grid-5", "grid-6"] as const;

export const analyticsRegions: RegionItem[] = [
  {
    name: "North America",
    percentage: 42.8,
    accent: "bg-primary",
    hotspotClass: "top-[30%] left-[20%]",
    value: "$2.84M",
  },
  {
    name: "Europe (EMEA)",
    percentage: 28.4,
    accent: "bg-secondary",
    hotspotClass: "top-[35%] left-[55%]",
    value: "$1.92M",
  },
  {
    name: "Asia Pacific",
    percentage: 19.1,
    accent: "bg-primary-container",
    hotspotClass: "top-[60%] left-[80%]",
    value: "$1.24M",
  },
];

export const analyticsPages: PageMetric[] = [
  {
    path: "/dashboard/analytics/overview",
    views: "1.2M",
    avgTime: "4m 12s",
    trend: "Strong climb",
    exitRate: "12.4%",
    trendTone: "text-success",
  },
  {
    path: "/settings/integration/api-keys",
    views: "842k",
    avgTime: "2m 45s",
    trend: "Healthy",
    exitRate: "8.9%",
    trendTone: "text-secondary",
  },
  {
    path: "/reports/financial/quarterly",
    views: "651k",
    avgTime: "6m 50s",
    trend: "Growing",
    exitRate: "4.2%",
    trendTone: "text-success",
  },
  {
    path: "/auth/enterprise-login",
    views: "412k",
    avgTime: "0m 45s",
    trend: "High drop",
    exitRate: "42.1%",
    trendTone: "text-error",
  },
];
