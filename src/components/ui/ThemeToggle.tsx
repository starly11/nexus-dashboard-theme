"use client";

import { useThemeContext } from "@/components/layout/ThemeContext";

export interface ThemeToggleProps {
  className?: string;
  variant?: "surface" | "ghost";
  showLabel?: boolean;
}

export function ThemeToggle({
  className = "",
  variant = "surface",
  showLabel = true,
}: ThemeToggleProps): React.JSX.Element {
  const { theme, toggleTheme } = useThemeContext();

  const variantClass =
    variant === "ghost"
      ? "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
      : "border border-outline-variant/15 bg-surface-container-low text-on-surface shadow-panel hover:border-primary/15 hover:bg-surface-container-high";
  const label = theme === "dark" ? "Switch to Light" : "Switch to Dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold tracking-tight transition-all duration-300 ${variantClass} ${className}`}
      aria-label="Toggle color theme"
    >
      <span className="material-symbols-outlined text-lg text-secondary">contrast</span>
      {showLabel ? <span suppressHydrationWarning>{label}</span> : null}
    </button>
  );
}
