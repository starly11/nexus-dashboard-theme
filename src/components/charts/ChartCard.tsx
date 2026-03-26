import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

const CHART_GRID_LINE_KEYS = ["line-1", "line-2", "line-3", "line-4", "line-5"] as const;
const DEFAULT_TIME_RANGES = ["Last 30 Days", "90D", "1Y"];
const CHART_LABELS = ["Jun 15", "Jun 22", "Jun 29", "Jul 06", "Jul 13"] as const;

export interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  timeRanges?: string[];
  className?: string;
  height?: string;
}

export function ChartCard({
  title,
  description,
  children,
  timeRange = "Last 30 Days",
  onTimeRangeChange,
  timeRanges = DEFAULT_TIME_RANGES,
  className = "",
  height = "h-105",
}: ChartCardProps): React.JSX.Element {
  return (
    <Card className={`overflow-hidden ${className}`} padding="none">
      <CardHeader className="surface-header-brand border-b border-outline-variant/10 px-6 py-5">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
        </div>
        {timeRanges.length > 0 ? (
          <div className="flex items-center gap-1 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-1">
            {timeRanges.map((range) => (
              <Button
                key={range}
                variant={range === timeRange ? "primary" : "ghost"}
                size="sm"
                className={`h-9 rounded-lg px-3 text-tiny font-bold ${
                  range === timeRange
                    ? "bg-secondary/12 text-secondary shadow-none ring-1 ring-secondary/18"
                    : "bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
                onClick={() => onTimeRangeChange?.(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        ) : null}
      </CardHeader>
      <div className={`relative overflow-hidden px-6 pb-3 pt-4 ${height}`}>
        <div className="surface-hero-feature pointer-events-none absolute inset-0" />
        {children}
      </div>
    </Card>
  );
}

export interface LineChartDatum {
  x: number;
  y: number;
}

export interface LineChartProps {
  data: LineChartDatum[];
  color?: string;
  gradient?: boolean;
  className?: string;
}

export function LineChart({
  data,
  color = "var(--color-primary)",
  gradient = true,
  className = "",
}: LineChartProps): React.JSX.Element {
  const safeData = data.length > 1 ? data : [{ x: 0, y: 0 }, { x: 1, y: 0 }];
  const minX = Math.min(...safeData.map((datum) => datum.x));
  const maxX = Math.max(...safeData.map((datum) => datum.x));
  const minY = Math.min(...safeData.map((datum) => datum.y));
  const maxY = Math.max(...safeData.map((datum) => datum.y));
  const xSpan = maxX - minX || 1;
  const ySpan = maxY - minY || 1;
  const chartTop = 18;
  const chartBottom = 246;
  const chartLeft = 34;
  const chartRight = 942;

  const scaleX = (x: number): number => ((x - minX) / xSpan) * (chartRight - chartLeft) + chartLeft;
  const scaleY = (y: number): number => chartBottom - ((y - minY) / ySpan) * (chartBottom - chartTop);

  const pathData = safeData
    .map((point, index) => `${index === 0 ? "M" : "L"} ${scaleX(point.x)} ${scaleY(point.y)}`)
    .join(" ");
  const areaPathData = `${pathData} L ${chartRight} 264 L ${chartLeft} 264 Z`;
  const lastPoint = safeData[safeData.length - 1];
  const glowFilter = gradient ? "url(#chartGlow)" : undefined;

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/8 via-secondary/5 to-transparent" />
      <div className="absolute inset-x-4 bottom-8 top-2 flex flex-col justify-between border-b border-l border-outline-variant/12">
        {CHART_GRID_LINE_KEYS.map((lineKey) => (
          <div key={lineKey} className="h-0 w-full border-t border-outline-variant/12" />
        ))}
      </div>

      <svg className="relative z-10 h-[calc(100%-1.4rem)] w-full" preserveAspectRatio="none" viewBox="0 0 1000 272">
        {gradient ? (
          <defs>
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity="0.48" />
              <stop offset="95%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
            <filter id="chartGlow">
              <feGaussianBlur result="blur" stdDeviation="6" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        ) : null}

        {gradient ? <path d={areaPathData} fill="url(#chartGradient)" /> : null}

        <path d={pathData} fill="none" filter={glowFilter} opacity="0.32" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" />
        <path d={pathData} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.5" />

        {safeData.map((point, index) => (
          <circle
            key={`${point.x}-${point.y}-${index}`}
            cx={scaleX(point.x)}
            cy={scaleY(point.y)}
            fill={color}
            opacity={index === safeData.length - 1 ? 1 : 0.45}
            r={index === safeData.length - 1 ? 5.5 : 3}
          />
        ))}

        <circle className="animate-pulse" cx={scaleX(lastPoint.x)} cy={scaleY(lastPoint.y)} fill={color} opacity="0.2" r="14" />
      </svg>

      <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/55">
        {CHART_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
