"use client";

import Link from "next/link";
import React from "react";
import type { NavItem } from "@/components/layout/navigationConfig";

export interface SidebarNavigationProps {
  items: NavItem[];
  pathname: string | null;
  isCollapsed: boolean;
  navIconAccents: Record<string, { iconClass: string; chipClass: string }>;
}

export function SidebarNavigation({
  items,
  pathname,
  isCollapsed,
  navIconAccents,
}: SidebarNavigationProps): React.JSX.Element {
  return (
    <nav className={`scrollbar-thin flex flex-1 flex-col gap-1 overflow-y-auto py-5 ${isCollapsed ? "px-4" : "px-3"}`}>
      {items.map((item, index) => {
        const isActive = item.active ?? (item.href ? pathname === item.href : false);
        const shouldRenderSectionLabel = item.section && !items.slice(0, index).some((previousItem) => previousItem.section === item.section);
        const sectionMarkup =
          shouldRenderSectionLabel ? (
            <div className={isCollapsed ? "mb-2 mt-6 hidden" : "mb-2 mt-6 px-3"}>
              <span className="font-mono-data text-2xs uppercase tracking-label-4xl text-on-surface-variant/45">{item.section}</span>
            </div>
          ) : null;

        const navContent = (
          <>
            <span
              className={`absolute inset-y-2 left-0 w-1 rounded-full bg-success transition-opacity duration-300 ${
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70"
              }`}
            />
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/5 text-xl transition-all duration-300 ${
                isActive
                  ? "bg-success/14 text-success glow-chip-success"
                  : `${navIconAccents[item.icon]?.chipClass ?? "bg-surface-container-high/70"} ${navIconAccents[item.icon]?.iconClass ?? "text-on-surface-variant"}`
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? "material-symbols-filled" : ""}`}>{item.icon}</span>
            </span>
            <span className={`${isCollapsed ? "hidden" : "block"} truncate font-medium tracking-tight`}>{item.label}</span>
            {!isCollapsed && isActive ? <span className="glow-dot-success ml-auto h-2.5 w-2.5 rounded-full bg-success" /> : null}
          </>
        );

        return (
          <div key={item.label}>
            {sectionMarkup}
            {item.href ? (
              <Link
                href={item.href}
                className={`group relative flex items-center overflow-hidden rounded-xl py-3 text-sm transition-all duration-300 ${
                  isCollapsed ? "justify-center px-0" : "gap-3 px-3"
                } ${
                  isActive
                    ? "surface-nav-active text-on-surface shadow-panel ring-1 ring-success/20"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                {navContent}
              </Link>
            ) : (
              <button
                type="button"
                className={`group relative flex w-full items-center overflow-hidden rounded-xl py-3 text-left text-sm text-on-surface-variant transition-all duration-300 hover:bg-surface-container-high hover:text-on-surface ${
                  isCollapsed ? "justify-center px-0" : "gap-3 px-3"
                }`}
                aria-label={`${item.label} preview navigation`}
              >
                {navContent}
              </button>
            )}
          </div>
        );
      })}
    </nav>
  );
}
