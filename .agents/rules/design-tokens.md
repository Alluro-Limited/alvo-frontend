# Design tokens

## Source of truth

- All colors, spacing, radius, typography, and elevation tokens live in `packages/design-tokens/src/index.css`.
- Never hard-code a hex, `hsl`, or `rgb` color in `apps/` or `packages/ui` source.
- Use the Tailwind utilities generated from the design tokens (e.g., `bg-primary-500`, `text-status-fail`).

## Extracting tokens from Figma

1. Pull values from Figma first. If the Figma MCP is rate-limited, ask the user for the exact hex values.
2. Add only values that are confirmed in the design file. Do not guess or pick visually close colors.
3. Keep the extracted swatches in the same order and with the same step labels used in Figma.

## Color token naming

- Use semantic names for brand/functional colors: `primary`, `secondary`, `success`, `warning`, `danger`, `accent`, `neutral`, `teal`, etc.
- Use stepped scales for color ramps: `0`, `50`, `100`, `150`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `850`, `900`, `950`, `1000`.
- Every base semantic color should have a `*-foreground` token.
- Status colors use the `status-*` namespace with `-subtle` and `-dark` modifiers: `status-success`, `status-success-subtle`, `status-success-dark`.

## Surface tokens

- `background` is the default app background.
- `surface` is an alternate/elevated background.
- `foreground` is the default text color.
- `border` is the default border color.

## Dark mode

- Keep dark values in `@media (prefers-color-scheme: dark)`.
- Later, when the project adds a `.dark` class variant, include a matching `.dark :root` override.

## What to avoid

- Do not invent names like `newBlue`, `lightishGray`, or `brandBlueV2`.
- Do not add one-off colors for a single component; add a token.
- Do not duplicate a color under two different names.
