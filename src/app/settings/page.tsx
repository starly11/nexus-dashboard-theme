"use client";

import React, { startTransition, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  defaultSettingsLastSavedLabel,
  defaultSettingsTab,
  initialApiKeys,
  initialGeneralSettings,
  initialIntegrationSettings,
  initialNotificationSettings,
  initialSecuritySettings,
  integrationSettingsOptions,
  notificationChannels,
  settingsLanguageOptions,
  settingsSessionTimeoutOptions,
  settingsTabs,
  settingsTimezoneOptions,
} from "@/data/settings";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type {
  ApiKeyRecord,
  GeneralSettingsState,
  IntegrationSettingsState,
  NotificationState,
  SettingsTab,
  SecuritySettingsState,
} from "@/types/settings";

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center justify-between gap-4 rounded-2xl bg-surface-container-low px-4 py-4 text-left transition-colors hover:bg-surface-container-high"
      aria-pressed={checked}
      aria-label={label}
    >
      <div>
        <p className="text-sm font-semibold text-on-surface">{label}</p>
        {description ? <p className="mt-1 text-sm text-on-surface-variant/68">{description}</p> : null}
      </div>
      <span className={`flex h-6 w-11 items-center rounded-full px-1 transition-colors ${checked ? "justify-end bg-success/20" : "justify-start bg-surface-container-highest"}`}>
        <span className={`h-4 w-4 rounded-full ${checked ? "bg-success" : "bg-muted"}`} />
      </span>
    </button>
  );
}

export default function SettingsPage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<SettingsTab>(defaultSettingsTab);
  const [generalSettings, setGeneralSettings] = useState<GeneralSettingsState>(initialGeneralSettings);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettingsState>(initialSecuritySettings);
  const [notificationSettings, setNotificationSettings] = useState<NotificationState>(initialNotificationSettings);
  const [integrationSettings, setIntegrationSettings] = useState<IntegrationSettingsState>(initialIntegrationSettings);
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>(initialApiKeys);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedLabel, setLastSavedLabel] = useState(defaultSettingsLastSavedLabel);
  const [dangerConfirmValue, setDangerConfirmValue] = useState("");

  const isDirty = useMemo(() => {
    const normalizedCurrentKeys = apiKeys.map((key) => ({
      id: key.id,
      label: key.label,
      value: key.value,
      lastUsed: key.lastUsed,
      scope: key.scope,
    }));
    const normalizedInitialKeys = initialApiKeys.map((key) => ({
      id: key.id,
      label: key.label,
      value: key.value,
      lastUsed: key.lastUsed,
      scope: key.scope,
    }));

    return (
      JSON.stringify(generalSettings) !== JSON.stringify(initialGeneralSettings) ||
      JSON.stringify(securitySettings) !== JSON.stringify(initialSecuritySettings) ||
      JSON.stringify(notificationSettings) !== JSON.stringify(initialNotificationSettings) ||
      JSON.stringify(integrationSettings) !== JSON.stringify(initialIntegrationSettings) ||
      JSON.stringify(normalizedCurrentKeys) !== JSON.stringify(normalizedInitialKeys)
    );
  }, [apiKeys, generalSettings, integrationSettings, notificationSettings, securitySettings]);

  const saveChanges = (): void => {
    setIsSaving(true);

    window.setTimeout(() => {
      startTransition(() => {
        setIsSaving(false);
        setLastSavedLabel("Saved just now");
      });
    }, 700);
  };

  const resetChanges = (): void => {
    setGeneralSettings(initialGeneralSettings);
    setSecuritySettings(initialSecuritySettings);
    setNotificationSettings(initialNotificationSettings);
    setIntegrationSettings(initialIntegrationSettings);
    setApiKeys(initialApiKeys);
    setDangerConfirmValue("");
    setLastSavedLabel("Reverted to defaults");
  };

  const revealKey = (id: string): void => {
    setApiKeys((currentKeys) =>
      currentKeys.map((key) => (key.id === id ? { ...key, revealed: !key.revealed } : key))
    );
  };

  const rotateKey = (id: string): void => {
    setApiKeys((currentKeys) =>
      currentKeys.map((key) =>
        key.id === id
          ? {
              ...key,
              value: `${key.value.slice(0, 8)}${Math.random().toString(36).slice(2, 10)}`,
              lastUsed: "Just rotated",
            }
          : key
      )
    );
    setLastSavedLabel("API key rotated locally");
  };

  const copyKey = async (value: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
      setLastSavedLabel("API key copied to clipboard");
    } catch {
      setLastSavedLabel("Clipboard unavailable in this environment");
    }
  };

  return (
    <AppLayout
      title="Settings"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Settings" },
      ]}
    >
      <div className="space-y-10 pb-8">
        <section className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <Badge variant="info" dot>
              Organization Settings
            </Badge>
            <h2 className="mt-4 text-4xl font-black tracking-tight-sm text-on-surface">Manage your team preferences and technical workspace configurations.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-on-surface-variant/75 lg:text-base">
              This route is fully interactive now: tabbed sections, dirty-state save flow, security controls, notification preferences, API key management, and a guarded danger zone.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="bg-surface-container-low" padding="lg">
              <p className="font-mono-data text-2xs uppercase tracking-label-xl text-primary">Workspace Status</p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-on-surface-variant/70">Status</span>
                  <Badge variant="success" dot>
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-on-surface-variant/70">ID</span>
                  <span className="font-mono-data text-xs text-muted">{generalSettings.workspaceId}</span>
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden bg-surface-container-low" padding="lg">
              <div className="absolute -bottom-6 -right-4 text-primary/8">
                <span className="material-symbols-outlined text-10xl">security</span>
              </div>
              <p className="font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/45">Security Tier</p>
              <p className="mt-5 font-mono-data text-3xl tracking-tight-md text-primary">L-4 Secure</p>
              <p className="mt-2 max-w-[16rem] text-xs leading-6 text-on-surface-variant/70">
                End-to-end encryption enabled across workspace endpoints.
              </p>
            </Card>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-[14rem_minmax(0,1fr)_18rem]">
          <nav className="flex flex-col gap-1 rounded-3xl border border-outline-variant/10 bg-surface-container-low p-3">
            {settingsTabs.map((tab) => {
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-2xl px-4 py-3 text-left text-sm transition-all ${
                    tab === "Danger Zone"
                      ? isActive
                        ? "bg-error/10 text-error"
                        : "text-error/80 hover:bg-error/8"
                      : isActive
                        ? "bg-surface-container-high text-primary"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                  aria-label={`Open ${tab} settings`}
                >
                  {tab}
                </button>
              );
            })}
          </nav>

          <div className="space-y-8">
            {activeTab === "General" ? (
              <div className="space-y-8">
                <section className="space-y-6">
                  <h3 className="border-b border-outline-variant/10 pb-4 text-xl font-bold tracking-tight text-on-surface">Branding</h3>
                  <div className="flex flex-col gap-8 md:flex-row md:items-start">
                    <button
                      type="button"
                      className="group text-left"
                      aria-label="Upload organization logo"
                      onClick={() => setLastSavedLabel("Logo uploader placeholder clicked")}
                    >
                      <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container">
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-fixed to-secondary-fixed">
                          <span className="font-black tracking-tight text-on-primary">NX</span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="material-symbols-outlined text-white">upload</span>
                        </div>
                      </div>
                      <p className="mt-2 text-center font-mono-data text-2xs uppercase tracking-label-md text-on-surface-variant/55">SVG, PNG (Max 2MB)</p>
                    </button>

                    <div className="flex-1">
                      <label className="block">
                        <span className="mb-2 block font-mono-data text-2xs uppercase tracking-label-lg text-on-surface-variant/50">Organization Name</span>
                        <input
                          value={generalSettings.organizationName}
                          onChange={(event) =>
                            setGeneralSettings((currentState) => ({ ...currentState, organizationName: event.target.value }))
                          }
                          className="w-full rounded-2xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none ring-1 ring-outline-variant/10 transition-all focus:ring-primary/35"
                          aria-label="Organization name"
                          type="text"
                        />
                      </label>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="border-b border-outline-variant/10 pb-4 text-xl font-bold tracking-tight text-on-surface">Localization</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block font-mono-data text-2xs uppercase tracking-label-lg text-on-surface-variant/50">Timezone</span>
                      <select
                        value={generalSettings.timezone}
                        onChange={(event) =>
                          setGeneralSettings((currentState) => ({ ...currentState, timezone: event.target.value }))
                        }
                        className="w-full appearance-none rounded-2xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none ring-1 ring-outline-variant/10 transition-all focus:ring-primary/35"
                        aria-label="Select timezone"
                      >
                        {settingsTimezoneOptions.map((timezone) => (
                          <option key={timezone}>{timezone}</option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block font-mono-data text-2xs uppercase tracking-label-lg text-on-surface-variant/50">Primary Language</span>
                      <select
                        value={generalSettings.language}
                        onChange={(event) =>
                          setGeneralSettings((currentState) => ({ ...currentState, language: event.target.value }))
                        }
                        className="w-full appearance-none rounded-2xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none ring-1 ring-outline-variant/10 transition-all focus:ring-primary/35"
                        aria-label="Select primary language"
                      >
                        {settingsLanguageOptions.map((language) => (
                          <option key={language}>{language}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </section>
              </div>
            ) : null}

            {activeTab === "Security" ? (
              <div className="space-y-6">
                <h3 className="border-b border-outline-variant/10 pb-4 text-xl font-bold tracking-tight text-on-surface">Security Controls</h3>
                <Toggle
                  checked={securitySettings.requireSso}
                  onChange={() => setSecuritySettings((currentState) => ({ ...currentState, requireSso: !currentState.requireSso }))}
                  label="Require SSO for all admins"
                  description="Block direct password sign-in for elevated users and route them through your identity provider."
                />
                <Toggle
                  checked={securitySettings.enforceMfa}
                  onChange={() => setSecuritySettings((currentState) => ({ ...currentState, enforceMfa: !currentState.enforceMfa }))}
                  label="Enforce multi-factor authentication"
                  description="Require MFA during login and step-up verification on privileged actions."
                />
                <Toggle
                  checked={securitySettings.auditLogs}
                  onChange={() => setSecuritySettings((currentState) => ({ ...currentState, auditLogs: !currentState.auditLogs }))}
                  label="Stream audit logs to secure archive"
                  description="Retain security events for compliance review and incident investigation."
                />
                <label className="block">
                  <span className="mb-2 block font-mono-data text-2xs uppercase tracking-label-lg text-on-surface-variant/50">Session Timeout</span>
                  <select
                    value={securitySettings.sessionTimeout}
                    onChange={(event) => setSecuritySettings((currentState) => ({ ...currentState, sessionTimeout: event.target.value }))}
                    className="w-full appearance-none rounded-2xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none ring-1 ring-outline-variant/10 transition-all focus:ring-primary/35"
                    aria-label="Select session timeout"
                  >
                    {settingsSessionTimeoutOptions.map((sessionTimeout) => (
                      <option key={sessionTimeout}>{sessionTimeout}</option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}

            {activeTab === "Notifications" ? (
              <div className="space-y-6">
                <h3 className="border-b border-outline-variant/10 pb-4 text-xl font-bold tracking-tight text-on-surface">Notification Preferences</h3>
                {notificationChannels.map((channel) => (
                  <Toggle
                    key={channel}
                    checked={notificationSettings[channel]}
                    onChange={() =>
                      setNotificationSettings((currentState) => ({ ...currentState, [channel]: !currentState[channel] }))
                    }
                    label={channel}
                    description="Control which updates appear in your admin digest and real-time alert stream."
                  />
                ))}
              </div>
            ) : null}

            {activeTab === "API Keys" ? (
              <div className="space-y-6">
                <h3 className="border-b border-outline-variant/10 pb-4 text-xl font-bold tracking-tight text-on-surface">API Keys</h3>
                {apiKeys.map((key) => (
                  <Card key={key.id} className="bg-surface-container-low" padding="lg">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-base font-bold tracking-tight text-on-surface">{key.label}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant="info" dot>
                            {key.scope}
                          </Badge>
                          <Badge variant="default">
                            {key.lastUsed}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="ghost" size="sm" onClick={() => revealKey(key.id)}>
                          <span className="material-symbols-outlined text-sm text-secondary">{key.revealed ? "visibility_off" : "visibility"}</span>
                          {key.revealed ? "Hide" : "Reveal"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => copyKey(key.value)}>
                          <span className="material-symbols-outlined text-sm text-primary">content_copy</span>
                          Copy
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => rotateKey(key.id)}>
                          <span className="material-symbols-outlined text-sm text-warning">autorenew</span>
                          Rotate
                        </Button>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl bg-surface-container-lowest px-4 py-3 font-mono-data text-xs text-on-surface/85 ring-1 ring-outline-variant/10">
                      {key.revealed ? key.value : `${key.value.slice(0, 6)}••••••••••••`}
                    </div>
                  </Card>
                ))}
              </div>
            ) : null}

            {activeTab === "Integrations" ? (
              <div className="space-y-6">
                <h3 className="border-b border-outline-variant/10 pb-4 text-xl font-bold tracking-tight text-on-surface">Integration Preferences</h3>
                {integrationSettingsOptions.map((setting) => (
                  <Toggle
                    key={setting}
                    checked={integrationSettings[setting]}
                    onChange={() =>
                      setIntegrationSettings((currentState) => ({ ...currentState, [setting]: !currentState[setting] }))
                    }
                    label={setting}
                    description="Adjust background sync and event routing behavior for connected services."
                  />
                ))}
              </div>
            ) : null}

            {activeTab === "Danger Zone" ? (
              <div className="space-y-6">
                <h3 className="border-b border-outline-variant/10 pb-4 text-xl font-bold tracking-tight text-error">Danger Zone</h3>
                <Card className="border-error/20 bg-error/6" padding="lg">
                  <p className="text-lg font-bold text-on-surface">Archive Workspace</p>
                  <p className="mt-2 text-sm leading-7 text-on-surface-variant/72">
                    Type <span className="font-mono-data text-error">ARCHIVE</span> to enable the archive button. This is still a UI-only placeholder for your template.
                  </p>
                  <div className="mt-5 flex flex-col gap-4 md:flex-row">
                    <input
                      value={dangerConfirmValue}
                      onChange={(event) => setDangerConfirmValue(event.target.value)}
                      className="flex-1 rounded-2xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none ring-1 ring-error/18 transition-all focus:ring-error/35"
                      aria-label="Type ARCHIVE to confirm"
                      placeholder="Type ARCHIVE"
                      type="text"
                    />
                    <Button
                      variant="secondary"
                      className="border-error/20 text-error hover:border-error/35 hover:text-error"
                      disabled={dangerConfirmValue !== "ARCHIVE"}
                      onClick={() => setLastSavedLabel("Archive action placeholder triggered")}
                    >
                      <span className="material-symbols-outlined text-sm text-error">warning</span>
                      Archive Workspace
                    </Button>
                  </div>
                </Card>
              </div>
            ) : null}

            <footer className="flex flex-col gap-4 border-t border-outline-variant/10 pt-8 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-on-surface-variant/70">
                <span className="material-symbols-outlined text-sm text-secondary">info</span>
                <span className="font-mono-data text-xs">{lastSavedLabel}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="ghost" onClick={resetChanges}>
                  Cancel
                </Button>
                <Button onClick={saveChanges} disabled={isSaving || !isDirty}>
                  <span className="material-symbols-outlined text-sm text-on-primary">{isSaving ? "hourglass_top" : "save"}</span>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </footer>
          </div>

          <div className="space-y-4">
            <Card className="bg-surface-container-low" padding="lg">
              <p className="font-mono-data text-2xs uppercase tracking-label-xl text-primary">Workspace Health</p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-on-surface-variant/70">Admin Protections</span>
                  <span className="font-mono-data text-sm text-success">{securitySettings.requireSso && securitySettings.enforceMfa ? "High" : "Medium"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-on-surface-variant/70">Notifications Enabled</span>
                  <span className="font-mono-data text-sm text-secondary">
                    {Object.values(notificationSettings).filter(Boolean).length}/4
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-on-surface-variant/70">Connected Preferences</span>
                  <span className="font-mono-data text-sm text-warning">
                    {Object.values(integrationSettings).filter(Boolean).length}/3
                  </span>
                </div>
              </div>
            </Card>

            <Card className="bg-surface-container-low" padding="lg">
              <p className="font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/45">Current Context</p>
              <p className="mt-4 text-xl font-bold tracking-tight text-on-surface">{activeTab}</p>
              <p className="mt-2 text-sm leading-7 text-on-surface-variant/72">
                Use the side tabs to preview the different settings panels buyers will expect in a premium ThemeForest admin template.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
