# Alvo Frontend Architectural Guidelines

## 1. Purpose

This document is the single source of truth for how every Alvo frontend project is built. All five apps live in **one repository** and are deployed to separate Cloudflare Pages projects on their own subdomains. It is derived from the **RIXL Dashboard** baseline and adapted for five products:

1. **Website** — public marketing site, minimal dynamic data.
2. **Admin Webapp** — internal operations and configuration.
3. **Business Webapp** — B2B partner portal.
4. **Courier PWA** — courier mobile experience.
5. **User PWA** — customer mobile experience.

All projects should follow the baseline unless a project-specific exception is explicitly approved.

---

## 2. Baseline technology stack

| Concern | Baseline choice | Notes |
|---|---|---|
| Runtime / package manager | **Bun 1.3+** | `packageManager` pinned in `package.json` |
| Language | **TypeScript 7+** | Strict mode, `noEmit`, `moduleResolution: bundler` |
| Framework | **React 19** | React Compiler enabled by default |
| Bundler | **Vite 8** with `@tanstack/react-start/plugin/vite` | Static pre-render by default |
| Routing | **TanStack Router** | File-based `src/routes/**` |
| SSR / pre-render | **TanStack Start** | SPA fallback, static prerender where possible |
| Server state | **TanStack React Query** | `staleTime`, `refetchOnWindowFocus` tuned per app |
| Client state | **Zustand** | Persist only what must survive reload |
| Styling | **Tailwind CSS 4** + `@tailwindcss/vite` | CSS-variable theming, dark mode support |
| UI primitives | **Base UI** + custom `src/components/ui` | shadcn-style owned primitives, not copy-paste |
| Class merging | **`cnfast`** | `import { cn } from "cnfast"` |
| i18n | **Paraglide JS** / inlang | Base locale `en`, other locales added on need |
| Validation | **Valibot** | Runtime validation of external data and forms |
| API client | **ky** + typed backend endpoints | Keep calls inside `src/services`; no custom auth SDK yet |
| Charts / visuals | **Recharts** | Use for dashboards and analytics features |
| Date utilities | **date-fns** | Consistent date formatting |
| Icons | **lucide-react** | Standard icon set |
| Notifications | **sonner** | Toasts and copy feedback |
| Drag/drop | **@dnd-kit** | If needed for ordering or boards |
| Animation | **motion** | Subtle, prefers-reduced-motion aware |
| Error tracking | **Sentry** | Enabled in production only |
| Payments | **Stripe** | Only in Business / User apps where required |

### Only allowed deviations

- **Courier / User PWAs** add **Vite PWA / `vite-plugin-pwa`** and a `manifest.json`.

### TypeScript only

- All authored logic is written in TypeScript (`*.ts` / `*.tsx`).
- `tsconfig.json` sets `allowJs: false` to enforce this.
- Config, manifest, and message files (`*.json`) are the only allowed `.json` artifacts; no `.js` source files.

---

## 3. Repository and project structure

All five apps live in **one repository** using **Bun workspaces**.

### Root monorepo layout

```
alvo/
  package.json              # workspaces + shared scripts
  bunfig.toml
  .oxlintrc.json
  .oxfmtrc.json
  lefthook.yml
  apps/
    website/                → alvo.com
    admin/                  → admin.alvo.com
    business/               → business.alvo.com
    courier-pwa/            → courier.alvo.com
    user-pwa/               → user.alvo.com
  packages/
    design-tokens/          # CSS variables + theme TS types
    ui/                     # shared primitives (no app logic)
    api-types/              # generated or hand-typed backend contracts
    ts-config/
    eslint-config/
```

### Root `package.json` example

```json
{
  "name": "alvo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "packageManager": "bun@1.3.11",
  "scripts": {
    "dev:website": "bun --filter @alvo/website dev",
    "dev:admin": "bun --filter @alvo/admin dev",
    "dev:business": "bun --filter @alvo/business dev",
    "dev:courier": "bun --filter @alvo/courier-pwa dev",
    "dev:user": "bun --filter @alvo/user-pwa dev",
    "lint": "bun --filter '*' lint",
    "test": "bun --filter '*' test"
  }
}
```

### Per-app `src/` layout

Each `apps/<name>` keeps the same `src/` structure:

```
src/
  routes/           # TanStack file routes (auto-generated routeTree.gen.ts)
  pages/            # Page-level UI consumed by routes
  components/       # Feature and presentational components
  components/ui/    # app-owned primitives; shared ones come from @alvo/ui
  services/         # API-facing service layer; all backend calls live here
  queries/          # React Query config, hooks, and builders
  store/            # Zustand stores
  hooks/            # Custom React hooks
  lib/              # Shared utilities, schemas, and bootstraps
  providers/        # React context providers (query, theme, ...)
  types/            # Shared TypeScript types
  utils/            # Domain helpers
  paraglide/        # Generated i18n runtime (gitignored)
  assets/           # Static images, fonts
  index.css         # Tailwind entry + @alvo/design-tokens import
```

### Shared package rules

- `@alvo/design-tokens` exports CSS variables; apps import its `index.css` before Tailwind.
- `@alvo/ui` exports shared components built on Base UI.
- `@alvo/api-types` holds backend DTOs; no runtime logic.
- `@alvo/ts-config` and `@alvo/eslint-config` are shared workspace configs.
- A package must never depend on an app.

---

## 4. Routing and navigation

- Use **file-based TanStack Router** (`src/routes/**`).
- Layout routes use the `_layout-name` convention.
- Protected routes use `beforeLoad` for auth guards, never only client-side `useEffect`.
- Keep route files thin; route `component` imports from `src/pages`.
- 404 handling via a catch-all `$.tsx` route.

---

## 5. State management

### Server state

- Use **TanStack React Query** for all server data.
- Define `queryClient` defaults once; adjust `staleTime` per feature.
- Encapsulate queries in `src/queries/**`.

### Client state

- Use **Zustand** for client-only state.
- Split stores by domain (e.g., `project-store`, `billing-store`).
- Keep stores small; use selectors to avoid re-renders.
- Persist only user preferences and IDs, never secrets or full records.

### What to avoid

- Do not fetch or mutate data directly in presentational components.
- Do not mix server data and UI state in the same store.

---

## 6. Data and API

### Service layer

- All HTTP calls live in `src/services/**`.
- Services map between backend API response types and app domain types.
- Example:

```ts
// src/services/project-service.ts
export const projectService = {
  fetchProjects: async (orgId: string): Promise<Project[]> => { ... },
};
```

### Error handling

- Handle errors by **error code**, never by message text.
- Translate user-facing strings with Paraglide keys.
- Loading, empty, error, and success states must be explicit in UI.

### Validation

- Use **Valibot** for runtime validation of API responses, forms, and query params.
- Co-locate schemas with the feature that owns them.

---

## 7. Styling and UI

### Tailwind

- Tailwind CSS 4 with CSS variables for theming.
- One `src/index.css` as the design-token entry.
- Use `@source` so Playwright CT and PWAs pick up classes.

### Components

- Build primitives in `src/components/ui/**` on top of **Base UI**.
- Do not pull in generic shadcn copy-paste; own the implementation.
- One exported component or hook per file.
- Keep props minimal; compose with slots / children.
- Loading states use **skeletons**, never spinners.
- Buttons in loading state are **disabled and re-labeled**.

### Dark mode

- Use `next-themes` or a custom `ThemeProvider` with `dark` class.
- All color tokens must have a dark-mode mapping.

---

## 8. Internationalization (i18n)

- Do not hardcode user-facing strings.
- Use `m["some.key"]()` imported from `@/paraglide/messages`.
- Source messages live in `messages/{locale}.json`.
- Base locale is `en`.
- Add new keys to `messages/en.json` first, then run the machine-translation command.

---

## 9. Authentication

- Call backend auth endpoints directly through `src/services/auth-service.ts`.
- Do not build or depend on a dedicated auth SDK for now.
- Store tokens in `httpOnly` cookies where possible; fallback to secure `localStorage` only for PWAs if the backend requires it.
- Route guards live in protected layout `beforeLoad`.
- For PWAs, ensure the auth session survives background / offline states.

---

## 10. Progressive Web Apps (Courier / User)

The courier and user apps are **installable PWAs**.

### Required

- `vite-plugin-pwa` registered in `vite.config.ts`.
- `manifest.json` with app name, icons, theme color, display `standalone`.
- Service worker strategy: **app-shell precache** + runtime cache for API and media.
- Icons at 192x192 and 512x512 in `public/`.
- Works offline for cached shell; API failures show graceful offline states.

### Optional

- Push notifications.
- Background sync for courier status updates.
- Add-to-home-screen prompt.

---

## 11. Testing

### Unit and component tests

- **Vitest** with `happy-dom`.
- `__tests__/` folders colocated with source.
- Use **Testing Library** patterns.
- Mock backend endpoints and network; tests must be deterministic.

### Component and E2E tests

- **Playwright experimental-ct-react** for `*.ct.tsx` component tests.
- E2E tests with Playwright where critical user flows require it.

### Coverage

- Minimum thresholds: **80%** lines, functions, branches, statements.
- Critical paths (billing, auth, courier assignment) should be mutation-tested with Stryker where feasible.

---

## 12. Tooling and CI

### Required tooling

| Tool | Purpose | Config file |
|---|---|---|
| **Oxlint** | Linting | `.oxlintrc.json` |
| **Oxfmt** | Formatting | `.oxfmtrc.json` |
| **Lefthook** | Pre-commit hooks | `lefthook.yml` |
| **react-doctor** | Architecture / a11y / bundle checks | `doctor.config.ts` |
| **Vitest** | Unit tests | `vitest.config.ts` |
| **Playwright CT** | Component tests | `playwright-ct.config.ts` |
| **Stryker** | Mutation testing | `stryker.config.json` |

### Pre-commit checks

- Oxlint on staged `.{ts,tsx}`
- Oxfmt on staged `.{ts,tsx,json,md}`
- Vitest related tests
- Playwright CT for `*.ct.tsx`
- react-doctor for changed `.tsx`

### CI

- Run lint, type check, tests, and build on every PR.
- Upload sourcemaps to Sentry only on production builds.
- Use semantic-release for `main` branch releases.

---

## 13. Environment and secrets

All runtime env variables must be prefixed with `VITE_` so Vite exposes them.

### Common variables

- `VITE_API_URL`
- `VITE_AUTH_API_URL`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_APPLE_CLIENT_ID`
- `VITE_MICROSOFT_CLIENT_ID`
- `VITE_TELEGRAM_BOT_ID`
- `VITE_SENTRY_DSN`

### Secrets

- Never commit secrets or `.env.local` files.
- Use `.env.development`, `.env.production` only for non-sensitive defaults.
- Private packages require a `GITHUB_TOKEN` with `read:packages` in `bunfig.toml`.

---

## 14. Developer setup

### New project bootstrap

1. From the repo root, create `apps/<project>`.
2. Add the app to the root `workspaces` array.
3. Copy the baseline `package.json`, `vite.config.ts`, `tsconfig.json`, `vitest.config.ts` into `apps/<project>`.
4. Run `bun install` from the repository root.
5. Configure `apps/<project>/.env.development` and `apps/<project>/.env.local`.
6. Wire up the typed backend endpoint contracts in `apps/<project>/src/services` and `apps/<project>/src/types`.
7. Run `bun --filter @alvo/<project> dev`.

### Standard root scripts

- `bun run dev:website` — website dev server
- `bun run dev:admin` — admin dev server
- `bun run dev:business` — business dev server
- `bun run dev:courier` — courier-pwa dev server
- `bun run dev:user` — user-pwa dev server
- `bun run lint` — lint every workspace
- `bun run test` — test every workspace

### Per-app scripts

- `bun run dev` — dev server
- `bun run build` — production build
- `bun run preview` — preview build
- `bun run lint` / `bun run lint:fix`
- `bun run format`
- `bun run test` — Vitest
- `bun run test:ct` — Playwright component tests
- `bun run react-doctor`
- `bun run machine-translate` — i18n translation

---

## 15. Deployment

### One Cloudflare Pages project per app

Each app is a separate Cloudflare Pages project with its own subdomain.

| App | Subdomain | Build command | Output directory |
|---|---|---|---|
| **Website** | `alvo.com` | `bun --filter @alvo/website build` | `apps/website/dist/client` |
| **Admin** | `admin.alvo.com` | `bun --filter @alvo/admin build` | `apps/admin/dist/client` |
| **Business** | `business.alvo.com` | `bun --filter @alvo/business build` | `apps/business/dist/client` |
| **Courier PWA** | `courier.alvo.com` | `bun --filter @alvo/courier-pwa build` | `apps/courier-pwa/dist/client` |
| **User PWA** | `user.alvo.com` | `bun --filter @alvo/user-pwa build` | `apps/user-pwa/dist/client` |

- Every app has its own `wrangler.jsonc` at `apps/<name>/wrangler.jsonc`.
- Configure the custom domain in Cloudflare Pages for each project.
- Use SPA fallback for all five apps.

### Marketing website

- Built with the same **Vite + TanStack Start** stack.
- Use static prerender for SEO-friendly marketing pages.
- Keep JavaScript minimal; prefer pre-rendered HTML and progressive enhancement.

### PWAs

- Build includes service worker and `manifest.json`.
- HTTPS is mandatory.
- Each PWA deploys to its own subdomain.

---

## 16. Project-specific guidelines

| Project | Primary concerns | Allowed deviations |
|---|---|---|
| **Website** | SEO, fast static pages, minimal JS | TanStack Start pre-render, minimal JS |
| **Admin** | Heavy forms, tables, permissions, analytics | Recharts, complex dashboards, RBAC |
| **Business** | B2B portal, multi-tenant, billing | Stripe, partner-specific flows |
| **Courier PWA** | Mobile-first, offline, GPS, quick actions | `vite-plugin-pwa`, manifest, background sync |
| **User PWA** | Mobile-first, booking/tracking, notifications | `vite-plugin-pwa`, push, install prompt |

### Shared packages

Every app consumes the same shared workspace packages:

- `@alvo/design-tokens` — CSS variables and theme values.
- `@alvo/ui` — shared React primitives.
- `@alvo/api-types` — backend DTO types.
- `@alvo/ts-config` / `@alvo/eslint-config` — shared tooling config.

Only product-specific features should differ.

---

## 17. New-project checklist

Before writing the first feature, verify:

- [ ] Root `package.json` lists `apps/*` and `packages/*` in `workspaces`.
- [ ] `packages/design-tokens` and `packages/ui` exist and build successfully.
- [ ] New app added to `apps/<project>` with the correct `@alvo/<project>` package name.
- [ ] `apps/<project>/src/` matches the standard layout.
- [ ] `apps/<project>/src/components/ui` is configured; shared primitives come from `@alvo/ui`.
- [ ] `apps/<project>/src/routes/__root.tsx` provides Query, Theme, and any global providers.
- [ ] Auth bootstrap runs before first render.
- [ ] `apps/<project>/messages/en.json` exists and Paraglide compiles to `src/paraglide`.
- [ ] Vitest, Playwright CT, and lefthook are wired.
- [ ] `apps/<project>/.env.development` and `.env.production` templates are documented.
- [ ] `apps/<project>/wrangler.jsonc` sets the correct custom domain.
- [ ] Sentry DSN and sourcemap upload configured for production.
- [ ] PWA manifest and service worker added for courier/user apps.
- [ ] `README.md` contains `bun install` and `bun --filter @alvo/<project> dev` quick start.

---

## 18. Reference

These guidelines are derived from the **RIXL Dashboard** project at `rixl/dashboard`, which serves as the working baseline for this architecture.
