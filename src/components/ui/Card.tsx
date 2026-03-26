import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  variant = "default",
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps): React.JSX.Element {
  const baseClasses = "rounded-2xl border transition-all duration-300";

  const variantClasses = {
    default:
      "stitch-panel card-hover-lift border-outline-variant/10 hover:-translate-y-0.5 hover:border-secondary/18",
    elevated: "bg-surface-container-high border-outline-variant/15 shadow-panel hover:-translate-y-0.5 hover:border-warning/18",
    outlined: "bg-surface border-outline-variant/20",
  };

  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardHeader({ className = "", children, ...props }: CardHeaderProps): React.JSX.Element {
  return (
    <div className={`flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function CardTitle({ className = "", children, ...props }: CardTitleProps): React.JSX.Element {
  return (
    <h3 className={`text-base font-bold tracking-tight text-on-surface ${className}`} {...props}>
      {children}
    </h3>
  );
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function CardDescription({ className = "", children, ...props }: CardDescriptionProps): React.JSX.Element {
  return (
    <p className={`text-sm text-on-surface-variant/70 ${className}`} {...props}>
      {children}
    </p>
  );
}
