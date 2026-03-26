import { GoogleMark } from "@/components/auth/GoogleMark";

export interface AuthProviderButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
  iconClassName?: string;
}

export function AuthProviderButton({
  label,
  onClick,
  className = "",
  iconClassName,
}: AuthProviderButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-label={label}
    >
      <GoogleMark className={iconClassName} />
      {label}
    </button>
  );
}
