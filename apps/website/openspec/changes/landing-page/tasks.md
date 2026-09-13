## 1. Foundations & content

- [ ] 1.1 Add `landing.*` message keys to `messages/en.json` for every section's copy (navbar, hero, privacy-intro, how-it-works, locker-network, business-batch, courier-earnings, trust-stats, testimonial, coverage, faq, final-cta, footer); run machine translation for other locales.
- [ ] 1.2 Pull verbatim copy and any confirmable spacing/typography values from Figma node `4:2531` (file `NM7EGmyb8WsMpuHyX9x3a4`) and fill the message keys; do not invent values (design-tokens rule).
- [ ] 1.3 Create typed content modules (`src/content/landing.ts`) for repeating data — 4 steps, 4 stats, 6 FAQ items, footer link columns, social links — referencing message keys, not literals.
- [ ] 1.4 Export assets from Figma to `apps/website/public/landing/` (hero image, phone mockups, dashboard/earnings screenshots, node diagram, coverage map, QR/app badges); SVG for diagrams/map/badges, compressed WebP/AVIF + fallback for photos; record explicit width/height for each.
- [ ] 1.5 Confirm required Hugeicons/Lucide icons exist for the privacy feature tiles and nav; add any custom marks under `@alvo/ui/icons` per the icons rule.

## 2. Shared primitives in `@alvo/ui`

- [ ] 2.1 Build `Accordion` on Base UI (Accordion/Collapsible) with `aria-expanded`/`aria-controls`, keyboard toggle, single- vs multi-open mode, and reduced-motion support; export from `packages/ui/src/index.ts`.
- [ ] 2.2 Build `StepCarousel`/`Carousel` on Base UI + CSS scroll-snap with prev/next controls, disabled-at-end state, labelled region + per-slide position semantics, keyboard operation, and reduced-motion support.
- [ ] 2.3 Build `StatCard` (value + associated label) and `FeatureTile` (icon + title + description) with `class-variance-authority` variants and token-based primary surfaces.
- [ ] 2.4 Build the `AppDownload`/`QrBadge` block (QR + download action, image-failure fallback, descriptive alt) for reuse in hero and footer.
- [ ] 2.5 Add Vitest + Playwright CT tests for each primitive (roles, states, keyboard, reduced motion); ≥80% coverage.

## 3. Page shell (capability: page-shell)

- [ ] 3.1 Replace the placeholder `Home` with a landing page composed of the 13 sections in the required order; render under the `/` route.
- [ ] 3.2 Add landmarks (single banner/main/contentinfo) and a focus-moving "Skip to content" link as the first focusable element.
- [ ] 3.3 Implement the shared responsive container (px-6 / px-8 / px-10, max desktop width, centered) and section vertical rhythm using the spacing scale.
- [ ] 3.4 Set document head in `__root.tsx`/route: title, meta description, canonical, viewport, theme-color, OpenGraph/Twitter tags.
- [ ] 3.5 Verify light and dark color schemes render correctly from tokens across all sections.

## 4. Navigation & hero

- [ ] 4.1 Build `navbar`: brand logo→home, four nav links, "Download Hub" CTA, in-page anchor navigation with focus move.
- [ ] 4.2 Add navbar mobile menu (toggle with `aria-expanded`, Escape/link-select close, focus return, no focus trap) and sticky scroll state with token surface.
- [ ] 4.3 Build `hero`: single `h1` headline + subhead, primary "Get the app" + secondary "Track package" CTAs, app-download/QR affordance, contrast overlay over the dark image, responsive stack/side-by-side.

## 5. Value-proposition sections

- [ ] 5.1 Build `privacy-intro`: eyebrow + `h2` + supporting copy, three feature tiles (decorative icons), supporting media card, responsive layout.
- [ ] 5.2 Build `how-it-works`: `h2` + four step cards in the `StepCarousel`, controls, semantics, reduced motion, mobile single-card / desktop multi-card.
- [ ] 5.3 Build `locker-network`: `h2` + two sub-points, contextual learn-more link, primary phone mockup, two-column/stacked responsive.
- [ ] 5.4 Build `business-batch`: `h2` + two sub-points, dashboard media panel (alt text), learn-more link, responsive columns.
- [ ] 5.5 Build `courier-earnings`: `h2` + two sub-points, illustrative earnings mockup, learn-more link, responsive columns.

## 6. Proof, coverage & conversion

- [ ] 6.1 Build `trust-stats`: `h2` + supporting copy + four `StatCard`s from content, primary surface contrast, responsive row/stack.
- [ ] 6.2 Build `testimonial`: `h2` + `blockquote` with attribution, node diagram (one highlighted node, text alternative/decorative), responsive reflow.
- [ ] 6.3 Build `coverage`: eyebrow + `h2` + copy, map graphic with emphasized marker and text alternative, responsive columns.
- [ ] 6.4 Build `faq`: `h2` + six-item `Accordion` from content, keyboard operability, chosen expansion default, reduced motion.
- [ ] 6.5 Build `final-cta`: `h2` + two CTAs matching hero destinations on a primary card, decorative background art hidden, contrast, responsive stack.
- [ ] 6.6 Build `footer`: contentinfo landmark, brand blurb, `AppDownload` block, grouped labelled link columns, named social links with safe rel, copyright/legal line, responsive columns/stack.

## 7. Testing, quality & verification

- [ ] 7.1 Add Vitest + Testing Library tests for every section (content presence, headings/landmarks, accessible names, states) — one test per spec scenario.
- [ ] 7.2 Add Playwright CT (`*.ct.tsx`) for interactions: mobile menu, carousel advance/keyboard, accordion toggle/keyboard, CTA links.
- [ ] 7.3 Verify accessibility: single h1, heading order, contrast on primary/dark surfaces, reduced-motion behavior, focus visibility.
- [ ] 7.4 Verify performance: hero as prioritized dimensioned LCP image, below-the-fold media lazy-loaded, no layout shift (CLS) from media.
- [ ] 7.5 Run oxlint, oxfmt, react-doctor, and the test suite; ensure ≥80% coverage for the app and `@alvo/ui` additions.
- [ ] 7.6 Run `openspec validate landing-page --strict` and confirm the built page satisfies each capability spec before archiving.

## 8. Deferred decisions (confirm during apply if they arise)

- [x] 8.1 Resolved: canonical brand-primary token is `primary-500` = `#00a996` (the rendered Figma button fill); Figma `#4A85E4` is not the brand. No spec/markup change.
- [ ] 8.2 Confirm final destinations for "Get the app" and "Track package"; replace placeholder targets.
- [ ] 8.3 Confirm FAQ default expansion model (single-open vs multi-open).
