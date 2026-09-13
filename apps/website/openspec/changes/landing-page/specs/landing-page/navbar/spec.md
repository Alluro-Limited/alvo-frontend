## Purpose

Defines the top navigation for the landing page: brand identity, primary navigation links, the primary "Download Hub" call to action, and responsive/scroll behavior including the mobile menu — the persistent wayfinding surface at the top of every viewport.

## ADDED Requirements

### Requirement: Navbar structure and content

The navbar SHALL render inside the page `banner` landmark and contain the Alvo brand logo (linking to the top of the page / `/`), the primary navigation links "How it works", "Smart routing", "For Business", and "About us", and a primary "Download Hub" call-to-action button. All labels SHALL come from i18n message keys.

#### Scenario: Default desktop render

- **WHEN** the landing page renders on a desktop viewport
- **THEN** the navbar shows the brand logo, the four navigation links, and the "Download Hub" CTA in a single horizontal row

#### Scenario: Brand logo navigates home

- **WHEN** the user activates the brand logo
- **THEN** the page navigates to `/` (or scrolls to the top of the page)

### Requirement: In-page link navigation

Navigation links that target on-page sections SHALL move the viewport to the corresponding section using its anchor, and SHALL move keyboard focus to that section for assistive technology.

#### Scenario: Activating an in-page link

- **WHEN** the user activates a navigation link that maps to an on-page section
- **THEN** the page scrolls to that section
- **AND** focus is moved to the target section so the next Tab continues from there

### Requirement: Primary call to action

The "Download Hub" CTA SHALL use the `@alvo/ui` Button (default/primary variant) styled from design tokens, be reachable by keyboard, and expose an accessible name.

#### Scenario: CTA activation

- **WHEN** the user activates the "Download Hub" CTA
- **THEN** the user is taken to the app-download destination (placeholder target until wired)

### Requirement: Responsive collapse to mobile menu

Below the desktop breakpoint the primary links and CTA SHALL collapse behind a menu toggle button. The toggle SHALL expose `aria-expanded` and control a disclosure that contains the links and CTA.

#### Scenario: Opening the mobile menu

- **WHEN** the viewport is below the desktop breakpoint and the user activates the menu toggle
- **THEN** a menu containing the navigation links and the CTA is revealed
- **AND** the toggle's `aria-expanded` becomes `true`

#### Scenario: Closing the mobile menu

- **WHEN** the mobile menu is open and the user activates the toggle again, presses Escape, or selects a link
- **THEN** the menu closes and `aria-expanded` returns to `false`
- **AND** focus returns to the toggle when closed via Escape or the toggle

#### Scenario: Keyboard trap avoidance

- **WHEN** the mobile menu is open
- **THEN** focus moves through the menu items and can leave the menu without becoming trapped

### Requirement: Scroll state

The navbar SHALL remain accessible while scrolling (sticky or fixed) and MAY apply an elevated/condensed visual state after the page is scrolled past the hero, using token-based surface and border colors.

#### Scenario: Scrolling past the hero

- **WHEN** the user scrolls the page down past the hero
- **THEN** the navbar remains visible and applies its scrolled surface treatment from design tokens
- **WHEN** the user scrolls back to the top
- **THEN** the navbar returns to its initial (transparent/over-hero) treatment
