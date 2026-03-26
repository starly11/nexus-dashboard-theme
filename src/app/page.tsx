import Link from "next/link";
import { PRODUCT } from "@/config/product";
import { landingBuyerFit, landingFeaturePillars, landingModules, landingSellingPoints } from "@/data/landing";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function HomePage(): React.JSX.Element {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-6 py-8 text-on-surface">
      <div className="surface-orb surface-orb-primary -left-20 top-0 h-80 w-80 animate-float-slow" />
      <div className="surface-orb surface-orb-secondary right-0 top-16 h-96 w-96 animate-float-slow" />
      <div className="surface-orb surface-orb-success bottom-12 left-1/4 h-72 w-72 animate-pulse-soft" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="surface-frost-header flex flex-col gap-5 rounded-hero border border-outline-variant/12 px-6 py-5 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="glow-ring flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary">
              <span className="material-symbols-outlined material-symbols-filled text-2xl">hub</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">{PRODUCT.fullName}</h1>
              <p className="font-mono-data text-2xs uppercase tracking-label-4xl text-primary/70">{PRODUCT.category}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold tracking-tight text-on-surface-variant transition-all duration-300 hover:bg-surface-container-high hover:text-on-surface"
            >
              Login Demo
            </Link>
            <Link
              href="/signup"
              className="surface-button-secondary inline-flex h-11 items-center justify-center rounded-xl border border-outline-variant/20 px-4 text-sm font-semibold tracking-tight text-on-surface shadow-panel transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/20 hover:text-secondary"
            >
              Signup Flow
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container px-4 text-sm font-semibold tracking-tight text-on-primary shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
            >
              Open Dashboard Demo
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="nocturnal-glass relative overflow-hidden rounded-hero border border-outline-variant/12 px-7 py-8 lg:px-10 lg:py-10">
            <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-primary/10 via-secondary/5 to-transparent lg:block" />
            <div className="relative max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="success" dot>
                  Clear SaaS Positioning
                </Badge>
                <Badge variant="info" dot>
                  ThemeForest-ready demo structure
                </Badge>
              </div>
              <h2 className="mt-5 text-4xl font-black tracking-tight-md lg:text-6xl">
                {PRODUCT.name} is built to sell as a <span className="text-gradient-primary">SaaS admin dashboard</span>, not a random all-purpose UI kit.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-on-surface-variant/82">{PRODUCT.tagline}</p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-on-surface-variant/72">{PRODUCT.shortDescription}</p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-container px-6 text-base font-semibold tracking-tight text-on-primary shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
                >
                  <span className="material-symbols-outlined text-lg">dashboard</span>
                  Launch Core Demo
                </Link>
                <Link
                  href="/analytics"
                  className="surface-button-secondary inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-outline-variant/20 px-6 text-base font-semibold tracking-tight text-on-surface shadow-panel transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/20 hover:text-secondary"
                >
                  <span className="material-symbols-outlined text-lg">insights</span>
                  Explore Analytics
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {landingBuyerFit.map((item) => (
              <Card key={item.title} className={`rounded-tile ${item.tone}`} padding="lg">
                <p className="font-mono-data text-2xs uppercase tracking-label-3xl text-on-surface-variant/48">Best Fit</p>
                <h3 className="mt-3 text-2xl font-black tracking-tight text-on-surface">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant/78">{item.text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          {landingSellingPoints.map((point) => (
            <Card key={point} className="rounded-[1.5rem]" padding="lg">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-success/12 text-success">
                  <span className="material-symbols-outlined">done_all</span>
                </div>
                <p className="text-sm leading-7 text-on-surface-variant/84">{point}</p>
              </div>
            </Card>
          ))}
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <p className="font-mono-data text-2xs uppercase tracking-label-4xl text-on-surface-variant/48">Feature Highlights</p>
            <h3 className="mt-2 text-3xl font-black tracking-tight-sm">Everything buyers expect from a premium admin template.</h3>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {landingFeaturePillars.map((feature) => (
              <Card key={feature.title} className="group h-full rounded-tile" padding="lg">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 ${feature.shellClass} ${feature.iconClass}`}>
                  <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
                </div>
                <h4 className="mt-5 text-xl font-bold tracking-tight text-on-surface">{feature.title}</h4>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant/78">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono-data text-2xs uppercase tracking-label-4xl text-on-surface-variant/48">Core Demo Modules</p>
              <h3 className="mt-2 text-3xl font-black tracking-tight-sm">Show buyers the most important pages first.</h3>
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {landingModules.map((module) => (
              <Link key={module.title} href={module.href} className="block">
                <Card className="group h-full rounded-tile" padding="lg">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 ${module.accentShell} ${module.accent}`}>
                    <span className="material-symbols-outlined text-2xl">{module.icon}</span>
                  </div>
                  <h4 className="mt-5 text-xl font-bold tracking-tight text-on-surface">{module.title}</h4>
                  <p className="mt-3 text-sm leading-7 text-on-surface-variant/78">{module.description}</p>
                  <div className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${module.accent}`}>
                    Open demo
                    <span className="material-symbols-outlined text-lg transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="surface-hero-feature mt-10 grid gap-6 rounded-hero border border-outline-variant/12 p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-mono-data text-2xs uppercase tracking-label-4xl text-on-surface-variant/48">Buyer Story</p>
            <h3 className="mt-3 text-3xl font-black tracking-tight-sm">One product, one clear message.</h3>
            <p className="mt-4 text-sm leading-7 text-on-surface-variant/80">{PRODUCT.shortDescription}</p>
          </div>
          <div className="grid gap-4">
            {PRODUCT.audience.map((item) => (
              <div key={item} className="rounded-feature border border-outline-variant/10 bg-black/10 px-5 py-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-0.5 text-secondary">verified</span>
                  <p className="text-sm leading-7 text-on-surface-variant/82">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
