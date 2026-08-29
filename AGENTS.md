# Alvo Frontend

## Project overview

Alvo is a logistics platform with five frontend apps in one monorepo: website, admin, business, courier PWA, and user PWA. All apps share a single design system, component library, and backend API patterns.

## Core technologies

- React 19 with React Compiler
- TypeScript 7
- Vite 8 + TanStack Router + TanStack Start
- Bun 1.3.x workspaces
- TanStack React Query
- Zustand
- Tailwind CSS 4
- Base UI (`@base-ui/react`)
- Paraglide JS (i18n)
- Valibot
- Vitest + Testing Library
- Playwright experimental-ct-react
- Oxlint + Oxfmt
- react-doctor
- Stryker

## Repository structure

```
packages/
  design-tokens/     # CSS variables and theme
  ui/                # shared Base UI primitives
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
- Buttons in loading state are disabled and re-labeled.

## Data

- All HTTP calls live in `src/services/**`.
- Handle errors by code, not message text.
- Keep loading, empty, error, and success states explicit.

## Styling

- Tailwind 4 with CSS variables from `@alvo/design-tokens`.
- One shared Tailwind entry in `packages/ui/src/index.css`.
- Each app imports `@alvo/ui/styles`.
- Dark mode tokens are required.

## i18n

- Do not hardcode user-facing strings.
- Use `m["some.key"]() from `@/paraglide/messages`.
- Add new keys to `messages/en.json` first, then machine-translate.

## Commit workflow

- Conventional commits for every commit.
- Lefthook runs lint, format, tests, and react-doctor pre-commit.
- Keep each commit scoped to one logical change.

## Testing

- Unit/component tests with Vitest + happy-dom.
- Colocated `__tests__/` or `*.test.tsx`.
- Playwright CT for `*.ct.tsx` component tests.
- Minimum 80% coverage.
- Stryker for critical packages.
