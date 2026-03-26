export interface AuthStatusMessageProps {
  message: string;
  tone?: "primary" | "secondary";
}

export function AuthStatusMessage({
  message,
  tone = "primary",
}: AuthStatusMessageProps): React.JSX.Element {
  const toneClass =
    tone === "secondary"
      ? "border-secondary/10 bg-secondary/5"
      : "border-primary/10 bg-primary/5";

  return (
    <div className={`mt-5 rounded-xl border px-4 py-3 text-sm text-on-surface-variant ${toneClass}`}>
      {message}
    </div>
  );
}
