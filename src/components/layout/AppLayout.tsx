"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { DEFAULT_NAV_ITEMS, NAV_ICON_ACCENTS, NavItem } from "@/components/layout/navigationConfig";
import { SidebarNavigation } from "@/components/layout/SidebarNavigation";
import { useSidebarContext } from "@/components/layout/SidebarContext";
import { getFocusableElements } from "@/lib/accessibility";

export interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  navItems?: NavItem[];
  showHeader?: boolean;
}

export function AppLayout({
  children,
  title = "Dashboard",
  breadcrumbs,
  navItems,
  showHeader = true,
}: AppLayoutProps): React.JSX.Element {
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, toggleCollapsed, closeMobile, openMobile } = useSidebarContext();
  const sidebarRef = useRef<HTMLElement>(null);

  const railWidth = "lg:w-60";
  const mainPadding = "lg:pl-60";
  const headerOffset = "lg:left-60";
  const resolvedNavItems = navItems ?? DEFAULT_NAV_ITEMS;

  useEffect(() => {
    if (!isMobileOpen || !sidebarRef.current) {
      return;
    }

    const container = sidebarRef.current;
    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const focusableElements = getFocusableElements(container);

    document.body.style.overflow = "hidden";
    (focusableElements[0] ?? container).focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobile();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const currentFocusableElements = getFocusableElements(container);

      if (currentFocusableElements.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const firstElement = currentFocusableElements[0];
      const lastElement = currentFocusableElements[currentFocusableElements.length - 1];
      const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [closeMobile, isMobileOpen]);

  return (
    <div className="relative flex h-screen min-h-screen overflow-hidden bg-surface sidebar-ready">
      <div className="surface-orb surface-orb-primary -left-20 top-0 h-64 w-64 animate-float-slow" />
      <div className="surface-orb surface-orb-secondary right-0 top-16 h-72 w-72 animate-float-slow" />
      <div className="surface-orb surface-orb-warm bottom-0 left-1/3 h-80 w-80 animate-pulse-soft" />

      <div className="fixed left-0 top-0 z-50 hidden h-16 w-60 items-center border-b border-r border-outline-variant/10 bg-surface-container-low px-4 lg:flex">
        <Link href="/dashboard" className="group flex min-w-0 items-center gap-3 overflow-hidden rounded-xl px-1 py-1.5">
          <div className="glow-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary">
            <span className="material-symbols-outlined material-symbols-filled text-xl">hub</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-black tracking-tight text-on-surface transition-transform duration-300 group-hover:translate-x-0.5">
              Nexus
            </p>
            <p className="truncate font-mono-data text-2xs uppercase tracking-label-2xl text-primary/70">SaaS Admin</p>
          </div>
        </Link>
      </div>

      {isMobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
          aria-label="Close sidebar"
        />
      ) : null}

      <aside
        ref={sidebarRef}
        className={`sidebar fixed inset-y-0 left-0 z-40 flex w-60 transform flex-col overflow-hidden border-r border-t border-outline-variant/10 bg-surface-container-low transition-all duration-300 ease-out lg:top-16 ${railWidth} ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        role={isMobileOpen ? "dialog" : undefined}
        aria-modal={isMobileOpen || undefined}
        aria-label="Workspace navigation"
        tabIndex={isMobileOpen ? -1 : undefined}
      >
        <button
          type="button"
          onClick={toggleCollapsed}
          className="group absolute -right-3 top-5 z-50 hidden h-6 w-6 items-center justify-center rounded-full border border-outline-variant/20 bg-surface-container-high text-on-surface-variant shadow-panel transition-all duration-200 hover:border-primary/25 hover:bg-surface-container-highest hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 lg:inline-flex"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="material-symbols-outlined text-sm">{isCollapsed ? "chevron_right" : "chevron_left"}</span>
          <span className="pointer-events-none absolute right-full mr-2 rounded-full bg-surface-container-high px-2 py-1 font-mono-data text-3xs uppercase tracking-label-md text-on-surface opacity-0 transition-all duration-200 group-hover:opacity-100">
            {isCollapsed ? "Expand" : "Collapse"}
          </span>
        </button>

        <SidebarNavigation items={resolvedNavItems} pathname={pathname} isCollapsed={isCollapsed} navIconAccents={NAV_ICON_ACCENTS} />

        <div className={`pb-3 ${isCollapsed ? "px-4" : "px-3"}`}>
          <button
            type="button"
            className={`nocturnal-glass flex w-full items-center justify-center rounded-2xl py-3 text-sm font-semibold text-on-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:text-primary ${
              isCollapsed ? "px-0" : "gap-2 px-4"
            }`}
          >
            <span className="material-symbols-outlined text-secondary">auto_awesome</span>
            <span className={isCollapsed ? "hidden" : "inline"}>Launch Quick Action</span>
          </button>
        </div>
      </aside>

      <main className={`main-content flex flex-1 flex-col overflow-hidden ${mainPadding}`}>
        {showHeader ? <AppHeader breadcrumbs={breadcrumbs} headerOffsetClassName={headerOffset} onOpenMobile={openMobile} /> : null}

        <section
          aria-label={title}
          className={`${showHeader ? "mt-16 h-[calc(100vh-64px)]" : "h-screen"} scrollbar-thin overflow-y-auto bg-transparent px-4 py-4 lg:px-6`}
        >
          {children}
        </section>
      </main>
    </div>
  );
}
