## Purpose

Defines the "Built to scale, measured by trust." section: a heading with supporting copy and a row of four stat cards (metric value + label) on a primary surface that quantify network integrity, scale, and privacy.

## ADDED Requirements

### Requirement: Section heading and framing copy

The section SHALL present an `h2` heading ("Built to scale, measured by trust.") and a supporting paragraph. All copy SHALL come from i18n keys.

#### Scenario: Section content

- **WHEN** the section renders
- **THEN** it shows the `h2` heading and supporting paragraph above the stat cards

### Requirement: Stat cards

The section SHALL render four stat cards, each pairing a large metric value with a descriptive label (e.g., "99.9% — Parcel integrity", "500+", "100+ — Independent couriers", "0 — Privacy incident"). Values and labels SHALL come from i18n/config, not be hardcoded in markup, and each card SHALL associate its value with its label for assistive technology.

#### Scenario: Four cards present

- **WHEN** the section renders
- **THEN** exactly four stat cards are shown, each with a metric value and a label

#### Scenario: Value/label association

- **WHEN** a screen reader reads a stat card
- **THEN** the metric value and its label are announced together as one unit

### Requirement: Primary surface and contrast

Stat cards SHALL render on primary surfaces derived from the primary design tokens with foreground text meeting accessible contrast against that surface.

#### Scenario: Contrast on primary

- **WHEN** the stat cards render on their primary surface
- **THEN** the metric and label text meet accessible contrast against the surface

### Requirement: Responsive layout

On desktop the four stat cards SHALL sit in a single row; on tablet they MAY wrap to two per row; on mobile they SHALL stack to one per row, using the documented spacing scale and grid gutters.

#### Scenario: Mobile stacking

- **WHEN** the viewport is mobile width
- **THEN** the stat cards stack one per row

#### Scenario: Desktop row

- **WHEN** the viewport is desktop width
- **THEN** the four stat cards appear in a single row of equal-width cards
