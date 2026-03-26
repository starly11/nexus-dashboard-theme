import Link from "next/link";
import { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { PRODUCT } from "@/config/product";

export interface FooterLink {
  href: string;
  label: string;
}

export interface AuthShellProps {
  brandSubtitle: string;
  children: ReactNode;
  showBrandIcon?: boolean;
  footerLinks?: FooterLink[];
  footerBadges?: string[];
  afterCard?: ReactNode;
}

export function AuthShell({
  brandSubtitle,
  children,
  showBrandIcon = false,
  footerLinks,
  footerBadges,
  afterCard,
}: AuthShellProps): React.JSX.Element {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-6 py-8 text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <div className="surface-orb surface-orb-primary -left-24 top-0 h-80 w-80 animate-float-slow opacity-90" />
      <div className="surface-orb surface-orb-secondary -right-20 top-24 h-96 w-96 animate-float-slow opacity-80" />
      <div className="surface-orb surface-orb-warm bottom-4 left-1/3 h-72 w-72 animate-pulse-soft opacity-70" />
      <div className="surface-auth-overlay absolute inset-0" />
      <div className="relative z-20 mx-auto flex w-full max-w-7xl justify-end">
        <ThemeToggle className="mt-2" />
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col justify-center">
        <div className="mx-auto flex w-full max-w-120 flex-1 flex-col justify-center py-10">
          <div className="mb-10 text-center">
            <div className={`flex items-center justify-center ${showBrandIcon ? "gap-3" : ""}`}>
              {showBrandIcon ? (
                <div className="glow-ring flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary">
                  <span className="material-symbols-outlined material-symbols-filled text-xl">hub</span>
                </div>
              ) : null}
              <span className="text-4xl font-black tracking-tight-xl text-on-surface">Nexus</span>
            </div>
            <p className="mt-3 font-mono-data text-2xs uppercase tracking-label-4xl text-outline">{brandSubtitle}</p>
          </div>

          {children}

          {afterCard ? <div className="mt-8">{afterCard}</div> : null}

          {footerBadges ? (
            <footer className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 opacity-55">
              {footerBadges.map((badge) => (
                <span key={badge} className="font-mono-data text-3xs uppercase tracking-label-3xl text-on-surface-variant">
                  {badge}
                </span>
              ))}
            </footer>
          ) : null}
        </div>
      </div>

      {footerLinks ? (
        <footer className="relative z-10 mx-auto mt-6 flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-outline-variant/10 px-2 py-4 sm:flex-row">
          <span className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45">
            © 2026 {PRODUCT.companyName}. Precision Engineered.
          </span>
          <div className="flex flex-wrap items-center justify-center gap-5 sm:justify-end">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-mono-data text-2xs uppercase tracking-label-2xl text-on-surface-variant/45 transition-colors duration-200 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </footer>
      ) : null}
    </main>
  );
}
