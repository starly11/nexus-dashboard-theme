import React from "react";
import type { StatusBadgeValue } from "@/types/status";
import { Badge } from "./Badge";

const STATUS_VARIANTS: Record<StatusBadgeValue, { label: string; variant: "success" | "warning" | "error" | "default" | "info" }> = {
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "error" },
  pending: { label: "Pending", variant: "warning" },
  error: { label: "Error", variant: "error" },
  invited: { label: "Invited", variant: "info" },
};

export interface StatusBadgeProps {
  status: StatusBadgeValue;
  className?: string;
}

function StatusBadgeComponent({ status, className = "" }: StatusBadgeProps): React.JSX.Element {
  const config = STATUS_VARIANTS[status];

  return (
    <Badge variant={config.variant} size="sm" dot className={className}>
      {config.label}
    </Badge>
  );
}

StatusBadgeComponent.displayName = "StatusBadge";

export const StatusBadge = React.memo(StatusBadgeComponent);
