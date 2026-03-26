"use client";

import Link from "next/link";
import React from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { PRODUCT } from "@/config/product";

export interface AppHeaderProps {
  breadcrumbs?: Array<{ label: string; href?: string }>;
  headerOffsetClassName: string;
  onOpenMobile: () => void;
}

export function AppHeader({
  breadcrumbs,
  headerOffsetClassName,
  onOpenMobile,
}: AppHeaderProps): React.JSX.Element {
  return (
    <header
      className={`fixed left-0 right-0 z-20 flex h-16 items-center justify-between border-b border-outline-variant/10 bg-surface/90 px-4 backdrop-blur-xl ${headerOffsetClassName} lg:px-6`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-high text-on-surface transition-all duration-200 hover:bg-surface-container-highest lg:hidden"
          onClick={onOpenMobile}
          aria-label="Open sidebar"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        {breadcrumbs ? (
          <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, index) => (
              <div key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {index > 0 ? <span className="text-on-surface-variant/60">/</span> : null}
                {crumb.href ? (
                  <Link href={crumb.href} className="text-on-surface-variant transition-colors hover:text-on-surface">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-on-surface font-medium">{crumb.label}</span>
                )}
              </div>
            ))}
          </nav>
        ) : (
          <div />
        )}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle showLabel={false} />
        <button
          type="button"
          className="rounded-xl p-2 text-secondary/80 transition-colors hover:bg-surface-container-high hover:text-secondary"
          aria-label="Search workspace"
        >
          <span className="material-symbols-outlined">search</span>
        </button>
        <button
          type="button"
          className="rounded-xl p-2 text-warning/80 transition-colors hover:bg-surface-container-high hover:text-warning"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="h-8 w-px bg-outline-variant/40" />
        <Link
          href="/profile"
          className="group flex items-center gap-3 rounded-full bg-surface-container-low px-1 py-1 pr-2 transition-all duration-300 hover:bg-surface-container-high"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-surface-bright to-surface-container-highest text-2xs font-bold text-primary">
            {PRODUCT.demoUser.initials}
          </div>
          <span className="hidden text-sm font-medium text-on-surface sm:inline">{PRODUCT.demoUser.name}</span>
          <span className="material-symbols-outlined text-primary/75 transition-transform duration-300 group-hover:translate-y-0.5">
            expand_more
          </span>
        </Link>
      </div>
    </header>
  );
}
