## Why

Alvo is a privacy-first, locker-to-locker delivery network, but `apps/website` currently ships only a placeholder home page (a heading and two demo buttons). We need the public marketing landing page — the primary acquisition surface — that explains the privacy value proposition to three audiences (senders, business shippers, couriers) and drives the two core conversions: **Get the app** and **Track package**. The Figma design (`stage`, node `4:2531`) is ready, and the shared design system (`@alvo/design-tokens` + `@alvo/ui`) now has enough primitives to build against.

## What Changes

- Add the full public landing page at the website root route (`/`), replacing the placeholder `Home` page.
- Introduce **one spec per landing-page component/section** (13 section capabilities + 1 page-shell capability) so each block — navbar, hero, privacy intro, how-it-works, locker network, business batch, courier earnings, trust stats, testimonial, coverage, FAQ, final CTA, footer — has an independent, reviewable behavioral contract.
- Specify component states, responsive behavior (mobile 4-col / tablet / desktop 1440 grid per `.agents/rules/spacing.md`), accessibility, and design-token usage for every section; exact copy, pixel values, and hex are pulled from Figma at implementation time (behavior + tokens fidelity).
- Identify net-new shared UI primitives the page requires that are **not yet in `@alvo/ui`** (accordion, horizontal step carousel, stat card, feature tile, navbar, footer, app-download/QR block) and specify their behavior inside the consuming section specs, to be extracted into `@alvo/ui` during implementation.
- Establish page-shell concerns: route composition, document `<head>`/SEO/OpenGraph/meta, i18n message keys (Paraglide), section ordering, and scroll/anchor navigation.
- **Non-goals** (this change): backend/API wiring for Track-package or app-download links (they point to placeholder targets/routes), a CMS, and animation choreography beyond the states specified. The brand-primary color is resolved: `primary-500` = `#00a996`; specs reference the semantic token, not a literal hex.

## Capabilities

### New Capabilities

- `landing-page/page-shell`: Root-route composition, section ordering, document head/SEO/OpenGraph, i18n wiring, skip-link and landmark structure, and shared responsive container/grid behavior for the marketing page.
- `landing-page/navbar`: Sticky top navigation — brand logo, primary nav links (How it works, Smart routing, For Business, About us), the "Download Hub" CTA, mobile menu, and scroll/active states.
- `landing-page/hero`: Above-the-fold hero — headline/subhead, dual CTAs (Get the app, Track package), app-download/QR card, and the phone/locker media, over the dark hero image.
- `landing-page/privacy-intro`: "A delivery network built around your privacy" intro with eyebrow, heading/subhead, a supporting media card, and three privacy feature tiles.
- `landing-page/how-it-works`: "From drop-off to pickup in four quiet steps" — a horizontal, navigable carousel of four numbered step cards, each with a phone mockup, title, and description.
- `landing-page/locker-network`: "Your Parcel's Safest Stop, Minutes Away" — two-column feature block with two sub-points, a Learn-more link, and a phone mockup.
- `landing-page/business-batch`: "Ship a Hundred Orders Before Your Coffee's Cold" — two-column block pairing a dashboard media panel with batch-shipping and analytics sub-points.
- `landing-page/courier-earnings`: "Earn on the Routes You Already Drive" — courier-audience two-column block with two sub-points and an earnings phone mockup.
- `landing-page/trust-stats`: "Built to scale, measured by trust." — heading/subhead plus a row of four stat cards (metric + label) on a primary surface.
- `landing-page/testimonial`: "The privacy people didn't know they were missing" — network/node diagram with a single highlighted node, plus a customer quote with attribution.
- `landing-page/coverage`: "Live in Lagos state. Growing fast." — coverage copy paired with a map graphic and location marker.
- `landing-page/faq`: "Questions, answered." — an accessible single/multi-expand accordion of the six FAQ items.
- `landing-page/final-cta`: Closing conversion card — "Send something today. Keep it private forever." with the dual CTAs on a primary surface.
- `landing-page/footer`: Site footer — brand blurb, app-download/QR block, grouped link columns, social links, and legal/copyright line.

### Modified Capabilities

<!-- None. The website app has no existing spec-level behavior; the placeholder Home page carries no specification. -->

## Impact

- **Code**: replaces `apps/website/src/pages/home.tsx`; adds a `components/` tree of section components under the website app; wires the root route `apps/website/src/routes/index.tsx` and document head in `__root.tsx`.
- **Shared packages**: adds new primitives to `@alvo/ui` (accordion, carousel, stat-card, feature-tile, navbar, footer, app-download block) and their exports; may add marketing-only spacing/typography usages already covered by `@alvo/design-tokens`.
- **i18n**: introduces landing-page message keys in `messages/en.json` (Paraglide) — no hardcoded strings.
- **Assets**: hero image, phone mockups, dashboard/earnings screenshots, node diagram, coverage map, and QR/app-badge art must be exported from Figma into `apps/website/public/` (or `@alvo/ui/icons` for iconography).
- **Dependencies**: no new runtime dependencies expected beyond existing `@alvo/ui`/Base UI; carousel/accordion built on Base UI primitives (no Radix).
- **Testing**: Vitest + Testing Library component tests and Playwright CT per section; ≥80% coverage per repo rules.
