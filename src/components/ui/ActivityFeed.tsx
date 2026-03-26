import React from "react";
import { Badge } from "./Badge";
import { Card, CardDescription, CardHeader, CardTitle } from "./Card";

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  status?: "success" | "warning" | "error" | "info";
}

export interface ActivityFeedProps {
  title?: string;
  description?: string;
  items: ActivityItem[];
  className?: string;
  maxHeight?: string;
  footerActionLabel?: string;
  onFooterActionClick?: () => void;
}

export function ActivityFeed({
  title = "Activity Feed",
  description = "Real-time system events and alerts.",
  items,
  className = "",
  maxHeight = "h-120",
  footerActionLabel = "View All Activity",
  onFooterActionClick,
}: ActivityFeedProps): React.JSX.Element {
  return (
    <Card className={`flex flex-col ${maxHeight} ${className}`} padding="none">
      <CardHeader className="surface-header-activity border-b border-outline-variant/10 px-6 py-5">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="mt-1">{description}</CardDescription>
        </div>
      </CardHeader>
      <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="activity-item-shell group rounded-2xl border border-outline-variant/8 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/14 hover:bg-surface-container-high/70"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex gap-4">
              <div className={`activity-item-icon-shell flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/5 ${item.iconBg}`}>
                <span className={`material-symbols-outlined text-xl ${item.iconColor}`}>{item.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="text-sm font-bold tracking-tight text-on-surface">{item.title}</h4>
                  <span className="font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/50">
                    {item.time}
                  </span>
                </div>
                <p className="mt-1 text-sm text-on-surface-variant/80">{item.description}</p>
                {item.status ? (
                  <div className="mt-3">
                    <Badge variant={item.status} size="sm" dot>
                      {item.status}
                    </Badge>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-outline-variant/10 p-4 text-center">
        <button
          type="button"
          className="font-mono-data text-tiny uppercase tracking-label-2xl text-primary transition-colors hover:text-primary-fixed"
          onClick={onFooterActionClick}
        >
          {footerActionLabel}
        </button>
      </div>
    </Card>
  );
}
