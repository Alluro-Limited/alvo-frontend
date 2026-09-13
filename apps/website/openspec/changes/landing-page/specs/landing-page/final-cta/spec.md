## Purpose

Defines the closing conversion card — "Send something today. Keep it private forever." — presenting the two core CTAs on a primary surface as the last prompt before the footer.

## ADDED Requirements

### Requirement: CTA card content

The section SHALL present a headline ("Send something today. Keep it private forever.") and the two calls to action — "Get the app" and "Track package" — on a primary surface card. Copy SHALL come from i18n keys and the headline SHALL be a section-level heading (`h2`).

#### Scenario: Card renders

- **WHEN** the final-cta section renders
- **THEN** it shows the `h2` headline and the two CTAs on a token-based primary surface

### Requirement: Conversion actions

The two CTAs SHALL use `@alvo/ui` Button variants and target the same destinations as their hero counterparts (app download; track package), remaining keyboard reachable with accessible names.

#### Scenario: Primary CTA parity

- **WHEN** the user activates "Get the app" in the final CTA
- **THEN** it goes to the same app-download destination as the hero's primary CTA

#### Scenario: Secondary CTA parity

- **WHEN** the user activates "Track package" in the final CTA
- **THEN** it goes to the same track-package destination as the hero's secondary CTA

### Requirement: Contrast and decorative art

Foreground text and CTAs SHALL meet accessible contrast against the primary surface. Background art (e.g., faint globe) SHALL be decorative and hidden from assistive technology.

#### Scenario: Contrast on primary card

- **WHEN** the CTA card renders
- **THEN** the headline and CTA labels meet accessible contrast against the primary surface

### Requirement: Responsive layout

On desktop the CTAs SHALL sit inline within the card; on mobile they SHALL stack while preserving primary-before-secondary order, using the documented spacing scale.

#### Scenario: Mobile stacking

- **WHEN** the viewport is mobile width
- **THEN** the two CTAs stack with "Get the app" before "Track package"
