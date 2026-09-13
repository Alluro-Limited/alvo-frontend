## Purpose

Defines the above-the-fold hero: the primary privacy value proposition, the two core conversion actions, and the app-download/QR affordance, presented over the dark locker hero imagery — the first meaningful content a visitor sees.

## ADDED Requirements

### Requirement: Hero headline and supporting copy

The hero SHALL present the primary headline ("Your parcel travels. Your identity doesn't.") as the page's single `h1`, with a supporting subhead describing the privacy proposition. Both SHALL come from i18n keys and use the Display/Paragraph typography tokens.

#### Scenario: Heading hierarchy

- **WHEN** the landing page renders
- **THEN** the hero headline is the only `h1` on the page
- **AND** the supporting subhead follows it as body text

### Requirement: Dual conversion CTAs

The hero SHALL render two calls to action — a primary "Get the app" action and a secondary "Track package" action — using `@alvo/ui` Button variants (default and outline/transparent). Both SHALL be keyboard reachable with accessible names.

#### Scenario: Primary CTA

- **WHEN** the user activates "Get the app"
- **THEN** the user is taken to the app-download destination (placeholder target until wired)

#### Scenario: Secondary CTA

- **WHEN** the user activates "Track package"
- **THEN** the user is taken to the track-package destination/route (placeholder target until wired)

### Requirement: App-download / QR affordance

The hero SHALL include an app-download affordance containing a QR code and store/badge treatment. The QR image SHALL have descriptive alternative text, and the affordance SHALL remain usable when images fail to load.

#### Scenario: QR alt text

- **WHEN** assistive technology encounters the hero QR image
- **THEN** it announces descriptive alternative text (e.g., that scanning downloads the Alvo app)

#### Scenario: Image load failure

- **WHEN** the QR or badge image fails to load
- **THEN** the download affordance still presents an actionable text link or button to obtain the app

### Requirement: Hero media and contrast

The hero foreground text SHALL remain legible over the dark hero background image, maintaining sufficient contrast via an overlay or token-based foreground color. Decorative hero media (locker photo, phone mockup) SHALL be marked decorative or given appropriate alt text.

#### Scenario: Text legibility over image

- **WHEN** the hero renders over the background image
- **THEN** the headline, subhead, and CTAs meet accessible contrast against the treated background

### Requirement: Hero responsive layout

On desktop the hero SHALL present copy and media side by side; on mobile it SHALL stack copy above media and preserve the CTA order (primary before secondary). Spacing SHALL follow the documented spacing scale.

#### Scenario: Mobile stacking

- **WHEN** the viewport is mobile width
- **THEN** the hero copy stacks above the media
- **AND** "Get the app" appears before "Track package"

#### Scenario: Desktop side-by-side

- **WHEN** the viewport is desktop width
- **THEN** the hero copy and media are arranged side by side within the max-width container
