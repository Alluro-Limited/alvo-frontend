## Purpose

Defines the "Your Parcel's Safest Stop, Minutes Away" section: a two-column feature block that explains the smart-locker network through two supporting sub-points ("Open around the clock", "Resilient by Design"), a learn-more link, and a phone mockup.

## ADDED Requirements

### Requirement: Section heading and sub-points

The section SHALL present an `h2` heading ("Your Parcel's Safest Stop, Minutes Away") and two supporting sub-points, each with a sub-heading and descriptive paragraph. All copy SHALL come from i18n keys.

#### Scenario: Section content

- **WHEN** the section renders
- **THEN** it shows the `h2` heading and two sub-points, each with a heading and description

### Requirement: Learn-more link

The section SHALL include a "Learn more" link with an accessible name that conveys its destination context (not a bare "Learn more" for screen readers).

#### Scenario: Link accessible name

- **WHEN** assistive technology encounters the learn-more link
- **THEN** its accessible name conveys what will be learned (e.g., "Learn more about the locker network")

#### Scenario: Link activation

- **WHEN** the user activates the learn-more link
- **THEN** the user is taken to the locker-network destination (placeholder target until wired)

### Requirement: Media mockup

The section SHALL include a phone mockup image on a primary surface. If decorative, it SHALL be hidden from assistive technology; if informative, it SHALL carry descriptive alt text. Surface color SHALL derive from the primary design tokens.

#### Scenario: Mockup presentation

- **WHEN** the section renders on a wide viewport
- **THEN** the phone mockup appears alongside the copy on a token-based primary surface

### Requirement: Responsive two-column layout

On desktop the copy and mockup SHALL appear as two columns; on mobile they SHALL stack with copy first, then mockup, using the documented spacing scale.

#### Scenario: Mobile stacking

- **WHEN** the viewport is mobile width
- **THEN** the copy stacks above the mockup

#### Scenario: Desktop columns

- **WHEN** the viewport is desktop width
- **THEN** the copy and mockup are arranged as two columns within the container
