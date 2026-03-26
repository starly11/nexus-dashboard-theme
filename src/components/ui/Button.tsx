import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps): React.JSX.Element {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:pointer-events-none disabled:opacity-50";

  const variantClasses = {
    primary:
      "bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-glow hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0",
    secondary:
      "surface-button-secondary border border-outline-variant/20 text-on-surface shadow-panel hover:-translate-y-0.5 hover:border-secondary/20 hover:text-secondary",
    tertiary: "text-primary hover:bg-primary/10 hover:text-primary-fixed",
    ghost: "text-on-surface-variant hover:bg-surface-container-high hover:text-secondary",
  };

  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
