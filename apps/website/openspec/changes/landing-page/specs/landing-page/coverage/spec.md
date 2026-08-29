## Purpose

Defines the "Live in Lagos state. Growing fast." coverage section: expansion messaging paired with a map graphic and a location marker communicating current service area and growth.

## ADDED Requirements

### Requirement: Section heading and coverage copy

The section SHALL present an eyebrow label ("Coverage"), an `h2` heading ("Live in Lagos state. Growing fast."), and a supporting paragraph about pilot coverage and nationwide expansion. All copy SHALL come from i18n keys.

#### Scenario: Section content

- **WHEN** the section renders
- **THEN** it shows the eyebrow, `h2` heading, and supporting paragraph

### Requirement: Coverage map graphic

The section SHALL include a map graphic with a location marker over the served region. The map SHALL be treated as decorative or given a concise text alternative conveying the served area (e.g., "Currently serving Lagos, Nigeria, expanding nationwide").

#### Scenario: Map alternative

- **WHEN** assistive technology encounters the coverage map
- **THEN** it is either hidden as decorative or announced with a concise alternative naming the served area

#### Scenario: Marker emphasis

- **WHEN** the map renders
- **THEN** the location marker is emphasized using token-based primary color over the map

### Requirement: Responsive layout

On desktop the coverage copy and map SHALL appear side by side; on mobile they SHALL stack with copy first, then map, using the documented spacing scale.

#### Scenario: Mobile stacking

- **WHEN** the viewport is mobile width
- **THEN** the coverage copy stacks above the map graphic

#### Scenario: Desktop columns

- **WHEN** the viewport is desktop width
- **THEN** the coverage copy and map are arranged side by side within the container
