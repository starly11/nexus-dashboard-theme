import React from "react";
import { Card } from "./Card";

export interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  iconColor?: string;
  trend?: string;
  trendDirection?: "up" | "down";
  trendColorClass?: string;
  chartPath?: string;
  chartStroke?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  icon,
  iconColor = "text-primary/70",
  trend,
  trendDirection,
  trendColorClass = "text-success",
  chartPath,
  chartStroke = "currentColor",
  className = "",
}: MetricCardProps): React.JSX.Element {
  const trendChipClasses =
    trendDirection === "down"
      ? "border-error/20 bg-error/10 text-error"
      : "border-success/20 bg-success/10 text-success";

  return (
    <Card className={`group relative overflow-hidden rounded-metric ${className}`}>
      <div
        className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-30 blur-3xl transition-opacity duration-300 group-hover:opacity-45"
        style={{ backgroundColor: chartStroke }}
      />
      <div
        className="absolute inset-x-4 top-0 h-[2px] opacity-90 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${chartStroke}, transparent)` }}
      />
      <div className="metric-card-floor absolute inset-x-0 bottom-0 h-16" />
      <div className="mb-5 flex items-start justify-between">
        <span className="inline-flex items-center gap-2 font-mono-data text-tiny uppercase tracking-label-2xl text-on-surface-variant/60">
          <span className="h-2 w-2 rounded-full shadow-[0_0_12px_currentColor]" style={{ backgroundColor: chartStroke }} />
          {title}
        </span>
        <span
          className={`metric-card-icon-shell material-symbols-outlined rounded-2xl border border-white/5 bg-surface-container-highest/85 p-2.5 text-xl transition-transform duration-300 group-hover:-translate-y-0.5 ${iconColor}`}
        >
          {icon}
        </span>
      </div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="font-mono-data text-metric font-black tracking-tight-sm text-on-surface">{value}</h3>
          {trend && trendDirection ? (
            <p
              className={`mt-3 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold shadow-panel ${trendChipClasses} ${trendColorClass}`}
            >
              <span className="material-symbols-outlined mr-1 text-base">
                {trendDirection === "up" ? "trending_up" : "trending_down"}
              </span>
              {trend}
            </p>
          ) : null}
        </div>
        {chartPath ? (
          <div className="metric-card-spark h-12 w-24 rounded-2xl border border-white/5 px-2 py-1.5 transition-transform duration-300 group-hover:translate-x-1">
            <svg className="h-full w-full" viewBox="0 0 100 40">
              <path d={`${chartPath} L 100 40 L 0 40 Z`} fill={chartStroke} opacity="0.14" />
              <path d={chartPath} fill="none" stroke={chartStroke} strokeLinecap="round" strokeWidth="3" />
            </svg>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
