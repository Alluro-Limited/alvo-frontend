## Purpose

Defines the "Ship a Hundred Orders Before Your Coffee's Cold" section aimed at business shippers: a two-column block pairing a dashboard media panel with two sub-points ("Up to 10,000 parcels per batch", "Batch analytics, live") that convey scale and privacy-preserving bulk shipping.

## ADDED Requirements

### Requirement: Section heading and sub-points

The section SHALL present an `h2` heading ("Ship a Hundred Orders Before Your Coffee's Cold") and two supporting sub-points, each with a sub-heading and descriptive paragraph covering batch capacity and live analytics. All copy SHALL come from i18n keys.

#### Scenario: Section content

- **WHEN** the section renders
- **THEN** it shows the `h2` heading and two sub-points describing batch shipping and batch analytics

### Requirement: Dashboard media panel

The section SHALL include a dashboard media panel (orders table / analytics screenshot). Informative imagery SHALL carry descriptive alt text; decorative chrome SHALL be hidden from assistive technology.

#### Scenario: Dashboard alt text

- **WHEN** the dashboard image conveys product capability
- **THEN** it has descriptive alt text summarizing what the dashboard shows

### Requirement: Learn-more link

The section SHALL include a "Learn more" link whose accessible name conveys its business context.

#### Scenario: Link activation

- **WHEN** the user activates the learn-more link
- **THEN** the user is taken to the business/batch destination (placeholder target until wired)

### Requirement: Responsive two-column layout

On desktop the dashboard panel and copy SHALL appear as two columns (dashboard leading on the reading side per the design); on mobile they SHALL stack in reading order using the documented spacing scale.

#### Scenario: Mobile stacking

- **WHEN** the viewport is mobile width
- **THEN** the heading, dashboard panel, and sub-points stack vertically in reading order

#### Scenario: Desktop columns

- **WHEN** the viewport is desktop width
- **THEN** the dashboard panel and copy are arranged as two columns within the container
