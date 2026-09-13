## Purpose

Defines the "Earn on the Routes You Already Drive" section aimed at couriers: a two-column block with two sub-points ("Manifests sorted by your path", "Privacy protects you") and an earnings phone mockup, conveying route-fit work and privacy-protected, on-time payouts.

## ADDED Requirements

### Requirement: Section heading and sub-points

The section SHALL present an `h2` heading ("Earn on the Routes You Already Drive") and two supporting sub-points, each with a sub-heading and descriptive paragraph covering route-based manifests and courier privacy. All copy SHALL come from i18n keys.

#### Scenario: Section content

- **WHEN** the section renders
- **THEN** it shows the `h2` heading and two sub-points about route-fit manifests and privacy-protected payouts

### Requirement: Earnings media mockup

The section SHALL include an earnings phone mockup on a primary surface. Any currency figure shown is illustrative marketing content, not live data; if the image is informative it SHALL carry descriptive alt text, otherwise it SHALL be hidden from assistive technology.

#### Scenario: Illustrative earnings

- **WHEN** the earnings mockup renders
- **THEN** it is presented as illustrative product imagery (not represented as a real-time account balance)

### Requirement: Learn-more link

The section SHALL include a "Learn more" link whose accessible name conveys its courier context.

#### Scenario: Link activation

- **WHEN** the user activates the learn-more link
- **THEN** the user is taken to the courier destination (placeholder target until wired)

### Requirement: Responsive two-column layout

On desktop the copy and earnings mockup SHALL appear as two columns; on mobile they SHALL stack with copy first, then mockup, using the documented spacing scale.

#### Scenario: Mobile stacking

- **WHEN** the viewport is mobile width
- **THEN** the copy stacks above the earnings mockup

#### Scenario: Desktop columns

- **WHEN** the viewport is desktop width
- **THEN** the copy and earnings mockup are arranged as two columns within the container
