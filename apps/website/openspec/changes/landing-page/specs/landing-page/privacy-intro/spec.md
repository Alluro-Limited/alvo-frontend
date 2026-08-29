## Purpose

Defines the privacy introduction section that frames Alvo's core differentiator ("A delivery network built around your privacy") with a supporting media card and three privacy feature tiles that summarize how anonymity is preserved.

## ADDED Requirements

### Requirement: Section heading and framing copy

The section SHALL present an eyebrow label, a heading ("A delivery network built around your privacy"), and a supporting paragraph contrasting typical couriers with Alvo's masked model. The heading SHALL be a section-level heading (`h2`) and all copy SHALL come from i18n keys.

#### Scenario: Section renders

- **WHEN** the privacy-intro section renders
- **THEN** it shows the eyebrow, an `h2` heading, and the supporting paragraph

### Requirement: Privacy feature tiles

The section SHALL render three privacy feature tiles, each with an icon, a title, and a short description (e.g., "Anonymous by default"). Icons SHALL come from the shared icon set (`@hugeicons/react`, Lucide fallback) at token colors and be marked decorative when accompanied by a text title.

#### Scenario: Three tiles present

- **WHEN** the section renders
- **THEN** exactly three feature tiles are shown, each with an icon, title, and description

#### Scenario: Decorative icons

- **WHEN** a tile icon is paired with a visible title
- **THEN** the icon is hidden from assistive technology so the title is the accessible name

### Requirement: Supporting media card

The section SHALL include a supporting media card (locker imagery). Meaningful imagery SHALL carry descriptive alt text; purely decorative imagery SHALL be hidden from assistive technology.

#### Scenario: Media alt handling

- **WHEN** the media card image conveys information
- **THEN** it has descriptive alt text
- **WHEN** the media card image is decorative
- **THEN** it is hidden from assistive technology

### Requirement: Responsive layout

On desktop the media card and feature tiles SHALL sit side by side; on mobile they SHALL stack vertically in reading order (heading, media, tiles) using the documented spacing scale.

#### Scenario: Mobile stacking

- **WHEN** the viewport is mobile width
- **THEN** the heading, media card, and the three tiles stack vertically in reading order

#### Scenario: Desktop columns

- **WHEN** the viewport is desktop width
- **THEN** the media card and tiles are arranged in a multi-column layout within the container
