"use client";

import React, { useDeferredValue, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  defaultIntegrationActivityMessage,
  initialIntegrations,
  integrationFilterTabs,
} from "@/data/integrations";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { IntegrationFilter, IntegrationRecord } from "@/types/integrations";

export default function IntegrationsPage(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<IntegrationFilter>("All");
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string>(initialIntegrations[0].id);
  const [integrations, setIntegrations] = useState<IntegrationRecord[]>(initialIntegrations);
  const [integrationActivityMessage, setIntegrationActivityMessage] = useState(defaultIntegrationActivityMessage);

  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredIntegrations = useMemo(() => {
    const normalizedQuery = deferredSearchQuery.trim().toLowerCase();

    return integrations.filter((integration) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [integration.name, integration.category, integration.description].some((value) =>
          value.toLowerCase().includes(normalizedQuery)
        );

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Connected" && integration.connected) ||
        integration.category === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, deferredSearchQuery, integrations]);

  const selectedIntegration =
    filteredIntegrations.find((integration) => integration.id === selectedIntegrationId) ??
    integrations.find((integration) => integration.id === selectedIntegrationId) ??
    integrations[0];

  const connectedCount = integrations.filter((integration) => integration.connected).length;
  const disconnectedCount = integrations.length - connectedCount;

  const toggleConnection = (integrationId: string): void => {
    const targetIntegration =
      integrations.find((integration) => integration.id === integrationId) ?? initialIntegrations[0];

    setIntegrationActivityMessage(
      `${targetIntegration.connected ? "Disconnecting" : "Connecting"} ${targetIntegration.name} for workspace sync.`
    );
    setIntegrations((currentIntegrations) =>
      currentIntegrations.map((integration) =>
        integration.id === integrationId ? { ...integration, connected: !integration.connected } : integration
      )
    );
  };

  return (
    <AppLayout
      title="Integrations"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Integrations" },
      ]}
    >
      <div className="space-y-10 pb-8">
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.8fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info" dot>
                Marketplace
              </Badge>
              <Badge variant="success" dot>
                {connectedCount} connected
              </Badge>
              <Badge variant="error" dot>
                {disconnectedCount} disconnected
              </Badge>
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-tight-sm text-on-surface">Connect your workspace with the tools you use every day.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-on-surface-variant/75 lg:text-base">
              The Stitch references lean on brand-color moments here, so this route uses richer indigo, cobalt, orange, plum, blue, and green accents while keeping the same nocturnal surface stack.
            </p>
          </div>

          <Card className="bg-surface-container-low" padding="lg">
            <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45">Focused Integration</p>
            <div className="mt-4 flex items-center gap-4">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${selectedIntegration.tileClass}`}>
                <span className={`material-symbols-outlined material-symbols-filled text-3xl ${selectedIntegration.iconClass}`}>
                  {selectedIntegration.icon}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-on-surface">{selectedIntegration.name}</h3>
                <p className="mt-1 text-sm text-on-surface-variant/70">{selectedIntegration.category}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-on-surface-variant/72">{selectedIntegration.description}</p>
            <p className="mt-4 text-sm text-on-surface-variant/68">{integrationActivityMessage}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant={selectedIntegration.connected ? "success" : "error"} dot>
                {selectedIntegration.connected ? "Connected" : "Disconnected"}
              </Badge>
              <Badge variant="info" dot>
                Live sync ready
              </Badge>
            </div>
          </Card>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <label className="relative block w-full xl:max-w-sm">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary/70 text-sm">search</span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-full bg-surface-container-low px-4 py-3 pl-11 text-sm text-on-surface outline-none ring-1 ring-outline-variant/10 transition-all placeholder:text-on-surface-variant/35 focus:ring-primary/35"
                placeholder="Search marketplace..."
                type="text"
                aria-label="Search integrations"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2 border-b border-outline-variant/10 xl:border-none">
              {integrationFilterTabs.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-t-2xl px-5 py-3 text-sm font-semibold transition-all xl:rounded-full ${
                    activeFilter === filter
                      ? "bg-surface-container-high text-primary ring-1 ring-primary/18"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  }`}
                  aria-label={`Filter integrations by ${filter}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {filteredIntegrations.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredIntegrations.map((integration) => (
                <button
                  key={integration.id}
                  type="button"
                  onClick={() => setSelectedIntegrationId(integration.id)}
                  className={`group rounded-3xl border border-outline-variant/5 bg-surface-container p-6 text-left transition-all duration-300 hover:bg-surface-container-high ${
                    selectedIntegrationId === integration.id ? "ring-1 ring-primary/18 shadow-panel" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${integration.tileClass}`}>
                      <span className={`material-symbols-outlined material-symbols-filled text-2xl ${integration.iconClass}`}>
                        {integration.icon}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedIntegrationId(integration.id);
                          setIntegrationActivityMessage(`${integration.name} settings are ready for workspace configuration.`);
                        }}
                        className="rounded-lg p-2 text-on-surface-variant/45 transition-colors hover:text-on-surface"
                        aria-label={`Open settings for ${integration.name}`}
                      >
                        <span className="material-symbols-outlined text-xl">settings</span>
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleConnection(integration.id);
                        }}
                        className={`inline-flex h-5 w-10 items-center rounded-full px-1 transition-colors ${
                          integration.connected ? "justify-end bg-primary-container/80" : "justify-start bg-surface-container-highest"
                        }`}
                        aria-label={`${integration.connected ? "Disconnect" : "Connect"} ${integration.name}`}
                      >
                        <span className="h-3.5 w-3.5 rounded-full bg-white" />
                      </button>
                    </div>
                  </div>

                  <h3 className="mt-6 text-lg font-bold tracking-tight text-on-surface">{integration.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-label-md text-on-surface-variant/45">{integration.category}</p>
                  <p className="mt-4 min-h-[84px] text-sm leading-7 text-on-surface-variant/72">{integration.description}</p>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 font-mono-data text-2xs uppercase tracking-label-md ${
                        integration.connected
                          ? "bg-success-soft text-success"
                          : "bg-error/10 text-error"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${integration.connected ? "bg-success" : "bg-error"}`} />
                      {integration.connected ? "Connected" : "Disconnected"}
                    </span>
                    <span className={`text-xs font-bold transition-opacity ${integration.statusToneClass} opacity-80 group-hover:opacity-100`}>
                      {integration.actionLabel} →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <Card className="bg-surface-container-low" padding="lg">
              <p className="text-lg font-bold text-on-surface">No integrations found.</p>
              <p className="mt-2 text-sm text-on-surface-variant/72">Try another filter or search term to browse the marketplace.</p>
            </Card>
          )}
        </section>

        <section className="grid grid-cols-12 gap-6">
          <Card className="col-span-12 overflow-hidden bg-surface-container-low lg:col-span-8" padding="none">
            <div className="grid min-h-80 grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col justify-center p-8 lg:p-10">
                <span className="w-fit rounded-lg bg-primary/10 px-3 py-1 font-mono-data text-2xs uppercase tracking-label-lg text-primary">
                  Premium Feature
                </span>
                <h3 className="mt-5 text-3xl font-bold tracking-tight text-on-surface">Enterprise Data Pipeline</h3>
                <p className="mt-4 max-w-md text-sm leading-7 text-on-surface-variant/72">
                  Unlock direct S3 or BigQuery exports for high-volume analytics processing and custom warehouse integration.
                </p>
                <Button className="mt-8 w-fit">
                  <span className="material-symbols-outlined text-lg text-on-primary">upgrade</span>
                  Upgrade To Enterprise
                </Button>
              </div>

              <div className="relative overflow-hidden bg-surface-container">
                <div className="surface-orb surface-orb-primary left-10 top-10 h-40 w-40 opacity-80" />
                <div className="surface-orb surface-orb-secondary right-12 top-16 h-32 w-32 opacity-80" />
                <div className="surface-orb bottom-12 left-1/2 h-36 w-36 -translate-x-1/2 bg-accent-orange/15 opacity-80" />
                <div className="absolute inset-x-6 top-12 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="absolute left-8 right-8 top-24 space-y-4">
                  <div className="h-2 rounded-full bg-primary/30" />
                  <div className="h-2 w-4/5 rounded-full bg-secondary/30" />
                  <div className="h-2 w-2/3 rounded-full bg-accent-orange/25" />
                  <div className="h-2 w-5/6 rounded-full bg-primary/20" />
                  <div className="h-2 w-1/2 rounded-full bg-secondary/20" />
                </div>
                <div className="absolute inset-x-10 bottom-14 h-24 rounded-full bg-primary/10 blur-3xl" />
              </div>
            </div>
          </Card>

          <Card className="col-span-12 bg-surface-container lg:col-span-4" padding="lg">
            <h3 className="text-xl font-bold tracking-tight text-on-surface">API Documentation</h3>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant/72">
              Build custom integrations using our developer-first REST API, event streams, and SDK helpers.
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 rounded-2xl bg-surface-container-lowest p-3">
                <span className="material-symbols-outlined text-sm text-primary">code</span>
                <span className="font-mono-data text-xs text-on-surface/85">nexus.integrations.connect()</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-surface-container-lowest p-3">
                <span className="material-symbols-outlined text-sm text-primary">key</span>
                <span className="font-mono-data text-xs text-on-surface/85">Bearer •••••••••••••••</span>
              </div>
            </div>
            <button
              type="button"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary transition-transform hover:translate-x-1"
              aria-label="Read the developer guide"
            >
              Read Developer Guide
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
