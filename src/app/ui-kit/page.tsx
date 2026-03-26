"use client";

import React, { useMemo, useState } from "react";
import { ChartCard, LineChart } from "@/components/charts/ChartCard";
import { AppLayout } from "@/components/layout/AppLayout";
import { uiKitChartData, uiKitPreviewTimeRanges, uiKitShowcaseRows } from "@/data/ui-kit";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, TableColumn } from "@/components/ui/Table";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { ShowcaseRow } from "@/types/ui-kit";

export default function UiKitPage(): React.JSX.Element {
  const [name, setName] = useState("Alex Rivera");
  const [workspace, setWorkspace] = useState("Growth Workspace");
  const [plan, setPlan] = useState("Scale");
  const [message, setMessage] = useState("Share a clear note with your operators.");

  const columns: TableColumn<ShowcaseRow>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Module",
        render: (value, row) => (
          <div className="flex items-center gap-3">
            <Avatar name={row.owner} size="sm" />
            <div>
              <p className="text-sm font-semibold text-on-surface">{String(value ?? "")}</p>
              <p className="font-mono-data text-tiny text-on-surface-variant/50">{row.id}</p>
            </div>
          </div>
        ),
      },
      {
        key: "owner",
        header: "Owner",
        render: (value) => <span className="text-sm text-on-surface-variant">{String(value ?? "")}</span>,
      },
      {
        key: "status",
        header: "Status",
        render: (_, row) => <StatusBadge status={row.status} />,
      },
      {
        key: "value",
        header: "Value",
        className: "text-right",
        render: (value) => <span className="font-mono-data text-sm text-on-surface">{String(value ?? "")}</span>,
      },
    ],
    []
  );

  return (
    <AppLayout
      title="UI Kit"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "UI Kit" },
      ]}
    >
      <div className="space-y-10 pb-8">
        <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info" dot>
                Design System
              </Badge>
              <Badge variant="success" dot>
                Marketplace-ready preview
              </Badge>
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-tight-sm text-on-surface">UI Kit and Elements</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-on-surface-variant/78 lg:text-base">
              This page gives buyers a single place to inspect the template quality: buttons, badges, avatars, form controls, data
              surfaces, charts, theme switching, and the overall component polish.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
            <Button variant="secondary">
              <span className="material-symbols-outlined text-lg">file_download</span>
              Export Spec
            </Button>
            <Button>
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              Duplicate Section
            </Button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Primary Actions"
            value="12"
            icon="smart_button"
            iconColor="text-primary"
            trend="+4"
            trendDirection="up"
            chartPath="M0 32 L 18 28 L 42 18 L 66 22 L 100 8"
            chartStroke="var(--color-primary)"
          />
          <MetricCard
            title="Status Styles"
            value="05"
            icon="verified"
            iconColor="text-success"
            trend="+2"
            trendDirection="up"
            chartPath="M0 34 L 30 26 L 62 14 L 100 6"
            chartStroke="var(--color-success)"
          />
          <MetricCard
            title="Surface Variants"
            value="09"
            icon="layers"
            iconColor="text-secondary"
            trend="+3"
            trendDirection="up"
            chartPath="M0 28 L 24 30 L 48 18 L 74 20 L 100 10"
            chartStroke="var(--color-secondary)"
          />
          <MetricCard
            title="Interactive States"
            value="18"
            icon="bolt"
            iconColor="text-warning"
            trend="-1"
            trendDirection="down"
            chartPath="M0 10 L 20 16 L 48 22 L 72 28 L 100 34"
            chartStroke="var(--color-warning)"
          />
        </section>

        <section className="grid gap-8 xl:grid-cols-12">
          <Card className="xl:col-span-7" padding="lg">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/48">Buttons and Badges</p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">Action hierarchy</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="tertiary">Tertiary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button disabled>Disabled</Button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge>Default</Badge>
                <Badge variant="success" dot>
                  Success
                </Badge>
                <Badge variant="warning" dot>
                  Warning
                </Badge>
                <Badge variant="error" dot>
                  Error
                </Badge>
                <Badge variant="info" dot>
                  Info
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status="active" />
                <StatusBadge status="inactive" />
                <StatusBadge status="pending" />
                <StatusBadge status="error" />
                <StatusBadge status="invited" />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Avatar name="Alex Rivera" size="sm" />
                <Avatar name="Sarah Chen" size="md" />
                <Avatar name="Aisha Rahman" size="lg" />
              </div>
            </div>
          </Card>

          <Card className="xl:col-span-5" padding="lg">
            <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/48">Theme Switcher</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">Dark and light ready</h3>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant/76">
              Buyers expect theme flexibility. This toggle is persisted in local storage and driven by the same token system as the rest of
              the template.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ThemeToggle />
              <ThemeToggle variant="ghost" showLabel={false} />
            </div>
            <div className="mt-6 rounded-metric border border-outline-variant/12 bg-surface-container-low p-5">
              <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45">Preview Notes</p>
              <ul className="mt-3 space-y-3 text-sm text-on-surface-variant/76">
                <li>Token-driven surfaces and charts</li>
                <li>Persistent theme preference</li>
                <li>Consistent status color mapping</li>
              </ul>
            </div>
          </Card>
        </section>

        <section className="grid gap-8 xl:grid-cols-12">
          <Card className="xl:col-span-5" padding="lg">
            <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/48">Form Controls</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-on-surface">Inputs, selects, and content fields</h3>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-on-surface">Full name</span>
                <input
                  value={name}
                  onChange={(event): void => setName(event.target.value)}
                  className="w-full rounded-xl border border-outline-variant/14 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none transition-all duration-200 focus:border-primary/18 focus:ring-2 focus:ring-primary/18"
                  placeholder="Alex Rivera"
                  aria-label="UI kit full name field"
                  type="text"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-on-surface">Workspace</span>
                <input
                  value={workspace}
                  onChange={(event): void => setWorkspace(event.target.value)}
                  className="w-full rounded-xl border border-outline-variant/14 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none transition-all duration-200 focus:border-secondary/18 focus:ring-2 focus:ring-secondary/18"
                  placeholder="Growth Workspace"
                  aria-label="UI kit workspace field"
                  type="text"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-on-surface">Plan tier</span>
                <select
                  value={plan}
                  onChange={(event): void => setPlan(event.target.value)}
                  className="w-full rounded-xl border border-outline-variant/14 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none transition-all duration-200 focus:border-success/18 focus:ring-2 focus:ring-success/18"
                  aria-label="UI kit plan selection"
                >
                  <option value="Growth">Growth</option>
                  <option value="Scale">Scale</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-on-surface">Team note</span>
                <textarea
                  value={message}
                  onChange={(event): void => setMessage(event.target.value)}
                  className="min-h-28 w-full rounded-xl border border-outline-variant/14 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none transition-all duration-200 focus:border-warning/18 focus:ring-2 focus:ring-warning/18"
                  aria-label="UI kit message field"
                />
              </label>
            </div>
          </Card>

          <div className="space-y-8 xl:col-span-7">
            <ChartCard
              title="Chart Styling"
              description="A compact example of the shared chart treatment used across dashboard and analytics pages."
              timeRange="Preview"
              timeRanges={uiKitPreviewTimeRanges}
              height="h-80"
            >
              <LineChart data={uiKitChartData} color="var(--color-secondary)" />
            </ChartCard>

            <Table
              title="Data Table Styling"
              description="Rows, badges, avatars, spacing, and state colors shown in one place for easier buyer review."
              columns={columns}
              data={uiKitShowcaseRows}
            />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
