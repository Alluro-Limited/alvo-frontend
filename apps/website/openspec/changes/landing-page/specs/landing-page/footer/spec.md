## Purpose

Defines the site footer: brand blurb, app-download/QR block, grouped navigation link columns, social links, and the legal/copyright line, rendered on a primary surface within the page `contentinfo` landmark.

## ADDED Requirements

### Requirement: Footer structure and landmark

The footer SHALL render inside the page `contentinfo` landmark and contain the Alvo brand mark, a short privacy-first blurb, an app-download/QR block, grouped link columns, social links, and a copyright/legal line. All labels SHALL come from i18n keys.

#### Scenario: Footer renders

- **WHEN** the footer renders
- **THEN** it shows the brand mark, blurb, app-download block, link columns, social links, and a copyright line inside the contentinfo landmark

### Requirement: Grouped navigation columns

Footer links SHALL be organized into labelled groups (e.g., Product, Solutions, Company). Each group SHALL have a group heading and a list of links so assistive technology can perceive the grouping.

#### Scenario: Group headings

- **WHEN** a screen reader navigates the footer
- **THEN** each link column is introduced by its group heading and links are presented as a list

### Requirement: App-download and QR block

The footer app-download block SHALL include a QR code with descriptive alt text and a download action, and SHALL remain usable if images fail to load.

#### Scenario: QR alt text

- **WHEN** assistive technology encounters the footer QR image
- **THEN** it announces descriptive alternative text about downloading the Alvo app

#### Scenario: Image load failure

- **WHEN** the footer QR/badge images fail to load
- **THEN** a text link/button to obtain the app remains available

### Requirement: Social links

Social links SHALL each expose an accessible name identifying the platform (icon-only links must not rely on the icon alone) and open external destinations safely.

#### Scenario: Icon-only social link name

- **WHEN** assistive technology encounters a social icon link
- **THEN** its accessible name names the platform (e.g., "Alvo on X")

#### Scenario: External link safety

- **WHEN** a social link opens in a new tab
- **THEN** it applies safe rel attributes for external navigation

### Requirement: Legal and copyright line

The footer SHALL display a copyright line with the current year and the product name, and MAY link to legal/policy pages when available.

#### Scenario: Copyright present

- **WHEN** the footer renders
- **THEN** a copyright line naming Alvo and the year is shown

### Requirement: Responsive layout

On desktop the link columns SHALL sit in a multi-column row alongside the brand block; on mobile they SHALL stack into a single readable column using the documented spacing scale.

#### Scenario: Mobile stacking

- **WHEN** the viewport is mobile width
- **THEN** the brand block and link columns stack into a single column in reading order

#### Scenario: Desktop columns

- **WHEN** the viewport is desktop width
- **THEN** the brand block and grouped link columns are arranged across a multi-column row
