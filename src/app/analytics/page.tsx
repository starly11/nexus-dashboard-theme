"use client";

import React, { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  analyticsFunnels,
  analyticsFunnelSections,
  analyticsGridLineKeys,
  analyticsPages,
  analyticsRangeConfig,
  analyticsRanges,
  analyticsRegions,
} from "@/data/analytics";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, TableColumn } from "@/components/ui/Table";
import type { AnalyticsRange, PageMetric, RegionItem } from "@/types/analytics";

export default function AnalyticsPage(): React.JSX.Element {
  const [timeRange, setTimeRange] = useState<AnalyticsRange>("30D");
  const [compareEnabled, setCompareEnabled] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<RegionItem>(analyticsRegions[0]);
  const [selectedPagePath, setSelectedPagePath] = useState<string>(analyticsPages[0].path);

  const rangeConfig = analyticsRangeConfig[timeRange];
  const selectedPageMetric =
    analyticsPages.find((page) => page.path === selectedPagePath) ?? analyticsPages[0];

  const tableColumns: TableColumn<PageMetric>[] = useMemo(
    () => [
      {
        key: "path",
        header: "Page Path",
        render: (value) => <span className="text-sm font-medium tracking-tight">{String(value ?? "")}</span>,
      },
      {
        key: "views",
        header: "Views (24h)",
        render: (value) => <span className="font-mono-data text-sm">{String(value ?? "")}</span>,
      },
      {
        key: "avgTime",
        header: "Avg Time",
        render: (value) => <span className="font-mono-data text-sm">{String(value ?? "")}</span>,
      },
      {
        key: "trend",
        header: "Trend",
        render: (value, row) => <span className={`font-semibold ${row.trendTone}`}>{String(value ?? "")}</span>,
      },
      {
        key: "exitRate",
        header: "Exit Rate",
        render: (value, row) => (
          <span
            className={`font-mono-data text-sm ${
              row.exitRate === "42.1%" ? "text-error" : "text-on-surface-variant"
            }`}
          >
            {String(value ?? "")}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <AppLayout
      title="Analytics"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Analytics" },
      ]}
    >
      <div className="space-y-8 pb-8">
        <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info" dot>
                Performance Command
              </Badge>
              <Badge variant="success" dot>
                {rangeConfig.compareLabel} vs baseline
              </Badge>
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-tight-sm text-on-surface">Analytics depth, with actual interactions.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-on-surface-variant/75 lg:text-base">
              This screen now behaves like a proper premium template page: range controls work, comparison mode toggles, region cards
              highlight the map, and the visual hierarchy uses stronger Stitch-style accent color instead of flat monochrome surfaces.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-2xl border border-outline-variant/10 bg-surface-container-low p-1">
              {analyticsRanges.map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "primary" : "ghost"}
                  size="sm"
                  className={`h-10 px-4 ${timeRange === range ? "bg-surface-container-high text-primary shadow-none" : ""}`}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </Button>
              ))}
            </div>
            <Button variant={compareEnabled ? "secondary" : "ghost"} onClick={() => setCompareEnabled((value) => !value)}>
              <span className="material-symbols-outlined text-lg">compare_arrows</span>
              {compareEnabled ? "Comparing" : "Compare Disabled"}
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          <Card className="overflow-hidden xl:col-span-8" padding="none">
            <div className="border-b border-outline-variant/10 bg-surface-container-low/40 px-6 py-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-on-surface">DAU / MAU Engagement Trends</h3>
                  <p className="mt-1 text-sm text-on-surface-variant/70">Daily active users, monthly active users, and momentum signatures.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-surface-container-low px-4 py-3">
                    <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45">DAU</p>
                    <p className="mt-2 font-mono-data text-2xl font-bold text-primary">{rangeConfig.dau}</p>
                  </div>
                  <div className="rounded-2xl bg-surface-container-low px-4 py-3">
                    <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45">MAU</p>
                    <p className="mt-2 font-mono-data text-2xl font-bold text-secondary">{rangeConfig.mau}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-90 overflow-hidden p-6">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/6 via-transparent to-transparent" />
              <div className="absolute inset-0 grid grid-cols-6 opacity-10">
                {analyticsGridLineKeys.map((lineKey) => (
                  <div key={lineKey} className="border-r border-outline-variant" />
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-primary/10 to-transparent" />
              <svg className="relative z-10 h-full w-full text-primary" preserveAspectRatio="none" viewBox="0 0 1000 100">
                <path d={`${rangeConfig.chartPath} L1000,100 L0,100 Z`} fill="var(--color-primary-fixed)" fillOpacity="0.16" />
                <path d={rangeConfig.chartPath} fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
              </svg>
              <svg className="absolute inset-0 z-10 h-full w-full text-secondary/50" preserveAspectRatio="none" viewBox="0 0 1000 100">
                <path
                  d="M0,92 Q150,48 300,72 T550,52 T750,80 T1000,40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="absolute left-6 top-6 flex flex-col gap-10 font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/50">
                <span>100k</span>
                <span>75k</span>
                <span>50k</span>
                <span>25k</span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <p className="max-w-sm text-sm text-on-surface-variant/75">{rangeConfig.trend}</p>
                {compareEnabled ? (
                  <div className="rounded-2xl bg-surface-container-high px-4 py-3 text-right">
                    <p className="font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/50">Compare Mode</p>
                    <p className="mt-2 font-mono-data text-xl font-bold text-success">{rangeConfig.compareLabel}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </Card>

          <div className="space-y-4 xl:col-span-4">
            {analyticsFunnelSections.map((section) => (
              <Card key={section} padding="lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono-data text-tiny uppercase tracking-label-2xl text-primary">{section}</h4>
                  <span className={`font-mono-data text-xs ${section === "Retention" ? "text-error" : "text-secondary"}`}>
                    {section === "Retention" ? "-2.1%" : "+8.4%"}
                  </span>
                </div>
                <div className="mt-5 space-y-3">
                  {analyticsFunnels[timeRange][section].map((metric) => (
                    <div key={metric.label} className="relative overflow-hidden rounded-xl bg-surface-container-high px-4 py-3">
                      <div className={`absolute inset-y-0 left-0 ${metric.fillClass}`} style={{ width: metric.width }} />
                      <div className="relative z-10 flex items-center justify-between gap-4">
                        <span className="text-xs font-semibold uppercase tracking-tight text-on-surface">{metric.label}</span>
                        <span className="font-mono-data text-sm text-on-surface">{metric.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          <Card className="overflow-hidden xl:col-span-7" padding="none">
            <div className="flex items-center justify-between border-b border-outline-variant/10 px-6 py-5">
              <div>
                <h4 className="text-lg font-bold tracking-tight text-on-surface">Regional Traffic Density</h4>
                <p className="mt-1 text-sm text-on-surface-variant/70">Click a region to spotlight its contribution and hotspot.</p>
              </div>
              <Badge variant="info" dot>
                Interactive Map
              </Badge>
            </div>
            <div className="relative h-105 overflow-hidden bg-surface-container-low">
              <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low to-surface-container-high" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined mb-4 text-7xl text-primary/20">public</span>
                  <p className="font-mono-data text-sm uppercase tracking-label-4xl text-on-surface-variant/55">World Map Visualization</p>
                </div>
              </div>
              {analyticsRegions.map((region) => {
                const isActive = selectedRegion.name === region.name;

                return (
                  <button
                    key={region.name}
                    type="button"
                    onClick={() => setSelectedRegion(region)}
                    className={`absolute ${region.hotspotClass} flex items-center justify-center rounded-full transition-all duration-300 ${
                      isActive ? "h-20 w-20 bg-primary/20" : "h-12 w-12 bg-primary/10"
                    }`}
                    aria-label={`Focus ${region.name}`}
                  >
                    <span className={`rounded-full ${region.accent} ${isActive ? "h-5 w-5" : "h-3 w-3"}`} />
                  </button>
                );
              })}
            </div>
          </Card>

          <div className="space-y-6 xl:col-span-5">
            <Card padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45">Selected Region</p>
                  <h4 className="mt-2 text-2xl font-black tracking-tight-sm text-on-surface">{selectedRegion.name}</h4>
                </div>
                <div className="rounded-2xl bg-primary/12 px-4 py-3">
                  <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45">Revenue</p>
                  <p className="mt-2 font-mono-data text-xl font-bold text-primary">{selectedRegion.value}</p>
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <h4 className="font-mono-data text-tiny uppercase tracking-label-2xl text-on-surface-variant/60">Top Regions</h4>
              <div className="mt-6 space-y-5">
                {analyticsRegions.map((region) => {
                  const isActive = selectedRegion.name === region.name;

                  return (
                    <button
                      key={region.name}
                      type="button"
                      onClick={() => setSelectedRegion(region)}
                      className={`w-full rounded-2xl p-3 text-left transition-all duration-300 ${
                        isActive ? "bg-surface-container-high" : "hover:bg-surface-container-low"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono-data uppercase tracking-label-lg">
                        <span>{region.name}</span>
                        <span>{region.percentage}%</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-container-high">
                        <div className={`h-full ${region.accent}`} style={{ width: `${region.percentage}%` }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            <div className="nocturnal-glass flex items-center gap-5 rounded-3xl p-6">
              <div className="rounded-2xl bg-primary/12 p-4 text-primary">
                <span className="material-symbols-outlined text-3xl">travel_explore</span>
              </div>
              <div>
                <p className="font-mono-data text-2xs uppercase tracking-label-4xl text-on-surface-variant/50">Active Territories</p>
                <h5 className="mt-2 font-mono-data text-4xl font-black tracking-tight-sm text-on-surface">184</h5>
              </div>
            </div>
          </div>
        </section>

        <Table
          title="Content Performance: Top Pages"
          description="Dummy data, but now styled and interactive enough to feel like a sellable analytics template."
          columns={tableColumns}
          data={analyticsPages}
          actions={
            <Button variant="secondary" size="sm">
              <span className="material-symbols-outlined text-lg">download</span>
              Download CSV
            </Button>
          }
          onRowClick={(item) => setSelectedPagePath(item.path)}
          footer={
            <div className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-mono-data text-2xs uppercase tracking-label-lg text-on-surface-variant/50">
                Selected page
              </span>
              <div className="text-right">
                <p className="text-sm font-semibold text-on-surface">{selectedPageMetric.path}</p>
                <p className={`mt-1 font-mono-data text-tiny ${selectedPageMetric.trendTone}`}>
                  {selectedPageMetric.trend} • Exit {selectedPageMetric.exitRate}
                </p>
              </div>
            </div>
          }
        />
      </div>
    </AppLayout>
  );
}
