## Purpose

Defines the "The privacy people didn't know they were missing" section: a network/node diagram with a single highlighted node paired with a customer testimonial quote and attribution, illustrating privacy-preserving delivery socially.

## ADDED Requirements

### Requirement: Section heading and testimonial quote

The section SHALL present an `h2` heading ("The privacy people didn't know they were missing") and a testimonial quote with attribution (name and role). The quote SHALL use semantic quotation markup (`blockquote` with attribution) and come from i18n/config.

#### Scenario: Quote semantics

- **WHEN** the section renders
- **THEN** the testimonial is marked up as a quotation with a visible attribution (name and role)

### Requirement: Network/node diagram

The section SHALL render a network/node diagram with one visually highlighted central node. The diagram SHALL be treated as decorative or given a concise text alternative that conveys its meaning (a connected privacy network) without requiring perception of individual nodes.

#### Scenario: Diagram alternative

- **WHEN** assistive technology encounters the node diagram
- **THEN** it is either hidden as decorative or announced with a concise alternative describing a connected privacy network

#### Scenario: Highlighted node

- **WHEN** the diagram renders
- **THEN** exactly one node is visually highlighted using token-based emphasis (primary) against the other nodes

### Requirement: Responsive layout

On desktop the diagram and quote MAY be composed together (quote overlaid or beside the diagram); on mobile the content SHALL reflow so the heading, diagram, and quote remain in readable order using the documented spacing scale.

#### Scenario: Mobile reflow

- **WHEN** the viewport is mobile width
- **THEN** the heading, diagram, and quote appear in readable vertical order without overlap that obscures text
