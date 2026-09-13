## Context

See [proposal.md](./proposal.md) for motivation. The website app (`@alvo/website`) currently renders only a placeholder `Home` page and consumes `@alvo/ui` + `@alvo/design-tokens`. The stack is React 19 (React Compiler), TanStack Router/Start, Tailwind 4 (token-driven), Base UI primitives, Paraglide i18n, Valibot, Vitest + Testing Library, Playwright CT. Repo rules that constrain this design: one exported component/hook per file; Base UI only (no Radix); `cn` from `cnfast`; `class-variance-authority` for variants; no hardcoded strings/colors/spacing; skeletons not spinners; ≥80% coverage; conventional commits. The Figma source is `stage`, file `NM7EGmyb8WsMpuHyX9x3a4`, node `4:2531` (1440×9195 desktop).

The specs in `specs/landing-page/*` define one behavioral contract per section. This document covers how those contracts are realized across the app and the shared library.

## Goals / Non-Goals

**Goals:**

- A component architecture where each landing section maps to one colocated section component in the website app, composed by a single page.
- Extract genuinely reusable, presentation-agnostic primitives into `@alvo/ui` (not the website app) so other apps can reuse them.
- Keep all copy in Paraglide message keys and all visual values in design tokens; sections carry layout only.
- Establish a repeatable Figma → asset export pipeline for the page's imagery.
- Meet accessibility (landmarks, keyboard, reduced motion, contrast) and performance (LCP image, lazy media) bars.

**Non-Goals (design-level):**

- No backend/API for track-package or app-download (placeholder targets).
- No CMS/content service — copy lives in message catalogs and typed content modules.
- No motion-design system beyond the reduced-motion-respecting states the specs require.
- No resolution of the brand-primary color question (see Open Questions) — components reference the semantic token, so the decision is a one-line token change later.

## Decisions

### D1. Section-per-file in the app, primitives in `@alvo/ui`

Each section is a colocated component under `apps/website/src/components/landing/<section>/` with its own `__tests__`. The page (`apps/website/src/pages/home.tsx`, rendered by the `/` route) imports and orders them per `page-shell`. Reusable, brand-agnostic building blocks move to `@alvo/ui`:

- `Accordion` (FAQ) — built on Base UI Accordion/Collapsible.
- `Carousel` / `StepCarousel` (how-it-works) — built on Base UI primitives + scroll-snap; no third-party carousel dep.
- `StatCard` (trust-stats), `FeatureTile` (privacy-intro).
- `Navbar` shell + `Footer` shell primitives, or app-level if too marketing-specific — decided per component during apply (default: app-level composition using `@alvo/ui` atoms).
- `AppDownload` / `QrBadge` block (hero + footer reuse).

Rationale: sections are marketing-specific composition (stay in the app); disclosure/carousel/card mechanics are cross-app (belong in the library). Alternative considered — build everything in the website app — rejected because FAQ/carousel/stat-card will recur in other apps and the repo mandates shared primitives.

### D2. Base UI for all interactive primitives

Accordion and carousel use `@base-ui/react` (Accordion, Collapsible, and scroll primitives); nav mobile menu uses a Base UI disclosure/popover. No Radix, no `embla`/`swiper`. Rationale: repo rule mandates Base UI and forbids new deps unless required. Native CSS scroll-snap covers carousel motion; controls drive `scrollIntoView`. Trade-off: slightly more manual carousel logic vs a library, accepted for zero-dependency and a11y control.

### D3. Tokens and variants only — no literal values

All color/spacing/radius/typography come from `@alvo/design-tokens` utilities; variant sets use `class-variance-authority`; class merging uses `cn` from `cnfast`. Primary-brand surfaces use the `primary-*` scale (the design's canonical primary brand); the primary CTA uses the existing `Button` default variant. No hex/px literals except direct one-off Figma translations flagged in code. Rationale: enforces the design-token and code-style rules and makes the brand-color decision a token swap.

### D4. Content and i18n model

Copy lives in `messages/en.json` under a `landing.<section>.*` namespace, accessed via `m["landing.hero.headline"]()`. Structured, repeating content (four steps, four stats, six FAQ items, footer columns) lives in typed content modules (e.g., `content/landing.ts`) that reference message keys — so markup never hardcodes counts or strings and translators get flat keys. Rationale: satisfies the i18n rule and keeps sections declarative and testable.

### D5. Asset pipeline

Images (hero, phone mockups, dashboard/earnings screenshots, node diagram, coverage map, QR/app badges) are exported from Figma to `apps/website/public/landing/` in web-optimized formats (prefer SVG for diagrams/map/badges; compressed WebP/AVIF + fallback for photos), with explicit width/height to prevent CLS. Icons come from `@hugeicons/react` (Lucide fallback) per the icons rule; only truly custom marks are added under `@alvo/ui/icons`. Rationale: legible, versioned assets with no runtime Figma dependency. Trade-off: assets are a manual export step tracked in tasks.

### D6. Performance and rendering

The hero image is the LCP element — eager-loaded with priority and explicit dimensions; all below-the-fold media is lazy-loaded. Sections are static/server-rendered via TanStack Start; only nav menu, carousel, and accordion carry client interactivity. Reduced-motion preference disables carousel/accordion animation. Rationale: fast first paint on a long marketing page.

### D7. Testing strategy

Per section: Vitest + Testing Library unit/component tests for content presence, states, and a11y roles/attributes (`aria-expanded`, landmark roles, accessible names); Playwright CT (`*.ct.tsx`) for interaction (mobile menu open/close, carousel advance, accordion toggle, keyboard). Shared primitives are tested in `@alvo/ui`. Target ≥80% coverage. Rationale: each spec scenario maps to a test.

## Risks / Trade-offs

- **Exact copy/measurements not yet captured (behavior+tokens fidelity)** → Specs reference tokens and i18n keys; an apply-phase task pulls verbatim copy and any confirmable spacing from Figma node `4:2531` before implementation, so nothing is guessed.
- **Brand-primary resolved** — `primary-500` is `#00a996` (the rendered Figma button fill), not `#067f8a` or the wireframe-annotated `#4A85E4`. Components bind to the semantic token, so the decision is already in effect; no spec/markup changes required.
- **Hand-built carousel/accordion a11y** → Build on Base UI, cover with Playwright CT keyboard/AT tests, and validate reduced-motion.
- **Large hero/media hurting LCP/CLS** → Prioritized, dimensioned hero image; lazy-load and compress the rest; SVG for diagrams/maps.
- **Node diagram / map as images lose meaning for AT** → Provide concise text alternatives or mark decorative per the specs.
- **Primitive placement churn (app vs `@alvo/ui`)** → Default to app-level composition from library atoms; promote to `@alvo/ui` only when a second app needs it, to avoid premature abstraction.

## Migration Plan

Additive change; no data migration. Steps: (1) add `@alvo/ui` primitives + tests; (2) export assets to `public/landing/`; (3) add `landing.*` message keys and content modules; (4) build section components with tests; (5) compose in `home.tsx` and wire `__root.tsx` head/SEO; (6) replace the placeholder home. Rollback: revert the change; the placeholder home returns. Ship behind the existing `/` route; no flag required.

## Open Questions

- Resolved: canonical primary is `primary-500` = `#00a996` (the rendered Figma button fill); the `#4A85E4` annotation is not the brand color.
- Final destinations for "Get the app" (store links vs an app-hub route) and "Track package" (route vs external) — placeholders until product confirms; does not affect section structure.
- FAQ expansion model (single-open vs multi-open) — the `faq` spec covers both; product picks the default during apply.
