# Nexus SaaS Admin Dashboard

Premium Next.js admin dashboard template for SaaS products, analytics platforms, and internal operations tools.

## Overview

Nexus is a polished dark dashboard template built with:

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS v4`

It is positioned as a premium SaaS admin template and includes routes for dashboard, analytics, users, billing, reports, notifications, team, support, settings, profile, login, signup, integrations, and a UI kit.

## Quick Start

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Start the production build:

```bash
npm run start
```

## Route Structure

Main product entry:

- `/` product-facing landing page

Core demo routes:

- `/dashboard`
- `/analytics`
- `/users`
- `/billing`
- `/ui-kit`

Secondary workflow routes:

- `/reports`
- `/notifications`
- `/team`
- `/integrations`
- `/support`
- `/settings`
- `/profile`

Auth routes:

- `/login`
- `/signup`

## Tech Notes

- Styling is driven through design tokens in [`src/app/globals.css`](./src/app/globals.css) and [`tailwind.config.ts`](./tailwind.config.ts)
- Shared product branding lives in [`src/config/product.ts`](./src/config/product.ts)
- Shared demo records live in [`src/data`](./src/data)
- Shared TypeScript models live in [`src/types`](./src/types)
- The main app shell lives in [`src/components/layout/AppLayout.tsx`](./src/components/layout/AppLayout.tsx)
- The landing page used for product positioning lives in [`src/app/page.tsx`](./src/app/page.tsx)

## Customization Guide

### Change branding

Update the shared product values in:

- [`src/config/product.ts`](./src/config/product.ts)

This controls:

- product name
- tagline
- company name
- workspace ID
- support label
- demo user identity
- shared email domain

### Change colors

Update tokens in:

- [`src/app/globals.css`](./src/app/globals.css)
- [`tailwind.config.ts`](./tailwind.config.ts)

### Change landing page messaging

Edit:

- [`src/app/page.tsx`](./src/app/page.tsx)

Recommended sections to customize:

- hero headline
- buyer-fit cards
- feature highlights
- core demo module descriptions

### Change demo data

Demo records are already centralized under [`src/data`](./src/data), and the shared interfaces are in [`src/types`](./src/types). Replace those records with API-backed data and keep the page components focused on rendering and interaction.

## Documentation Files

ThemeForest packaging notes and marketplace copy:

- [`docs/themeforest-launch-kit.md`](./docs/themeforest-launch-kit.md)
- [`docs/themeforest-submission.md`](./docs/themeforest-submission.md)
- [`documentation/index.html`](./documentation/index.html)

Use that file for:

- listing title
- short description
- long description
- screenshot order
- thumbnail direction
- launch checklist

## Hydration Warning Note

If you see hydration warnings mentioning attributes like:

- `data-new-gr-c-s-check-loaded`
- `data-gr-ext-installed`

that usually comes from browser extensions such as Grammarly injecting attributes into the page before React hydrates. That is not a template logic bug.

## Best Use Cases

This template is best suited for:

- SaaS admin dashboards
- analytics and reporting products
- CRM or internal operations tools
- billing and account management platforms

## License / Packaging Reminder

Before publishing on ThemeForest:

- capture polished screenshots for the main routes
- include setup docs
- keep the listing positioned as a SaaS admin template
- avoid marketing it as a dashboard for every possible niche
