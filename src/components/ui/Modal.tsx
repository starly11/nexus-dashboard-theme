"use client";

import React, { ReactNode, useEffect, useId, useRef } from "react";
import { getFocusableElements } from "@/lib/accessibility";
import { Card } from "./Card";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  label: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
  closeLabel?: string;
}

export function Modal({
  isOpen,
  onClose,
  label,
  title,
  description,
  children,
  className = "",
  panelClassName = "",
  closeLabel = "Close modal",
}: ModalProps): React.JSX.Element | null {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen || !containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const focusableElements = getFocusableElements(container);

    document.body.style.overflow = "hidden";
    (focusableElements[0] ?? container).focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const currentFocusableElements = getFocusableElements(container);

      if (currentFocusableElements.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const firstElement = currentFocusableElements[0];
      const lastElement = currentFocusableElements[currentFocusableElements.length - 1];
      const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-md"
        onClick={onClose}
        aria-label={closeLabel}
      />
      <div
        ref={containerRef}
        className={`relative z-10 w-full max-w-xl ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
      >
        <Card className={panelClassName} padding="lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono-data text-2xs uppercase tracking-label-2xl text-primary">{label}</p>
              <h3 id={titleId} className="mt-2 text-2xl font-bold tracking-tight text-on-surface">
                {title}
              </h3>
              {description ? (
                <p id={descriptionId} className="mt-2 text-sm text-on-surface-variant/70">
                  {description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
              aria-label={closeLabel}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {children}
        </Card>
      </div>
    </div>
  );
}
