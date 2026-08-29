## Purpose

Defines the "From drop-off to pickup in four quiet steps" section: a horizontally navigable carousel of four numbered step cards (Book it, Drop-off, Smart routing, Collect), each pairing a phone mockup with a title and description, explaining the end-to-end sender flow.

## ADDED Requirements

### Requirement: Section heading and steps

The section SHALL present an `h2` heading ("From drop-off to pickup in four quiet steps") and four ordered step cards, each with a step label/number, a title, a description, and a phone mockup image. All text SHALL come from i18n keys.

#### Scenario: Four steps present

- **WHEN** the section renders
- **THEN** four step cards are present in order: Book it, Drop-off, Smart routing, Collect
- **AND** each card shows a title, description, and phone mockup

### Requirement: Carousel navigation controls

The step cards SHALL be presented in a carousel with previous/next controls. Controls SHALL be keyboard operable and expose accessible names, and SHALL indicate when no further advance is possible.

#### Scenario: Advancing steps

- **WHEN** the user activates the next control
- **THEN** the carousel advances to reveal the following step card(s)

#### Scenario: Reaching the end

- **WHEN** the last step card is fully in view
- **THEN** the next control is disabled or communicates that there are no further steps

#### Scenario: Keyboard operation

- **WHEN** a keyboard user focuses the carousel controls
- **THEN** previous/next can be triggered via keyboard and the focused step remains visible

### Requirement: Carousel accessibility semantics

The carousel SHALL expose an accessible structure (e.g., a labelled group/region with each slide programmatically identified) so assistive technology can perceive the number of steps and the current position.

#### Scenario: Screen reader perceives steps

- **WHEN** a screen reader navigates the carousel
- **THEN** the region is labelled and each step is announced with its position (e.g., "step 2 of 4")

### Requirement: Reduced motion

Carousel transitions SHALL respect the user's reduced-motion preference by disabling or minimizing animated movement.

#### Scenario: Reduced motion preference

- **WHEN** the user prefers reduced motion
- **THEN** carousel transitions occur without animated sliding movement

### Requirement: Responsive behavior

On desktop multiple step cards MAY be visible at once with the fourth partially revealed to signal scrollability; on mobile one card SHALL be prominently visible with swipe/scroll access to the rest. Layout SHALL use the documented spacing scale.

#### Scenario: Mobile single-card view

- **WHEN** the viewport is mobile width
- **THEN** one step card is prominently shown and the remaining cards are reachable by horizontal swipe/scroll or the controls

#### Scenario: Desktop multi-card view

- **WHEN** the viewport is desktop width
- **THEN** multiple step cards are visible with a visual cue that more steps exist
