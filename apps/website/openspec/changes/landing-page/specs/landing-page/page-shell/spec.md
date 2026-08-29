## Purpose

Defines how the marketing landing page is composed at the website root route: the ordered set of sections, the shared responsive container, document head/SEO metadata, internationalization wiring, and the accessible landmark and skip-link structure that hosts every section component.

## ADDED Requirements

### Requirement: Root route renders the landing page

The website root route (`/`) SHALL render the landing page as its component, replacing the placeholder home page. The page SHALL render successfully with no runtime errors when all section data is present.

#### Scenario: Visiting the site root

- **WHEN** a visitor navigates to `/`
- **THEN** the landing page renders with all sections in the defined order
- **AND** no console errors or unhandled exceptions occur during render

### Requirement: Section order and composition

The landing page SHALL compose the following section capabilities in this exact top-to-bottom order: navbar, hero, privacy-intro, how-it-works, locker-network, business-batch, courier-earnings, trust-stats, testimonial, coverage, faq, final-cta, footer.

#### Scenario: Rendered section sequence

- **WHEN** the landing page renders
- **THEN** the sections appear in the order: navbar → hero → privacy-intro → how-it-works → locker-network → business-batch → courier-earnings → trust-stats → testimonial → coverage → faq → final-cta → footer

#### Scenario: A section fails to receive content

- **WHEN** a non-critical section has no content to display
- **THEN** that section is omitted without breaking the surrounding layout or section order

### Requirement: Landmark structure and skip link

The page SHALL expose accessible landmarks: a single `banner` (navbar), a single `main` wrapping the page body, and a `contentinfo` (footer). A visible-on-focus "Skip to content" link SHALL be the first focusable element and move focus to `main`.

#### Scenario: Keyboard user skips navigation

- **WHEN** a keyboard user presses Tab as the first action on the page
- **THEN** a "Skip to content" link becomes visible and focused
- **AND** activating it moves focus to the `main` landmark

#### Scenario: Assistive-technology landmarks

- **WHEN** a screen reader lists page landmarks
- **THEN** exactly one banner, one main, and one contentinfo landmark are present

### Requirement: Responsive container and grid

The page SHALL use a shared responsive container whose horizontal padding follows the spacing rule: `px-6` (24px) on mobile, `px-8` (32px) on tablet, and `px-10` (40px) on desktop, with a max content width matching the 1440 desktop design. Section vertical rhythm SHALL use the documented spacing scale (no arbitrary values except direct one-off Figma translations).

#### Scenario: Container padding adapts to viewport

- **WHEN** the viewport is mobile width
- **THEN** the page container uses 24px horizontal padding
- **WHEN** the viewport is tablet width
- **THEN** the page container uses 32px horizontal padding
- **WHEN** the viewport is desktop width
- **THEN** the page container uses 40px horizontal padding and content is capped at the max desktop width and centered

### Requirement: Document head, SEO, and social metadata

The page SHALL set a descriptive `<title>`, meta description, canonical URL, viewport, theme-color, and OpenGraph/Twitter card tags (title, description, image, type=website) in the document head via the router's head API.

#### Scenario: Crawler reads page metadata

- **WHEN** a crawler or social scraper requests `/`
- **THEN** the response head includes a non-empty title, meta description, canonical link, and OpenGraph title/description/image tags

### Requirement: Internationalized copy

All user-facing strings on the page SHALL come from Paraglide message keys (`m["..."]()`) sourced from `messages/en.json`; no user-facing string is hardcoded in a component.

#### Scenario: Adding a locale

- **WHEN** a new locale file provides translations for the landing-page keys
- **THEN** every visible landing-page string renders from the message catalog with no hardcoded fallback text in components

### Requirement: Color scheme support

The page SHALL render correctly using design tokens in both light and dark color schemes, deriving surface, foreground, and border colors from `@alvo/design-tokens` rather than hardcoded colors.

#### Scenario: Dark scheme

- **WHEN** the user agent prefers a dark color scheme
- **THEN** page background, surfaces, text, and borders resolve from the dark token values and remain legible (no light-on-light or dark-on-dark regions)
