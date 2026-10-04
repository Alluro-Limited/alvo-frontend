# Alvo Frontend

## Project overview

Alvo is a logistics platform with five frontend apps in one monorepo: website, admin, business, courier PWA, and user PWA. All apps share a single design system, component library, and backend API patterns.

## Core technologies

- React 19 with React Compiler
- TypeScript 7
- Vite+ (`vp`: Vite 8, Vitest, Oxlint, Oxfmt) + TanStack Router + TanStack Start
- Bun 1.3.x workspaces
- TanStack React Query
- Zustand
- Tailwind CSS 4
- Base UI (`@base-ui/react`)
- Paraglide JS (i18n)
- Valibot
- Vitest + Testing Library
- Playwright experimental-ct-react
- Oxlint + Oxfmt via `vp lint` / `vp fmt` (config in root `vite.config.ts`)
- react-doctor
- Stryker

## Repository structure

```
packages/
  design-tokens/     # CSS variables and theme
  ui/                # shared Base UI primitives
  blog-posts/        # MDX blog and help articles consumed by the website
  api-types/         # backend DTOs
  ts-config/
  eslint-config/
apps/
  website/
  admin/
  business/
  courier-pwa/
  user-pwa/
```

Each app uses the same `src/` layout: `routes/`, `pages/`, `components/`, `services/`, `queries/`, `store/`, `hooks/`, `lib/`, `providers/`, `types/`, `utils/`.

## TypeScript

- Keep strict typing. Do not use `any`.
- Use `allowJs: false` — all source is `.ts`/`.tsx`.
- Use `moduleResolution: bundler` and `allowImportingTsExtensions`.
- Use `@/*` for `src/*` imports in apps and packages.
- Use relative imports inside shared `packages/ui` source to avoid path alias resolution issues.

## Structure & components

- Co-locate feature components, hooks, types, and helpers.
- Keep one exported component or hook per file.
- Use Base UI for primitives; never add Radix.
- Use `import { cn } from "cnfast"` for class merging.
- Loading states use skeletons, never spinners.
- Buttons in loading state are disabled and re-labeled, with a lucide `LoaderCircle` inside (`<Button isLoading>` does this; pass the new label as children).
- Icons come from `lucide-react`.

## Data

- All HTTP calls live in `src/services/**`.
- No backend yet: each service has an HTTP implementation and a mock in `src/services/mocks/` (throwing real ky `HTTPError`s). The mock is used while `VITE_API_URL` is empty.
- Handle errors by code, not message text.
- Keep loading, empty, error, and success states explicit.

## Styling

- Tailwind 4 with CSS variables from `@alvo/design-tokens`.
- One shared Tailwind entry in `packages/ui/src/index.css`.
- Each app imports `@alvo/ui/styles`.
- No dark mode. Build only what is in Figma: light theme only, no `dark:` variants, no dark token mappings.

## i18n

- Do not hardcode user-facing strings.
- Use `m["some.key"]() from `@/paraglide/messages`.
- Add new keys to `messages/en.json` first, then machine-translate.

## Local dev

- The user runs the dev server on `localhost:5173`. Do not start extra dev servers or browser previews; use the existing one.

## Commit workflow

- Conventional commits for every commit.
- `vp staged` (`.vite-hooks/pre-commit`) runs `vp check`, related tests, react-doctor, and Playwright CT pre-commit.
- Keep each commit scoped to one logical change.

## Testing

- Unit/component tests with Vitest + happy-dom.
- Colocated `__tests__/` or `*.test.tsx`.
- Playwright CT for `*.ct.tsx` component tests.
- Minimum 80% coverage.
- Stryker for critical packages.
