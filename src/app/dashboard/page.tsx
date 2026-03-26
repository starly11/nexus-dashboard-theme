import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { AppLayout } from "@/components/layout/AppLayout";
import { dashboardActivity, dashboardKpis, dashboardTransactions } from "@/data/dashboard";

export default function DashboardPage(): React.JSX.Element {
  return (
    <AppLayout title="Dashboard">
      <DashboardHome kpis={dashboardKpis} activity={dashboardActivity} transactions={dashboardTransactions} />
    </AppLayout>
  );
}
