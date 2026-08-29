# Code style rules

- Use TypeScript for all source; `allowJs` is not allowed.
- Use `import { cn } from "cnfast"`, never `clsx`/`tailwind-merge` directly.
- Use one exported component or hook per file.
- Keep props minimal and typed.
- Do not use `any`; use explicit types or `unknown` at boundaries.
- Use `class-variance-authority` for variants.
- Use Base UI for headless primitives; do not install Radix.
- Avoid unnecessary `useEffect`, `useMemo`, and `useCallback`.
- Prefer composition over large components.
- Format with Oxfmt before committing.
