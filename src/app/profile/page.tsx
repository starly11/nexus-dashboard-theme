"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  defaultTwoFactorEnabled,
  initialLinkedAccounts,
  initialSessions,
  profileAboutDetails,
  profileAboutSummary,
  profileExpertise,
  profilePreferenceCards,
  recentActivity,
} from "@/data/profile";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PRODUCT } from "@/config/product";
import type { LinkedAccount } from "@/types/profile";

export default function ProfilePage(): React.JSX.Element {
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>(initialLinkedAccounts);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(defaultTwoFactorEnabled);

  const toggleLinkedAccount = (id: string): void => {
    setLinkedAccounts((currentAccounts) =>
      currentAccounts.map((account) =>
        account.id === id ? { ...account, connected: !account.connected } : account
      )
    );
  };

  return (
    <AppLayout
      title="Profile"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Profile" },
      ]}
    >
      <div className="-mx-4 -mt-4 pb-8 lg:-mx-6">
        <section className="relative">
          <div className="relative h-64 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-container-high to-primary/20 opacity-90" />
            <div className="surface-orb surface-orb-primary left-1/4 top-6 h-48 w-48 opacity-80" />
            <div className="surface-orb surface-orb-secondary right-12 top-10 h-40 w-40 opacity-80" />
          </div>

          <div className="relative z-10 mx-auto -mt-20 flex max-w-6xl flex-col gap-6 px-6 pb-8 md:flex-row md:items-end lg:px-10">
            <button
              type="button"
              className="group relative"
              aria-label="Change profile photo"
            >
              <Avatar name={PRODUCT.demoUser.name} size="lg" className="h-40 w-40 rounded-full border-4 border-background object-cover shadow-panel" />
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="material-symbols-outlined text-3xl text-white">photo_camera</span>
              </span>
            </button>

            <div className="flex-1 pb-4">
              <h2 className="text-4xl font-black tracking-tight-sm text-on-surface">{PRODUCT.demoUser.name}</h2>
              <p className="mt-1 flex items-center gap-2 font-medium tracking-wide text-primary">
                <span className="material-symbols-outlined text-sm">verified</span>
                {PRODUCT.demoUser.role}
              </p>
            </div>

            <div className="flex gap-3 pb-4">
              <Button variant="secondary">Edit Profile</Button>
              <Button>Share Profile</Button>
            </div>
          </div>
        </section>

        <div className="mx-auto mt-4 grid max-w-6xl grid-cols-12 gap-8 px-6 lg:px-10">
          <aside className="col-span-12 space-y-8 lg:col-span-4">
            <Card className="bg-surface-container" padding="lg">
              <h3 className="mb-6 flex items-center gap-2 font-mono-data text-xs uppercase tracking-label-xl text-outline-variant">
                <span className="material-symbols-outlined text-sm">person</span>
                About
              </h3>
              <p className="mb-8 text-sm leading-relaxed text-on-surface-variant">{profileAboutSummary}</p>
              <div className="space-y-6">
                {profileAboutDetails.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-lg text-primary/60">{item.icon}</span>
                    <div>
                      <p className="font-mono-data text-2xs uppercase tracking-label-md text-outline-variant">{item.label}</p>
                      <p className="text-sm font-medium text-on-surface">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-surface-container-low" padding="lg">
              <h3 className="mb-6 font-mono-data text-xs uppercase tracking-label-xl text-outline-variant">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {profileExpertise.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-outline-variant/10 bg-surface-container-highest px-3 py-1 font-mono-data text-2xs uppercase tracking-label-xs text-on-surface"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>
          </aside>

          <div className="col-span-12 space-y-8 lg:col-span-8">
            <Card className="bg-surface-container" padding="lg">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-mono-data text-xs uppercase tracking-label-xl text-outline-variant">
                  <span className="material-symbols-outlined text-sm">history</span>
                  Recent Activity
                </h3>
                <button type="button" className="text-xs font-bold text-primary transition-colors hover:underline">
                  View All
                </button>
              </div>
              <div className="space-y-1">
                {recentActivity.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="group flex w-full items-center justify-between rounded-lg bg-surface-container-low/50 p-4 text-left transition-colors hover:bg-surface-container-high"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.iconWrapperClass}`}>
                        <span className={`material-symbols-outlined ${item.iconClass}`}>{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{item.title}</p>
                        <p className="mt-1 font-mono-data text-xs text-outline-variant">{item.subtitle}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline-variant opacity-0 transition-opacity group-hover:opacity-100">chevron_right</span>
                  </button>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <Card className="bg-surface-container" padding="lg">
                <h3 className="mb-8 flex items-center gap-2 font-mono-data text-xs uppercase tracking-label-xl text-outline-variant">
                  <span className="material-symbols-outlined text-sm">link</span>
                  Linked Accounts
                </h3>
                <div className="space-y-6">
                  {linkedAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-on-surface">
                          <span className="material-symbols-outlined text-sm">{account.name === "Google" ? "mail" : "code"}</span>
                        </div>
                        <span className="text-sm font-medium text-on-surface">{account.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleLinkedAccount(account.id)}
                        className="flex items-center gap-2"
                        aria-label={`${account.connected ? "Disconnect" : "Connect"} ${account.name}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${account.connected ? "bg-success" : "bg-error"}`} />
                        <span className="font-mono-data text-2xs uppercase tracking-label-sm text-on-surface-variant">
                          {account.connected ? "Connected" : "Disconnected"}
                        </span>
                      </button>
                    </div>
                  ))}
                  <Button variant="secondary" className="w-full">
                    Connect New Account
                  </Button>
                </div>
              </Card>

              <Card className="bg-surface-container" padding="lg">
                <h3 className="mb-8 flex items-center gap-2 font-mono-data text-xs uppercase tracking-label-xl text-outline-variant">
                  <span className="material-symbols-outlined text-sm">security</span>
                  Security
                </h3>
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-on-surface">Two-Factor Authentication</p>
                    <p className="mt-1 text-xs text-outline-variant">Recommended for admins</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTwoFactorEnabled((value) => !value)}
                    className={`inline-flex h-6 w-11 items-center rounded-full px-1 transition-colors ${
                      isTwoFactorEnabled ? "justify-end bg-primary" : "justify-start bg-surface-container-highest"
                    }`}
                    aria-label="Toggle two-factor authentication"
                  >
                    <span className="h-5 w-5 rounded-full bg-white" />
                  </button>
                </div>
                <p className="mb-4 font-mono-data text-2xs uppercase tracking-label-md text-outline-variant">Recent Sessions</p>
                <div className="space-y-4">
                  {initialSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`flex items-center justify-between ${session.id === "session_1" ? "border-b border-outline-variant/10 pb-4" : "pb-2"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-lg text-outline-variant">{session.icon}</span>
                        <div>
                          <p className="text-xs font-medium text-on-surface">{session.device}</p>
                          <p className="font-mono-data text-2xs text-outline-variant">{session.detail}</p>
                        </div>
                      </div>
                      <span className={`font-mono-data text-3xs uppercase tracking-label-sm ${session.active ? "text-success" : "text-on-surface-variant/45"}`}>
                        {session.active ? "Active" : "2 days ago"}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {profilePreferenceCards.map((item) => (
                <Card key={item.label} className="bg-surface-container-low" padding="lg">
                  <h3 className="mb-6 flex items-center gap-2 font-mono-data text-xs uppercase tracking-label-xl text-outline-variant">
                    <span className="material-symbols-outlined text-sm text-primary/70">{item.icon}</span>
                    {item.label}
                  </h3>
                  <p className="text-sm font-semibold text-on-surface">{item.value}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
