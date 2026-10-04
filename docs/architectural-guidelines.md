# Alvo Frontend Architectural Guidelines

## 1. Purpose

This document is the single source of truth for how every Alvo frontend project is built. All five apps live in **one repository** and are deployed to separate Vercel projects on their own subdomains. It is derived from the **RIXL Dashboard** baseline and adapted for five products:

1. **Website** — public marketing site, minimal dynamic data.
2. **Admin Webapp** — internal operations and configuration.
3. **Business Webapp** — B2B partner portal.
4. **Courier PWA** — courier mobile experience.
5. **User PWA** — customer mobile experience.

All projects should follow the baseline unless a project-specific exception is explicitly approved.

---

## 2. Baseline technology stack

| Concern                   | Baseline choice                                                   | Notes                                                    |
| ------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------- |
| Runtime / package manager | **Bun 1.3+**                                                      | `packageManager` pinned in `package.json`                |
| Language                  | **TypeScript 7+**                                                 | Strict mode, `noEmit`, `moduleResolution: bundler`       |
| Framework                 | **React 19**                                                      | React Compiler enabled by default                        |
| Bundler                   | **Vite+ (`vp`, Vite 8)** with `@tanstack/react-start/plugin/vite` | Static pre-render by default                             |
| Routing                   | **TanStack Router**                                               | File-based `src/routes/**`                               |
| SSR / pre-render          | **TanStack Start**                                                | SPA fallback, static prerender where possible            |
| Server state              | **TanStack React Query**                                          | `staleTime`, `refetchOnWindowFocus` tuned per app        |
| Client state              | **Zustand**                                                       | Persist only what must survive reload                    |
| Styling                   | **Tailwind CSS 4** + `@tailwindcss/vite`                          | CSS-variable theming, light theme only                   |
| UI primitives             | **Base UI** + custom `src/components/ui`                          | shadcn-style owned primitives, not copy-paste            |
| Class merging             | **`cnfast`**                                                      | `import { cn } from "cnfast"`                            |
| i18n                      | **Paraglide JS** / inlang                                         | Base locale `en`, other locales added on need            |
| Validation                | **Valibot**                                                       | Runtime validation of external data and forms            |
| API client                | **ky** + typed backend endpoints                                  | Keep calls inside `src/services`; no custom auth SDK yet |
| Charts / visuals          | **Recharts**                                                      | Use for dashboards and analytics features                |
| Date utilities            | **date-fns**                                                      | Consistent date formatting                               |
| Icons                     | **lucide-react**                                                  | Standard icon set                                        |
| Notifications             | **sonner**                                                        | Toasts and copy feedback                                 |
| Drag/drop                 | **@dnd-kit**                                                      | If needed for ordering or boards                         |
| Animation                 | **motion**                                                        | Subtle, prefers-reduced-motion aware                     |
| Error tracking            | **Sentry**                                                        | Enabled in production only                               |
| Payments                  | **Stripe**                                                        | Only in Business / User apps where required              |

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
  vite.config.ts            # Vite+ fmt, lint, staged, and test projects
  .vite-hooks/pre-commit    # runs `vp staged`
  apps/
    website/                → allurro.com
    admin/                  → admin.allurro.com
    business/               → business.allurro.com
    courier-pwa/            → courier.allurro.com
    user-pwa/               → user.allurro.com
  packages/
    design-tokens/          # CSS variables + theme TS types
    ui/                     # shared primitives (no app logic)
    blog-posts/             # MDX blog and help articles for the website
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
- Buttons in loading state are **disabled and re-labeled**, with a lucide `LoaderCircle` inside the button.

### Theme

- **Light theme only — no dark mode.** Build only what is in Figma.
- Do not add `dark:` variants, `prefers-color-scheme` overrides, theme providers, or dark token mappings.

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

| Tool              | Purpose                             | Config file                 |
| ----------------- | ----------------------------------- | --------------------------- |
| **Vite+ (`vp`)**  | Dev, build, test, lint, format      | `vite.config.ts`            |
| **Oxlint**        | Linting (`vp lint`)                 | `vite.config.ts` → `lint`   |
| **Oxfmt**         | Formatting (`vp fmt`)               | `vite.config.ts` → `fmt`    |
| **vp staged**     | Pre-commit hooks                    | `vite.config.ts` → `staged` |
| **react-doctor**  | Architecture / a11y / bundle checks | `doctor.config.ts`          |
| **Vitest**        | Unit tests                          | `vitest.config.ts`          |
| **Playwright CT** | Component tests                     | `playwright-ct.config.ts`   |
| **Stryker**       | Mutation testing                    | `stryker.config.json`       |

### Pre-commit checks

- `vp check --fix` (format + lint + typecheck) on staged `.{js,ts,jsx,tsx}`
- `vp fmt` on staged `.{json,md,yaml,yml,css}`
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

### One Vercel project per app

All five apps deploy from this one repository to **Vercel**. Each app is its own Vercel project, linked to the same Git repo, with its **Root Directory** set to its app folder.

| App             | Domain                 | Root Directory     | Build command          | Output directory |
| --------------- | ---------------------- | ------------------ | ---------------------- | ---------------- |
| **Website**     | `allurro.com`          | `apps/website`     | `bun run build:vercel` | `dist/client`    |
| **Admin**       | `admin.allurro.com`    | `apps/admin`       | `bun run build`        | `dist/client`    |
| **Business**    | `business.allurro.com` | `apps/business`    | `bun run build`        | `dist/client`    |
| **Courier PWA** | `courier.allurro.com`  | `apps/courier-pwa` | `bun run build`        | `dist/client`    |
| **User PWA**    | `user.allurro.com`     | `apps/user-pwa`    | `bun run build`        | `dist/client`    |

- Every app has its own `apps/<name>/vercel.json` with its build command, output directory, SPA rewrite (`/(.*)` → `/index.html`) and headers.
- Enable **Include files outside the root directory in the Build Step** so `bun install` resolves the workspace and `packages/*`.
- Skip builds for apps a commit did not touch. Use Vercel's skip-unaffected-projects setting if it detects the Bun workspace graph; otherwise set the project's **Ignored Build Step** to `git diff --quiet HEAD^ HEAD -- . ../../packages`.
- Environment variables are set per Vercel project (Production and Preview), mirroring `apps/<name>/.env.production`.
- The website currently still deploys from the root `vercel.json` (`cd apps/website && …`). Move it to `apps/website/vercel.json` and set the website project's Root Directory to `apps/website` before adding the second app; verify on a preview deployment first.

### Domains (Namecheap DNS)

The apex `allurro.com` is already pointed at the website project. Each subdomain is a separate DNS record, so adding apps does not affect the website.

1. In the app's Vercel project, open **Settings → Domains** and add its subdomain (for example `admin.allurro.com`).
2. Copy the CNAME target Vercel shows for that domain.
3. In Namecheap **Advanced DNS**, add a `CNAME` record: host `admin`, value the Vercel target.
4. Wait for Vercel to verify the domain; it issues the TLS certificate automatically.

### Cross-subdomain concerns

- Sessions shared between subdomains need backend cookies scoped to `.allurro.com`.
- Add every app origin to the backend CORS allowlist.
- Use Vercel Pro: the Hobby plan is for non-commercial use only.

### Marketing website

- Built with the same **Vite+ + TanStack Start** stack.
- Use static prerender for SEO-friendly marketing pages.
- Keep JavaScript minimal; prefer pre-rendered HTML and progressive enhancement.
- Blog and help articles live in `packages/blog-posts` and are compiled by fumadocs-mdx at build time.

### PWAs

- Build includes service worker and `manifest.json`.
- HTTPS is mandatory (provided by Vercel).
- Serve the service worker with `Cache-Control: no-cache` in the app's `vercel.json` so installed PWAs pick up new deployments.
- Each PWA deploys to its own subdomain.

---

## 16. Project-specific guidelines

| Project         | Primary concerns                              | Allowed deviations                           |
| --------------- | --------------------------------------------- | -------------------------------------------- |
| **Website**     | SEO, fast static pages, minimal JS            | TanStack Start pre-render, minimal JS        |
| **Admin**       | Heavy forms, tables, permissions, analytics   | Recharts, complex dashboards, RBAC           |
| **Business**    | B2B portal, multi-tenant, billing             | Stripe, partner-specific flows               |
| **Courier PWA** | Mobile-first, offline, GPS, quick actions     | `vite-plugin-pwa`, manifest, background sync |
| **User PWA**    | Mobile-first, booking/tracking, notifications | `vite-plugin-pwa`, push, install prompt      |

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
- [ ] Vitest, Playwright CT, and `vp staged` are wired.
- [ ] `apps/<project>/.env.development` and `.env.production` templates are documented.
- [ ] Vercel project created with Root Directory `apps/<project>` and `apps/<project>/vercel.json`.
- [ ] Subdomain added in Vercel and its CNAME record added in Namecheap.
- [ ] Sentry DSN and sourcemap upload configured for production.
- [ ] PWA manifest and service worker added for courier/user apps.
- [ ] `README.md` contains `bun install` and `bun --filter @alvo/<project> dev` quick start.

---

## 18. Reference

These guidelines are derived from the **RIXL Dashboard** project at `rixl/dashboard`, which serves as the working baseline for this architecture.
