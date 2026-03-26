"use client";

export interface PasswordVisibilityButtonProps {
  isVisible: boolean;
  showLabel: string;
  hideLabel: string;
  onToggle: () => void;
}

export function PasswordVisibilityButton({
  isVisible,
  showLabel,
  hideLabel,
  onToggle,
}: PasswordVisibilityButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-full p-1 text-outline/60 transition-colors duration-200 hover:text-primary"
      aria-label={isVisible ? hideLabel : showLabel}
    >
      <span className="material-symbols-outlined text-lg">{isVisible ? "visibility_off" : "visibility"}</span>
    </button>
  );
}
