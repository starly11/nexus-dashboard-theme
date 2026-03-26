"use client";

import React, { useMemo, useState } from "react";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { DashboardQuickActions } from "@/components/dashboard/DashboardQuickActions";
import { DASHBOARD_TIME_RANGES, QUICK_ACTIONS, RANGE_DATA } from "@/components/dashboard/dashboardHomeConfig";
import { ChartCard, LineChart } from "@/components/charts/ChartCard";
import { ActivityFeed } from "@/components/ui/ActivityFeed";
import { MetricCard } from "@/components/ui/MetricCard";
import { TransactionTable } from "@/components/ui/TransactionTable";
import { Card } from "@/components/ui/Card";
import type { DashboardActivityItem, DashboardKpi, DashboardTransaction } from "@/types/dashboard";

export type KpiCard = DashboardKpi;
export type ActivityItem = DashboardActivityItem;
export type TransactionItem = DashboardTransaction;

export interface DashboardHomeProps {
  kpis: KpiCard[];
  activity: ActivityItem[];
  transactions: TransactionItem[];
}

type DashboardTimeRange = keyof typeof RANGE_DATA;

function isDashboardTimeRange(value: string): value is DashboardTimeRange {
  return value in RANGE_DATA;
}

export function DashboardHome({ kpis, activity, transactions }: DashboardHomeProps): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState<DashboardTimeRange>("Last 30 Days");
  const [selectedAction, setSelectedAction] = useState(QUICK_ACTIONS[0].label);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredActivity = useMemo(
    () =>
      activity.filter((item) =>
        [item.title, item.description, item.time].some((value) => value.toLowerCase().includes(normalizedQuery))
      ),
    [activity, normalizedQuery]
  );

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((item) =>
        [item.customer, item.id, item.amount, item.status].some((value) => value.toLowerCase().includes(normalizedQuery))
      ),
    [transactions, normalizedQuery]
  );

  const healthyServices = kpis.filter((item) => item.trendDirection === "up").length;
  const warningServices = activity.filter((item) => item.status === "warning" || item.status === "error").length;
  const selectedActionConfig = QUICK_ACTIONS.find((action) => action.label === selectedAction) ?? QUICK_ACTIONS[0];

  return (
    <div className="space-y-8 pb-8">
      <DashboardHero
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        healthyServices={healthyServices}
        warningServices={warningServices}
      />

      <DashboardQuickActions actions={QUICK_ACTIONS} selectedAction={selectedAction} onSelectAction={setSelectedAction} />

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((card) => (
          <MetricCard key={card.title} {...card} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="xl:col-span-9">
          <ChartCard
            title="Revenue Over Time"
            description="Comprehensive view of growth momentum, recurring revenue, and acceleration zones."
            timeRange={timeRange}
            onTimeRangeChange={(range) => {
              if (isDashboardTimeRange(range)) {
                setTimeRange(range);
              }
            }}
            timeRanges={DASHBOARD_TIME_RANGES}
            height="h-110"
          >
            <LineChart data={RANGE_DATA[timeRange]} color="var(--color-secondary)" />
          </ChartCard>
        </div>

        <div className="space-y-6 xl:col-span-3">
          <Card className="overflow-hidden" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono-data text-2xs uppercase tracking-label-3xl text-on-surface-variant/50">Selected Flow</p>
                <h3 className="mt-2 text-2xl font-black tracking-tight-sm text-on-surface">{selectedAction}</h3>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 ${selectedActionConfig.iconShellClass} ${selectedActionConfig.accent}`}>
                <span className="material-symbols-outlined">{selectedActionConfig.icon}</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="surface-fill-success-panel rounded-2xl border border-success/12 p-4">
                <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45">Completion</p>
                <p className="mt-2 font-mono-data text-2xl font-bold text-success">94%</p>
              </div>
              <div className="surface-fill-info-panel rounded-2xl border border-secondary/12 p-4">
                <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45">Avg. Time</p>
                <p className="mt-2 font-mono-data text-2xl font-bold text-secondary">12m</p>
              </div>
            </div>
          </Card>
          <ActivityFeed items={filteredActivity} maxHeight="h-112.5" />
        </div>
      </section>

      {filteredTransactions.length > 0 ? (
        <TransactionTable transactions={filteredTransactions} />
      ) : (
        <Card className="p-8 text-center">
          <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45">Empty State</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-on-surface">No transactions match that search.</h3>
          <p className="mt-2 text-sm text-on-surface-variant/70">Try a customer name, status, transaction code, or clear the dashboard query.</p>
          <div className="mt-5">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-outline-variant/20 px-4 py-2.5 text-sm font-semibold text-on-surface transition-all duration-300 hover:border-secondary/20 hover:text-secondary"
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
