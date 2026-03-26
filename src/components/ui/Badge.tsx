import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  children: React.ReactNode;
  dot?: boolean;
}

function BadgeComponent({
  variant = "default",
  size = "md",
  dot = false,
  className = "",
  children,
  ...props
}: BadgeProps): React.JSX.Element {
  const baseClasses = "inline-flex items-center gap-1.5 rounded-full border font-mono-data font-semibold uppercase tracking-label-md";

  const variantClasses = {
    default: "border-outline-variant/10 bg-surface-container-highest text-on-surface-variant",
    success: "badge-surface-success border-success/30 text-success",
    warning: "badge-surface-warning border-warning/30 text-warning",
    error: "badge-surface-error border-error/30 text-error",
    info: "badge-surface-info border-secondary/28 text-secondary",
  };

  const sizeClasses = {
    sm: "px-2.5 py-1 text-2xs",
    md: "px-3 py-1 text-2xs",
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {dot ? <span className="h-2 w-2 rounded-full bg-current shadow-[0_0_14px_currentColor]" /> : null}
      {children}
    </span>
  );
}

BadgeComponent.displayName = "Badge";

export const Badge = React.memo(BadgeComponent);
