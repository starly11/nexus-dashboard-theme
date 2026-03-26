"use client";

import React, { useCallback, useDeferredValue, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { initialSchedules, reportFormatOptions, reportPresets, reportRangeOptions } from "@/data/reports";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, TableColumn } from "@/components/ui/Table";
import { PRODUCT } from "@/config/product";
import type { ReportFormat, ReportPreset, ReportRange, ScheduleRecord } from "@/types/reports";

function isReportRange(value: string): value is ReportRange {
  return reportRangeOptions.some((range) => range === value);
}

export default function ReportsPage(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRange, setSelectedRange] = useState<ReportRange>("Last 30 Days");
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>("PDF");
  const [selectedPresetId, setSelectedPresetId] = useState<string>(reportPresets[0].id);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(initialSchedules[0].id);
  const [schedules, setSchedules] = useState<ScheduleRecord[]>(initialSchedules);
  const [lastGeneratedMessage, setLastGeneratedMessage] = useState("Ready to generate the next board-ready export.");

  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredPresets = useMemo(() => {
    const normalizedQuery = deferredSearchQuery.trim().toLowerCase();

    return reportPresets.filter((preset) => {
      if (normalizedQuery.length === 0) {
        return true;
      }

      return [preset.title, preset.category, preset.description].some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [deferredSearchQuery]);

  const filteredSchedules = useMemo(() => {
    const normalizedQuery = deferredSearchQuery.trim().toLowerCase();

    return schedules.filter((schedule) => {
      if (normalizedQuery.length === 0) {
        return true;
      }

      return [schedule.name, schedule.frequency, schedule.lastSent, schedule.nextSend].some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [deferredSearchQuery, schedules]);

  const selectedPreset =
    filteredPresets.find((preset) => preset.id === selectedPresetId) ??
    reportPresets.find((preset) => preset.id === selectedPresetId) ??
    reportPresets[0];

  const selectedSchedule =
    filteredSchedules.find((schedule) => schedule.id === selectedScheduleId) ??
    schedules.find((schedule) => schedule.id === selectedScheduleId) ??
    schedules[0];

  const activeJobs = schedules.filter((schedule) => schedule.status === "active").length * 41 + 42;
  const activeScheduleCount = schedules.filter((schedule) => schedule.status === "active").length;

  const handleGenerateReport = (): void => {
    setLastGeneratedMessage(`${selectedPreset.title} prepared as ${selectedFormat} for ${selectedRange}.`);
  };

  const handleExportPreset = (preset: ReportPreset, format: ReportFormat): void => {
    setSelectedPresetId(preset.id);
    setLastGeneratedMessage(`${preset.title} export queued in ${format}.`);
  };

  const toggleSchedule = useCallback((scheduleId: string): void => {
    setSchedules((currentSchedules) =>
      currentSchedules.map((schedule) =>
        schedule.id === scheduleId
          ? { ...schedule, status: schedule.status === "active" ? "inactive" : "active" }
          : schedule
      )
    );
  }, []);

  const scheduleColumns = useMemo<TableColumn<ScheduleRecord>[]>(
    () => [
    {
      key: "name",
      header: "Report Name",
      render: (_, schedule) => (
        <div className="flex items-center gap-3">
          <span className={`h-2 w-2 rounded-full ${schedule.accentDotClass} shadow-[0_0_10px_currentColor]`} />
          <span className={`text-sm font-bold ${schedule.status === "active" ? "text-on-surface" : "text-muted"}`}>{schedule.name}</span>
        </div>
      ),
    },
    {
      key: "frequency",
      header: "Frequency",
      render: (value) => <Badge size="sm">{String(value ?? "")}</Badge>,
    },
    {
      key: "lastSent",
      header: "Last Sent",
      render: (value) => <span className="font-mono-data text-xs text-on-surface-variant/70">{String(value ?? "")}</span>,
    },
    {
      key: "nextSend",
      header: "Next Send",
      render: (value, schedule) => (
        <span className={`font-mono-data text-xs ${schedule.status === "active" ? "text-on-surface" : "text-muted"}`}>
          {String(value ?? "")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (_, schedule) => (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toggleSchedule(schedule.id);
          }}
          className="inline-flex items-center gap-2"
          aria-label={`${schedule.status === "active" ? "Deactivate" : "Activate"} ${schedule.name}`}
        >
          <span
            className={`flex h-5 w-10 items-center rounded-full px-1 transition-colors ${
              schedule.status === "active" ? "justify-end bg-success/20" : "justify-start bg-error/12"
            }`}
          >
            <span className={`h-3 w-3 rounded-full ${schedule.status === "active" ? "bg-success" : "bg-error"}`} />
          </span>
          <span className={`font-mono-data text-2xs uppercase tracking-label-lg ${schedule.status === "active" ? "text-success" : "text-error"}`}>
            {schedule.status}
          </span>
        </button>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (_, schedule) => (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setSelectedScheduleId(schedule.id);
            setLastGeneratedMessage(`${schedule.name} automation controls are ready for configuration.`);
          }}
          className="rounded-lg p-2 text-on-surface-variant/55 transition-colors hover:bg-surface-container-high hover:text-on-surface"
          aria-label={`Open actions for ${schedule.name}`}
        >
          <span className="material-symbols-outlined text-lg">more_vert</span>
        </button>
      ),
    },
    ],
    [toggleSchedule]
  );

  return (
    <AppLayout
      title="Reports"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Reports" },
      ]}
    >
      <div className="space-y-10 pb-8">
        <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <Badge variant="info" dot>
              Reports Center
            </Badge>
            <h2 className="mt-4 text-4xl font-black tracking-tight-sm text-on-surface">Configure, automate, and export deep-dive analytics.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-on-surface-variant/75 lg:text-base">
              This route now uses the stronger Stitch accent mix: financial purple, acquisition blue, retention red, and clear green or red schedule states.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="text-right">
              <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45">Active Jobs</p>
              <p className="mt-2 font-mono-data text-3xl font-bold text-primary">{activeJobs}</p>
            </div>
            <div className="hidden h-12 w-px bg-outline-variant/15 lg:block" />
            <div className="text-right">
              <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45">Storage Used</p>
              <p className="mt-2 font-mono-data text-3xl font-bold text-secondary">82%</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.75fr]">
          <Card className="relative overflow-hidden bg-surface-container-low" padding="lg">
            <div className="absolute right-6 top-6 text-primary/10">
              <span className="material-symbols-outlined text-8xl">analytics</span>
            </div>
            <div className="relative z-10">
              <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-on-surface">
                <span className="material-symbols-outlined text-primary">instant_mix</span>
                Quick Generation
              </h3>

              <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.05fr_0.95fr_1.4fr]">
                <label className="space-y-2">
                  <span className="ml-1 block font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/45">Date Range</span>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/45 text-sm">
                      calendar_today
                    </span>
                    <select
                      value={selectedRange}
                      onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                        if (isReportRange(event.target.value)) {
                          setSelectedRange(event.target.value);
                        }
                      }}
                      className="w-full appearance-none rounded-2xl bg-surface-container-lowest py-3 pl-10 pr-4 text-sm text-on-surface outline-none ring-1 ring-outline-variant/10 transition-all focus:ring-primary/35"
                      aria-label="Select report date range"
                    >
                      {reportRangeOptions.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>

                <div className="space-y-2">
                  <span className="ml-1 block font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/45">Format</span>
                  <div className="flex gap-2">
                    {reportFormatOptions.map((format) => (
                      <button
                        key={format}
                        type="button"
                        onClick={() => setSelectedFormat(format)}
                        className={`flex-1 rounded-xl py-3 text-tiny font-semibold transition-all ${
                          selectedFormat === format
                            ? "bg-primary/18 text-primary ring-1 ring-primary/25"
                            : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
                        }`}
                        aria-label={`Export format ${format}`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-end">
                  <Button className="h-11.5 w-full" onClick={handleGenerateReport}>
                    <span className="material-symbols-outlined text-lg text-on-primary">bolt</span>
                    Generate Report
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-surface-container-low" padding="lg">
            <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45">Last Output</p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-on-surface">{selectedPreset.title}</h3>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant/75">{lastGeneratedMessage}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="success" dot>
                {activeScheduleCount} active schedules
              </Badge>
              <Badge variant="info" dot>
                {selectedFormat} selected
              </Badge>
            </div>
          </Card>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h3 className="flex items-center gap-3 font-mono-data text-2xs uppercase tracking-label-5xl text-on-surface-variant/45">
              Report Presets
              <span className="h-px flex-1 bg-outline-variant/20" />
            </h3>

            <label className="relative block w-full max-w-sm">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary/70 text-sm">search</span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-2xl bg-surface-container-lowest py-3 pl-11 pr-4 text-sm text-on-surface outline-none ring-1 ring-outline-variant/10 transition-all placeholder:text-on-surface-variant/35 focus:ring-primary/35"
                placeholder="Search presets or schedules..."
                type="text"
                aria-label="Search reports"
              />
            </label>
          </div>

          {filteredPresets.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredPresets.map((preset) => {
                const isSelected = selectedPresetId === preset.id;

                return (
                  <div
                    key={preset.id}
                    onClick={() => setSelectedPresetId(preset.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedPresetId(preset.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    className={`group rounded-3xl border bg-surface-container p-6 text-left transition-all duration-300 ${
                      isSelected
                        ? "border-primary/20 bg-surface-container-high shadow-panel"
                        : `border-outline-variant/5 ${preset.accentBorderClass} hover:bg-surface-container-high`
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className={`rounded-2xl p-3 ${preset.iconWrapperClass}`}>
                        <span className={`material-symbols-outlined text-3xl ${preset.iconColorClass}`}>{preset.icon}</span>
                      </div>
                      <span className={`rounded-lg px-2 py-1 font-mono-data text-2xs uppercase tracking-label-md ${preset.categoryClass}`}>
                        {preset.category}
                      </span>
                    </div>
                    <h4 className={`mt-6 text-xl font-bold tracking-tight text-on-surface transition-colors ${preset.accentTextClass}`}>
                      {preset.title}
                    </h4>
                    <p className="mt-3 min-h-18 text-sm leading-7 text-on-surface-variant/72">{preset.description}</p>
                    <div className="mt-8 flex gap-3">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleExportPreset(preset, "CSV");
                        }}
                        className="flex-1 rounded-xl bg-surface-container-high px-4 py-2.5 text-2xs font-semibold uppercase tracking-label-sm text-on-surface transition-colors hover:bg-surface-container-highest"
                        aria-label={`Export ${preset.title} as CSV`}
                      >
                        Export CSV
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleExportPreset(preset, "PDF");
                        }}
                        className="flex-1 rounded-xl bg-surface-container-high px-4 py-2.5 text-2xs font-semibold uppercase tracking-label-sm text-on-surface transition-colors hover:bg-surface-container-highest"
                        aria-label={`Export ${preset.title} as PDF`}
                      >
                        Export PDF
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card className="bg-surface-container-low" padding="lg">
              <p className="text-lg font-bold text-on-surface">No report presets found.</p>
              <p className="mt-2 text-sm text-on-surface-variant/70">Try another keyword to search across report presets and automation schedules.</p>
            </Card>
          )}
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-3 text-lg font-bold tracking-tight text-on-surface">
              <span className="material-symbols-outlined text-secondary">schedule</span>
              Automation Schedules
            </h3>
            <button
              type="button"
              className="text-xs font-semibold uppercase tracking-label-md text-primary transition-colors hover:text-primary-fixed"
              aria-label="Manage report webhooks"
            >
              Manage Webhooks
            </button>
          </div>

          {filteredSchedules.length > 0 ? (
            <Table
              columns={scheduleColumns}
              data={filteredSchedules}
              onRowClick={(schedule) => setSelectedScheduleId(schedule.id)}
              footer={
                <div className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-mono-data text-2xs uppercase tracking-label-md text-on-surface-variant/45">Selected Schedule</p>
                    <p className="mt-2 text-sm font-semibold text-on-surface">{selectedSchedule?.name ?? "None selected"}</p>
                  </div>
                  {selectedSchedule ? (
                    <div className="flex items-center gap-3">
                      <Badge variant={selectedSchedule.status === "active" ? "success" : "error"} dot>
                        {selectedSchedule.status}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => toggleSchedule(selectedSchedule.id)}>
                        <span className="material-symbols-outlined text-sm text-secondary">sync</span>
                        Toggle
                      </Button>
                    </div>
                  ) : null}
                </div>
              }
            />
          ) : (
            <Card className="bg-surface-container-low" padding="lg">
              <p className="text-lg font-bold text-on-surface">No schedules match this search.</p>
              <p className="mt-2 text-sm text-on-surface-variant/70">Search terms apply to both report presets and automation schedules.</p>
            </Card>
          )}
        </section>

        <footer className="flex flex-col gap-4 border-t border-outline-variant/10 pt-8 font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/45 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-6">
            <span className="inline-flex items-center gap-2 text-success">
              <span className="glow-dot-success h-1.5 w-1.5 rounded-full bg-success" />
              All engines operational
            </span>
            <span>System load: 42%</span>
          </div>
          <p>{PRODUCT.companyName} • Build v2.4.0</p>
        </footer>
      </div>
    </AppLayout>
  );
}
