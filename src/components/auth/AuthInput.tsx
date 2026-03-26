"use client";

export interface AuthInputProps {
  id: string;
  label: string;
  name: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  icon?: string;
  autoComplete?: string;
  error?: string | null;
  rightElement?: React.ReactNode;
  hideLabel?: boolean;
}

export function AuthInput({
  id,
  label,
  name,
  type,
  value,
  placeholder,
  onChange,
  icon,
  autoComplete,
  error,
  rightElement,
  hideLabel = false,
}: AuthInputProps): React.JSX.Element {
  return (
    <label className="block space-y-2" htmlFor={id}>
      {hideLabel ? null : (
        <span className="ml-1 block font-mono-data text-2xs uppercase tracking-label-4xl text-outline">
          {label}
        </span>
      )}
      <span className="group relative block">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(event): void => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-xl border border-transparent bg-surface-container-lowest px-4 py-3.5 text-sm text-on-surface outline-none transition-all duration-200 placeholder:text-outline/35 focus:border-primary/20 focus:ring-2 focus:ring-primary/20 ${
            icon || rightElement ? "pr-12" : ""
          } ${error ? "border-error/35 ring-2 ring-error/15" : ""}`}
        />
        {icon ? (
          <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-outline/45 transition-colors duration-200 group-focus-within:text-primary">
            {icon}
          </span>
        ) : null}
        {rightElement ? (
          <span className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center">{rightElement}</span>
        ) : null}
      </span>
      {error ? (
        <span id={`${id}-error`} className="block pl-1 text-xs text-error">
          {error}
        </span>
      ) : null}
    </label>
  );
}
