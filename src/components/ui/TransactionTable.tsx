import React from "react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Table, TableColumn } from "./Table";

export interface Transaction {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
  initials?: string;
}

export interface TransactionTableProps {
  transactions: Transaction[];
  className?: string;
  title?: string;
  description?: string;
  filterLabel?: string;
}

function getTransactionTone(status: Transaction["status"]): {
  avatarClass: string;
  amountClass: string;
  rowDotClass: string;
} {
  if (status === "Paid") {
    return {
      avatarClass: "from-success/28 to-secondary/25 text-success",
      amountClass: "text-success",
      rowDotClass: "glow-dot-success bg-success",
    };
  }

  if (status === "Failed") {
    return {
      avatarClass: "from-error/24 to-accent-plum/20 text-error",
      amountClass: "text-error",
      rowDotClass: "glow-dot-error bg-error",
    };
  }

  return {
    avatarClass: "from-warning/26 to-accent-orange/22 text-warning",
    amountClass: "text-warning",
    rowDotClass: "glow-dot-warning bg-warning",
  };
}

export function TransactionTable({
  transactions,
  className = "",
  title = "Recent Transactions",
  description = "Overview of the latest processing events and subscription payments.",
  filterLabel = "Filter",
}: TransactionTableProps): React.JSX.Element {
  const columns = React.useMemo<TableColumn<Transaction>[]>(
    () => [
      {
        key: "id",
        header: "Transaction ID",
        render: (value, item) => {
          const tone = getTransactionTone(item.status);

          return (
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${tone.rowDotClass}`} />
              <span className="font-mono-data text-xs text-secondary/90">{String(value ?? "")}</span>
            </div>
          );
        },
      },
      {
        key: "customer",
        header: "Customer",
        render: (value, item) => {
          const tone = getTransactionTone(item.status);

          return (
            <div className="flex items-center gap-3">
              <div
                className={`metric-card-icon-shell flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr text-tiny font-bold ${tone.avatarClass}`}
              >
                {item.initials || String(value ?? "").slice(0, 2).toUpperCase()}
              </div>
              <span className="text-sm font-semibold tracking-tight text-on-surface">{String(value ?? "")}</span>
            </div>
          );
        },
      },
      {
        key: "date",
        header: "Date",
        render: (value) => <span className="text-sm text-tertiary">{String(value ?? "")}</span>,
      },
      {
        key: "amount",
        header: "Amount",
        className: "text-right",
        render: (value, item) => (
          <span className={`font-mono-data text-sm font-bold ${getTransactionTone(item.status).amountClass}`}>{String(value ?? "")}</span>
        ),
      },
      {
        key: "status",
        header: "Status",
        className: "text-center",
        render: (_, item) => {
          const statusConfig: Record<Transaction["status"], { variant: "success" | "warning" | "error"; label: string }> = {
            Paid: { variant: "success", label: "Paid" },
            Pending: { variant: "warning", label: "Pending" },
            Failed: { variant: "error", label: "Failed" },
          };

          const config = statusConfig[item.status];

          return (
            <Badge variant={config.variant} size="sm" dot>
              {config.label}
            </Badge>
          );
        },
      },
      {
        key: "actions",
        header: "",
        render: () => (
          <button
            type="button"
            className="rounded-lg p-2 text-secondary/60 transition-colors hover:bg-surface-container-high hover:text-secondary"
            aria-label="Open transaction actions"
          >
            <span className="material-symbols-outlined text-lg">more_horiz</span>
          </button>
        ),
      },
    ],
    []
  );

  return (
    <Table
      title={title}
      description={description}
      columns={columns}
      data={transactions}
      className={className}
      actions={
        <Button variant="secondary" size="sm">
          <span className="material-symbols-outlined text-lg">filter_list</span>
          {filterLabel}
        </Button>
      }
    />
  );
}
