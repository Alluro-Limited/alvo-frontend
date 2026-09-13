## Purpose

Defines the "Questions, answered." FAQ section: an accessible accordion of the six common questions (delivery without details, no-one-home, cost, bulk sending, locker safety, availability) with expandable answers.

## ADDED Requirements

### Requirement: Section heading and FAQ items

The section SHALL present an `h2` heading ("Questions, answered.") and six FAQ items, each a question with an associated answer panel. Questions and answers SHALL come from i18n/config, not be hardcoded in markup.

#### Scenario: Six items present

- **WHEN** the section renders
- **THEN** six FAQ items are present, each showing its question with a collapsed answer by default

### Requirement: Accordion disclosure behavior

Each FAQ item SHALL be an accessible disclosure: the question is a button exposing `aria-expanded` and controlling its answer panel via `aria-controls`. Activating a question SHALL toggle its answer's visibility.

#### Scenario: Expanding an item

- **WHEN** the user activates a collapsed FAQ question
- **THEN** its answer panel is revealed and `aria-expanded` becomes `true`

#### Scenario: Collapsing an item

- **WHEN** the user activates an expanded FAQ question
- **THEN** its answer panel is hidden and `aria-expanded` becomes `false`

### Requirement: Keyboard operability

FAQ questions SHALL be operable by keyboard (Enter/Space to toggle) and follow a logical tab order; the expand/collapse control SHALL have a visible focus indicator using token-based focus styles.

#### Scenario: Keyboard toggle

- **WHEN** a keyboard user focuses a FAQ question and presses Enter or Space
- **THEN** the item toggles between expanded and collapsed
- **AND** the focused question shows a visible focus indicator

### Requirement: Expansion model

The accordion SHALL define whether multiple items may be open at once; the default MAY allow independent open/close per item. When single-open is chosen, opening one item SHALL close the previously open item.

#### Scenario: Independent items (multi-open default)

- **WHEN** the accordion allows multiple open items and the user expands a second item
- **THEN** both expanded items remain open

#### Scenario: Single-open mode

- **WHEN** the accordion is configured single-open and the user expands a second item
- **THEN** the previously open item collapses

### Requirement: Reduced motion

Answer expand/collapse transitions SHALL respect the user's reduced-motion preference.

#### Scenario: Reduced motion preference

- **WHEN** the user prefers reduced motion
- **THEN** answers appear/disappear without animated height transitions
