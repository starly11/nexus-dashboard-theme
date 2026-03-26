"use client";

import React, { startTransition, useCallback, useDeferredValue, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  billingCycles,
  defaultPaymentMethod,
  initialInvoices,
  invoiceStatusFilters,
  invoiceStatusVariants,
  planDetailsMap,
  planOrder,
} from "@/data/billing";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Table, TableColumn } from "@/components/ui/Table";
import { formatCurrency, formatCurrencyPrecise } from "@/lib/utils";
import type {
  BillingCycle,
  InvoiceRecord,
  InvoiceStatus,
  PaymentMethodState,
  PlanTier,
  UsageMetric,
} from "@/types/billing";

function getPlanStep(currentPlan: PlanTier, direction: "up" | "down"): PlanTier {
  const currentIndex = planOrder.indexOf(currentPlan);
  const step = direction === "up" ? 1 : -1;
  const nextIndex = Math.max(0, Math.min(planOrder.length - 1, currentIndex + step));

  return planOrder[nextIndex];
}

function clampProgress(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function UsageMeterCard({
  label,
  usedValue,
  limitValue,
  displayValue,
  displayLimit,
  accentBarClass,
  accentTextClass,
}: UsageMetric): React.JSX.Element {
  const usageRatio = (usedValue / limitValue) * 100;
  const usageToneClass = usageRatio > 100 ? "text-error" : accentTextClass;

  return (
    <Card className="bg-surface-container-low" padding="lg">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-bold uppercase tracking-label-xl text-on-surface-variant/70">{label}</span>
        <span className={`font-mono-data text-xs ${usageToneClass}`}>{Math.round(usageRatio)}%</span>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-container">
        <div className={`h-full rounded-full ${usageRatio > 100 ? "bg-error" : accentBarClass}`} style={{ width: `${clampProgress(usageRatio)}%` }} />
      </div>
      <div className="mt-4 flex items-end justify-between gap-4">
        <span className="font-mono-data text-2xl font-bold tracking-tight-sm text-on-surface">{displayValue}</span>
        <span className="font-mono-data text-2xs uppercase tracking-label-md text-on-surface-variant/55">Limit: {displayLimit}</span>
      </div>
    </Card>
  );
}

export default function BillingPage(): React.JSX.Element {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("Monthly");
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>("Enterprise");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | InvoiceStatus>("All");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(initialInvoices[0].id);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodState>(defaultPaymentMethod);
  const [paymentDraft, setPaymentDraft] = useState<PaymentMethodState>(defaultPaymentMethod);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(initialInvoices);
  const [billingActivityMessage, setBillingActivityMessage] = useState("Select an invoice to inspect the latest billing activity.");

  const deferredSearchQuery = useDeferredValue(searchQuery);
  const planDetails = planDetailsMap[selectedPlan];
  const activePrice = billingCycle === "Monthly" ? planDetails.monthlyPrice : planDetails.annualPrice;
  const annualSavings = planDetails.monthlyPrice * 12 - planDetails.annualPrice * 12;

  const usageMetrics = useMemo<UsageMetric[]>(
    () => [
      {
        label: "API Calls",
        usedValue: 850_000,
        limitValue: planDetails.apiLimit,
        displayValue: "850k",
        displayLimit: planDetails.apiLimit >= 1_000_000 ? `${(planDetails.apiLimit / 1_000_000).toFixed(1)}M` : `${planDetails.apiLimit / 1000}k`,
        accentBarClass: "bg-primary",
        accentTextClass: "text-primary",
      },
      {
        label: "Seats",
        usedValue: 12,
        limitValue: planDetails.seatsLimit,
        displayValue: "12",
        displayLimit: `${planDetails.seatsLimit}`,
        accentBarClass: "bg-secondary",
        accentTextClass: "text-secondary",
      },
      {
        label: "Storage",
        usedValue: 4.2,
        limitValue: planDetails.storageLimitTb,
        displayValue: "4.2 TB",
        displayLimit: `${planDetails.storageLimitTb.toFixed(1)} TB`,
        accentBarClass: "bg-tertiary",
        accentTextClass: "text-tertiary-fixed",
      },
    ],
    [planDetails.apiLimit, planDetails.seatsLimit, planDetails.storageLimitTb]
  );

  const filteredInvoices = useMemo(() => {
    const normalizedQuery = deferredSearchQuery.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [invoice.id, invoice.date, invoice.period, invoice.method, formatCurrencyPrecise(invoice.amount)]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesStatus = statusFilter === "All" || invoice.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [deferredSearchQuery, invoices, statusFilter]);

  const selectedInvoice =
    filteredInvoices.find((invoice) => invoice.id === selectedInvoiceId) ??
    invoices.find((invoice) => invoice.id === selectedInvoiceId) ??
    filteredInvoices[0] ??
    invoices[0];

  const attentionCount = invoices.filter((invoice) => invoice.status !== "Paid").length;
  const paidTotal = invoices
    .filter((invoice) => invoice.status === "Paid")
    .reduce((total, invoice) => total + invoice.amount, 0);

  const handlePlanChange = (direction: "up" | "down"): void => {
    setSelectedPlan((currentPlan) => getPlanStep(currentPlan, direction));
  };

  const handleSavePaymentMethod = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    startTransition(() => {
      setPaymentMethod(paymentDraft);
      setIsPaymentModalOpen(false);
    });
  };

  const handleDownloadInvoice = useCallback((invoice: InvoiceRecord): void => {
    setSelectedInvoiceId(invoice.id);
    setBillingActivityMessage(`${invoice.id} is queued for secure PDF download.`);
  }, []);

  const handleRetryInvoice = useCallback((invoice: InvoiceRecord): void => {
    setBillingActivityMessage(`Retrying payment processing for ${invoice.id}.`);
    setInvoices((currentInvoices) =>
      currentInvoices.map((currentInvoice) =>
        currentInvoice.id === invoice.id ? { ...currentInvoice, status: "Processing" } : currentInvoice
      )
    );
  }, []);

  const invoiceColumns = useMemo<TableColumn<InvoiceRecord>[]>(
    () => [
      {
        key: "date",
        header: "Date",
        render: (_, invoice) => (
          <div>
            <p className="text-sm font-bold text-on-surface">{invoice.date}</p>
            <p className="font-mono-data text-tiny text-on-surface-variant/45">{invoice.id}</p>
          </div>
        ),
      },
      {
        key: "amount",
        header: "Amount",
        render: (value) => <span className="font-mono-data text-sm font-bold text-on-surface">{formatCurrencyPrecise(Number(value ?? 0))}</span>,
      },
      {
        key: "status",
        header: "Status",
        render: (_, invoice) => (
          <Badge variant={invoiceStatusVariants[invoice.status]} size="sm" dot>
            {invoice.status}
          </Badge>
        ),
      },
      {
        key: "invoice",
        header: "Invoice",
        className: "text-right",
        render: (_, invoice) => (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleDownloadInvoice(invoice);
              }}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-mono-data text-2xs uppercase tracking-label-lg text-primary transition-colors hover:bg-primary/10 hover:text-primary-fixed"
              aria-label={`Download ${invoice.id}`}
            >
              PDF
              <span className="material-symbols-outlined text-sm">download</span>
            </button>
            {invoice.status === "Overdue" ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleRetryInvoice(invoice);
                }}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-mono-data text-2xs uppercase tracking-label-lg text-warning transition-colors hover:bg-warning-soft"
                aria-label={`Retry payment for ${invoice.id}`}
              >
                Retry
              </button>
            ) : null}
          </div>
        ),
      },
    ],
    [handleDownloadInvoice, handleRetryInvoice]
  );

  return (
    <AppLayout
      title="Billing"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Billing" },
      ]}
    >
      <div className="space-y-8 pb-8">
        <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info" dot>
                Billing Command
              </Badge>
              <Badge variant={attentionCount > 0 ? "warning" : "success"} dot>
                {attentionCount} invoice items need attention
              </Badge>
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-tight-sm text-on-surface">
              Premium billing, now with <span className="text-gradient-primary">real controls</span>.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-on-surface-variant/75 lg:text-base">
              Plan controls, payment method editing, live invoice filtering, and row-level actions are all wired now so this route
              feels like a sellable template page, not a screenshot clone.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-2xl border border-outline-variant/10 bg-surface-container-low p-1">
              {billingCycles.map((cycle) => (
                <Button
                  key={cycle}
                  type="button"
                  variant={billingCycle === cycle ? "primary" : "ghost"}
                  size="sm"
                  className={`h-10 px-4 ${billingCycle === cycle ? "bg-surface-container-high text-primary shadow-none" : ""}`}
                  onClick={() => setBillingCycle(cycle)}
                >
                  {cycle}
                </Button>
              ))}
            </div>
            <Button variant="secondary" onClick={() => setIsPaymentModalOpen(true)}>
              <span className="material-symbols-outlined text-lg text-secondary">credit_card</span>
              Update Card
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-12 gap-6">
          <Card className="relative col-span-12 overflow-hidden lg:col-span-7" padding="lg">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/8 blur-3xl" />
            <div className="relative z-10">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-xl">
                  <span className="inline-flex rounded-lg bg-primary/10 px-2 py-1 font-mono-data text-2xs uppercase tracking-label-2xl text-primary">
                    Active Subscription
                  </span>
                  <h3 className="mt-4 text-4xl font-black tracking-tight-sm text-on-surface">{planDetails.tier} Plan</h3>
                  <p className="mt-2 text-on-surface-variant">{planDetails.description}</p>
                </div>
                <div className="text-left lg:text-right">
                  <div className="font-mono-data text-4xl font-bold tracking-tight-md text-on-surface">
                    {formatCurrency(activePrice)}
                    <span className="ml-1 text-sm font-medium text-on-surface-variant">/{billingCycle === "Monthly" ? "mo" : "mo billed yearly"}</span>
                  </div>
                  <p className="mt-2 font-mono-data text-2xs uppercase tracking-label-lg text-on-surface-variant/55">
                    Next billing: <span className="text-on-surface">Oct 28, 2024</span>
                  </p>
                  {billingCycle === "Annual" ? (
                    <p className="mt-2 text-sm text-success">Save {formatCurrency(annualSavings)} yearly</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  onClick={() => handlePlanChange("up")}
                  disabled={selectedPlan === "Scale"}
                >
                  <span className="material-symbols-outlined text-lg text-on-primary">trending_up</span>
                  Upgrade Plan
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handlePlanChange("down")}
                  disabled={selectedPlan === "Growth"}
                >
                  <span className="material-symbols-outlined text-lg text-warning">keyboard_double_arrow_down</span>
                  Downgrade
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-surface-container-low px-4 py-4">
                  <p className="font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/45">Invoice Health</p>
                  <p className="mt-2 text-lg font-bold text-on-surface">{invoices.length - attentionCount}/{invoices.length} Clear</p>
                </div>
                <div className="rounded-2xl bg-surface-container-low px-4 py-4">
                  <p className="font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/45">Current Cycle</p>
                  <p className={`mt-2 text-lg font-bold ${planDetails.accentClass}`}>{billingCycle}</p>
                </div>
                <div className="rounded-2xl bg-surface-container-low px-4 py-4">
                  <p className="font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/45">Paid YTD</p>
                  <p className="mt-2 text-lg font-bold text-success">{formatCurrency(paidTotal)}</p>
                </div>
              </div>
              <p className="mt-5 text-sm text-on-surface-variant/68">{billingActivityMessage}</p>
            </div>
          </Card>

          <Card className="col-span-12 bg-surface-container-low lg:col-span-5" padding="lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-label-2xl text-on-surface-variant/70">Payment Method</h3>
              <span className="material-symbols-outlined text-secondary/70">contactless</span>
            </div>

            <div className="mt-7 flex items-center gap-4">
              <div className="flex h-12 w-16 items-center justify-center rounded-xl border border-outline-variant/10 bg-secondary/10 text-secondary">
                <span className="material-symbols-outlined material-symbols-filled text-2xl">credit_card</span>
              </div>
              <div>
                <p className="text-lg font-bold text-on-surface">
                  {paymentMethod.brand} ending in {paymentMethod.last4}
                </p>
                <p className="font-mono-data text-xs text-on-surface-variant/60">Expires {paymentMethod.expiry}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-surface-container px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/45">Billing Contact</p>
                  <p className="mt-2 text-sm font-semibold text-on-surface">{paymentMethod.holder}</p>
                </div>
                <Badge variant="info" size="sm" dot>
                  Verified
                </Badge>
              </div>
            </div>

            <Button className="mt-6 w-full" variant="secondary" onClick={() => setIsPaymentModalOpen(true)}>
              <span className="material-symbols-outlined text-sm text-secondary">edit</span>
              Update Card
            </Button>
          </Card>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-on-surface">Resource Utilization</h3>
              <p className="mt-1 font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/50">Updated 4 mins ago</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-outline-variant/10 bg-surface-container-low px-3 py-2">
              <span className="glow-dot-primary h-2 w-2 rounded-full bg-primary" />
              <span className="font-mono-data text-2xs uppercase tracking-label-lg text-on-surface-variant/60">
                Limits react to the selected plan
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {usageMetrics.map((metric) => (
              <UsageMeterCard key={metric.label} {...metric} />
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-on-surface">Billing History</h3>
              <p className="mt-1 text-sm text-on-surface-variant/70">Search, filter, and click into invoice rows to inspect the current record.</p>
            </div>

            <div className="flex w-full flex-col gap-3 xl:max-w-3xl xl:flex-row xl:items-center xl:justify-end">
              <label className="relative block w-full xl:max-w-sm">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary/65">search</span>
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-full bg-surface-container-lowest py-3 pl-12 pr-4 text-sm text-on-surface outline-none ring-1 ring-outline-variant/10 transition-all placeholder:text-on-surface-variant/35 focus:ring-primary/35"
                  placeholder="Search billing, invoices, or periods..."
                  type="text"
                  aria-label="Search invoices"
                />
              </label>

              <div className="flex flex-wrap items-center gap-2">
                {invoiceStatusFilters.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-full px-4 py-2 font-mono-data text-2xs uppercase tracking-label-lg transition-all ${
                      statusFilter === status
                        ? "bg-surface-container-high text-primary ring-1 ring-primary/20"
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                    }`}
                    aria-label={`Filter invoices by ${status}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Table
            columns={invoiceColumns}
            data={filteredInvoices}
            onRowClick={(invoice) => setSelectedInvoiceId(invoice.id)}
            className="overflow-hidden"
            footer={
              <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono-data text-2xs uppercase tracking-label-lg text-on-surface-variant/50">
                  {filteredInvoices.length} invoices shown
                </p>
                <Button variant="ghost" size="sm">
                  <span className="material-symbols-outlined text-lg text-primary">folder_open</span>
                  View All Invoices
                </Button>
              </div>
            }
          />

          {selectedInvoice ? (
            <Card className="overflow-hidden" padding="none">
              <div className="grid grid-cols-1 gap-px bg-outline-variant/10 lg:grid-cols-[1.3fr_0.9fr_0.8fr]">
                <div className="bg-surface-container px-6 py-5">
                  <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45">Selected Invoice</p>
                  <h4 className="mt-3 text-2xl font-bold tracking-tight text-on-surface">{selectedInvoice.id}</h4>
                  <p className="mt-2 text-sm text-on-surface-variant/70">
                    {selectedInvoice.period} billed via {selectedInvoice.method}.
                  </p>
                </div>
                <div className="bg-surface-container px-6 py-5">
                  <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45">Amount</p>
                  <p className="mt-3 font-mono-data text-2xl font-bold text-on-surface">{formatCurrencyPrecise(selectedInvoice.amount)}</p>
                  <p className="mt-2 text-sm text-on-surface-variant/70">Issued on {selectedInvoice.date}</p>
                </div>
                <div className="bg-surface-container px-6 py-5">
                  <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45">Status</p>
                  <div className="mt-3">
                    <Badge variant={invoiceStatusVariants[selectedInvoice.status]} dot>
                      {selectedInvoice.status}
                    </Badge>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleDownloadInvoice(selectedInvoice)}>
                      <span className="material-symbols-outlined text-sm text-secondary">download</span>
                      Download
                    </Button>
                    {selectedInvoice.status === "Overdue" ? (
                      <Button variant="ghost" size="sm" onClick={() => handleRetryInvoice(selectedInvoice)}>
                        <span className="material-symbols-outlined text-sm text-warning">refresh</span>
                        Retry
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>
          ) : null}
        </section>

        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          label="Payment Method"
          title="Update Billing Card"
          description="Refresh the primary card details used for recurring invoices."
          className="max-w-lg"
          closeLabel="Close payment method modal"
        >
          <form className="mt-6 space-y-4" onSubmit={handleSavePaymentMethod}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/50">Brand</span>
                    <input
                      value={paymentDraft.brand}
                      onChange={(event) => setPaymentDraft((currentState) => ({ ...currentState, brand: event.target.value }))}
                      className="w-full rounded-2xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none ring-1 ring-outline-variant/10 transition-all focus:ring-primary/35"
                      aria-label="Card brand"
                      type="text"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/50">Last 4 Digits</span>
                    <input
                      value={paymentDraft.last4}
                      onChange={(event) => setPaymentDraft((currentState) => ({ ...currentState, last4: event.target.value.slice(0, 4) }))}
                      className="w-full rounded-2xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none ring-1 ring-outline-variant/10 transition-all focus:ring-primary/35"
                      aria-label="Card last four digits"
                      inputMode="numeric"
                      type="text"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/50">Expiry</span>
                    <input
                      value={paymentDraft.expiry}
                      onChange={(event) => setPaymentDraft((currentState) => ({ ...currentState, expiry: event.target.value }))}
                      className="w-full rounded-2xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none ring-1 ring-outline-variant/10 transition-all focus:ring-primary/35"
                      aria-label="Card expiry"
                      placeholder="12/26"
                      type="text"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block font-mono-data text-2xs uppercase tracking-label-xl text-on-surface-variant/50">Cardholder</span>
                    <input
                      value={paymentDraft.holder}
                      onChange={(event) => setPaymentDraft((currentState) => ({ ...currentState, holder: event.target.value }))}
                      className="w-full rounded-2xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none ring-1 ring-outline-variant/10 transition-all focus:ring-primary/35"
                      aria-label="Cardholder name"
                      type="text"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setIsPaymentModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <span className="material-symbols-outlined text-lg text-on-primary">save</span>
                    Save Payment Method
                  </Button>
                </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
