export interface DashboardKpi {
  title: string;
  value: string;
  icon: string;
  iconColor: string;
  trend: string;
  trendDirection: "up" | "down";
  trendColorClass: string;
  chartPath: string;
  chartStroke: string;
}

export interface DashboardActivityItem {
  id: string;
  title: string;
  time: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  status?: "success" | "warning" | "error" | "info";
}

export interface DashboardTransaction {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
  initials?: string;
}
