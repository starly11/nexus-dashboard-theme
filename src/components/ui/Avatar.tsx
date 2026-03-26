import Image from "next/image";
import React from "react";

export interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-2xs",
  md: "h-10 w-10 text-tiny",
  lg: "h-12 w-12 text-xs",
};

function AvatarComponent({
  src,
  name,
  size = "md",
  className = "",
}: AvatarProps): React.JSX.Element {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={48}
        height={48}
        className={`rounded-xl object-cover ring-1 ring-primary/15 ${SIZE_CLASSES[size]} ${className}`}
      />
    );
  }

  return (
    <div
      aria-label={name}
      className={`flex items-center justify-center rounded-xl bg-gradient-to-tr from-surface-bright to-surface-container-highest font-bold text-primary shadow-glow ${SIZE_CLASSES[size]} ${className}`}
    >
      {initials}
    </div>
  );
}

AvatarComponent.displayName = "Avatar";

export const Avatar = React.memo(AvatarComponent);
