"use client";

import React from "react";

export interface DashboardQuickAction {
  label: string;
  icon: string;
  accent: string;
  panelClass: string;
  iconShellClass: string;
  metricClass: string;
  description: string;
}

export interface DashboardQuickActionsProps {
  actions: DashboardQuickAction[];
  selectedAction: string;
  onSelectAction: (label: string) => void;
}

export function DashboardQuickActions({
  actions,
  selectedAction,
  onSelectAction,
}: DashboardQuickActionsProps): React.JSX.Element {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {actions.map((action) => {
        const isActive = selectedAction === action.label;

        return (
          <button
            key={action.label}
            type="button"
            onClick={() => onSelectAction(action.label)}
            className={`stitch-panel group rounded-3xl p-5 text-left transition-all duration-300 ${
              isActive ? `${action.panelClass} bg-surface-container-high shadow-panel` : "hover:-translate-y-0.5"
            }`}
            aria-pressed={isActive}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono-data text-2xs uppercase tracking-label-3xl text-on-surface-variant/45">Quick Action</p>
                <h3 className="mt-2 text-lg font-bold tracking-tight text-on-surface">{action.label}</h3>
                <p className="mt-2 text-sm text-on-surface-variant/75">{action.description}</p>
              </div>
              <span
                className={`metric-card-icon-shell material-symbols-outlined rounded-2xl border border-white/5 p-3 text-2xl transition-transform duration-300 group-hover:-translate-y-1 ${action.iconShellClass} ${action.accent}`}
              >
                {action.icon}
              </span>
            </div>
          </button>
        );
      })}
    </section>
  );
}
