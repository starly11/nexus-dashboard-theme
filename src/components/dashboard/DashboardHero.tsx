"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

export interface DashboardHeroProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  healthyServices: number;
  warningServices: number;
}

export function DashboardHero({
  searchQuery,
  onSearchQueryChange,
  healthyServices,
  warningServices,
}: DashboardHeroProps): React.JSX.Element {
  return (
    <section className="nocturnal-glass relative overflow-hidden rounded-panel border border-outline-variant/10 px-6 py-6 lg:px-8">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-primary/10 via-secondary/5 to-transparent lg:block" />
      <div className="surface-orb surface-orb-success bottom-0 right-20 h-48 w-48 animate-float-slow" />
      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/14 bg-primary/10 px-3 py-2 text-primary">
              <span className="glow-dot-primary h-2 w-2 rounded-full bg-primary" />
              <span className="font-mono-data text-2xs uppercase tracking-label-2xl">Live Dashboard</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-success/18 bg-success-soft px-3 py-2 text-success">
              <span className="glow-dot-success h-2 w-2 rounded-full bg-success" />
              <span className="font-mono-data text-2xs uppercase tracking-label-xl">{healthyServices} Growth Signals</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-warning/18 bg-warning-soft px-3 py-2 text-warning">
              <span className="glow-dot-warning h-2 w-2 rounded-full bg-warning" />
              <span className="font-mono-data text-2xs uppercase tracking-label-xl">{warningServices} Items Need Review</span>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight-sm text-on-surface lg:text-5xl">
              Command your <span className="text-gradient-primary">data</span> in{" "}
              <span className="text-secondary">depth</span>, <span className="text-success">growth</span>, and{" "}
              <span className="text-warning">action</span>.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-on-surface-variant/80 lg:text-base">
              This home view leans into the Stitch direction with stronger success and error contrast, bolder icon color, richer
              panel tones, and clearer visual separation between revenue, users, alerts, and transaction health.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-2 text-on-surface">
                <span className="glow-dot-warning h-2 w-2 rounded-full bg-warning" />
                Revenue layers glow with <span className="text-warning">signal amber</span>
              </span>
              <span className="inline-flex items-center gap-2 text-on-surface">
                <span className="glow-dot-success h-2 w-2 rounded-full bg-success" />
                Live health is tracked in <span className="text-success">success green</span>
              </span>
              <span className="inline-flex items-center gap-2 text-on-surface">
                <span className="glow-dot-error h-2 w-2 rounded-full bg-error" />
                Risk signals now surface in <span className="text-error">warning red</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 xl:max-w-xl">
          <label className="relative block">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              className="w-full rounded-2xl border border-outline-variant/15 bg-surface-container-lowest py-3 pl-12 pr-4 text-sm text-on-surface outline-none transition-all duration-300 placeholder:text-on-surface-variant/35 focus:border-primary/30 focus:ring-2 focus:ring-primary/15"
              placeholder="Search transactions, alerts, or customer names..."
              aria-label="Search dashboard content"
              type="text"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">
              <span className="material-symbols-outlined text-lg">add_chart</span>
              Build New Report
            </Button>
            <Button variant="secondary">
              <span className="material-symbols-outlined text-lg">tune</span>
              Configure Widgets
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
