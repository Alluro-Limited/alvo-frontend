# Website app

## Scope

- `apps/website` is the public marketing site for Alvo.

## Stack

- React 19 + Vite + TanStack Router
- `@alvo/ui` for components and `@alvo/design-tokens` for theme
- Paraglide JS for i18n

## Conventions

- Prefer existing `packages/ui` components; build a new one only when the shared library does not have it.
- No hardcoded user-facing strings; use Paraglide messages.
- The landing page design source of truth is Figma file `stage` at node `4:2531`.
- Track all website work with OpenSpec changes through the `apps/website/.agents/skills/openspec-*` skills.
