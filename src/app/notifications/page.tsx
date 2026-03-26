"use client";

import React, { useDeferredValue, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { initialNotifications, notificationFilters } from "@/data/notifications";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { NotificationFilter, NotificationRecord } from "@/types/notifications";

export default function NotificationsPage(): React.JSX.Element {
  const [notifications, setNotifications] = useState<NotificationRecord[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredNotifications = useMemo(() => {
    const normalizedQuery = deferredSearchQuery.trim().toLowerCase();

    return notifications.filter((notification) => {
      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Unread" && !notification.read) ||
        (activeFilter === "Mentions" && notification.kind === "mention") ||
        (activeFilter === "System" && notification.kind === "system");

      const matchesSearch =
        normalizedQuery.length === 0 ||
        [notification.title, notification.description, notification.kind].some((value) =>
          value.toLowerCase().includes(normalizedQuery)
        );

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, deferredSearchQuery, notifications]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const mentionCount = notifications.filter((notification) => notification.kind === "mention" && !notification.read).length;
  const systemCount = notifications.filter((notification) => notification.kind === "system").length;

  const markAllAsRead = (): void => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const clearAll = (): void => {
    setNotifications([]);
  };

  const toggleReadState = (id: string): void => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: !notification.read } : notification
      )
    );
  };

  const counts: Record<NotificationFilter, number> = {
    All: notifications.length,
    Unread: unreadCount,
    Mentions: mentionCount,
    System: systemCount,
  };

  return (
    <AppLayout
      title="Notifications"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Notifications" },
      ]}
    >
      <div className="space-y-10 pb-8">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tight-sm text-on-surface">Notifications</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-on-surface-variant/75">
              Stay updated with real-time activity, system health reports, and direct mentions from your team.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="ghost" onClick={markAllAsRead}>
              <span className="material-symbols-outlined text-lg text-primary">done_all</span>
              Mark all as read
            </Button>
            <Button variant="ghost" onClick={clearAll}>
              <span className="material-symbols-outlined text-lg text-error">delete_sweep</span>
              Clear all
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-3">
            <Card className="bg-surface-container-low" padding="sm">
              <nav className="space-y-1">
                {notificationFilters.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors ${
                      activeFilter === filter.id
                        ? "bg-surface-container-high text-primary"
                        : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                    }`}
                    aria-label={`Show ${filter.id.toLowerCase()} notifications`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-xl">{filter.icon}</span>
                      {filter.id}
                    </span>
                    {counts[filter.id] > 0 ? (
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono-data text-tiny ${
                          activeFilter === filter.id
                            ? "bg-primary/20 text-primary"
                            : "bg-surface-container-highest text-on-surface-variant"
                        }`}
                      >
                        {String(counts[filter.id]).padStart(2, "0")}
                      </span>
                    ) : null}
                  </button>
                ))}
              </nav>
            </Card>

            <Card className="bg-surface-container-low" padding="lg">
              <h3 className="mb-4 font-mono-data text-xs uppercase tracking-label-xl text-on-surface-variant/50">Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface-variant">Response Rate</span>
                  <span className="font-mono-data text-sm text-secondary">92%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
                  <div className="h-full w-[92%] bg-secondary" />
                </div>
                <p className="text-tiny italic leading-relaxed text-on-surface-variant/60">
                  You are currently 15% faster at responding than last week.
                </p>
              </div>
            </Card>
          </div>

          <div className="space-y-4 lg:col-span-9">
            <label className="relative block max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant/40">search</span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-2xl bg-surface-container-lowest px-10 py-2.5 text-sm text-on-surface outline-none ring-1 ring-outline-variant/10 transition-all placeholder:text-on-surface-variant/35 focus:ring-primary/35"
                placeholder="Search notifications..."
                type="text"
                aria-label="Search notifications"
              />
            </label>

            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => toggleReadState(notification.id)}
                  className={`group relative flex w-full gap-4 rounded-2xl border p-5 text-left transition-all ${
                    notification.read
                      ? "border-outline-variant/5 bg-surface-container/40 grayscale-[0.2] hover:bg-surface-container-high/50"
                      : "border-transparent bg-surface-container hover:border-outline-variant/10 hover:bg-surface-container-high"
                  }`}
                >
                  {!notification.read ? (
                    <div className={`absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full ${notification.dotClass}`} />
                  ) : null}
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${notification.iconWrapperClass}`}>
                    <span className={`material-symbols-outlined ${notification.iconClass}`}>{notification.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-4">
                      <h4 className="text-sm font-bold text-on-surface">
                        {notification.title}
                      </h4>
                      <span className="font-mono-data text-tiny text-on-surface-variant/50">{notification.timeAgo}</span>
                    </div>
                    <p className="truncate text-sm text-on-surface-variant/80">{notification.description}</p>
                  </div>
                  {!notification.read ? <span className={`mt-4 h-2 w-2 rounded-full ${notification.dotClass} shadow-[0_0_10px_currentColor]`} /> : null}
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="relative mb-8">
                  <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface-container-high blur-3xl opacity-50" />
                  <span className="relative z-10 material-symbols-outlined text-6xl text-outline-variant/30">notifications_off</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-on-surface">Zero distractions</h3>
                <p className="mx-auto max-w-xs text-sm text-on-surface-variant">
                  You&apos;ve cleared all your notifications. Take a moment to breathe or check back later.
                </p>
              </div>
            )}

            <div className="pt-8 text-center">
              <button
                type="button"
                className="rounded-full border border-outline-variant/10 bg-surface-container-low px-8 py-3 text-sm font-medium text-on-surface-variant transition-all hover:border-primary/40 hover:text-primary"
                aria-label="Show notifications from the past 30 days"
              >
                Show past 30 days
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
