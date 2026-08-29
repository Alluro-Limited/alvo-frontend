# Spacing

## 8px grid

Priveace uses an 8px base grid. All spacing, padding, margins, and gaps should land on multiples of 4px, with a strong preference for the 8px scale.

## Spacing preset values

Use the following step values. Each maps to a Tailwind spacing step:

| px   | Tailwind    | Token        |
| ---- | ----------- | ------------ |
| 4px  | `0.5` / `1` | `--space-1`  |
| 8px  | `2`         | `--space-2`  |
| 12px | `3`         | `--space-3`  |
| 16px | `4`         | `--space-4`  |
| 24px | `6`         | `--space-6`  |
| 28px | `7`         | `--space-7`  |
| 32px | `8`         | `--space-8`  |
| 36px | `9`         | `--space-9`  |
| 40px | `10`        | `--space-10` |
| 44px | `11`        | `--space-11` |
| 48px | `12`        | `--space-12` |
| 56px | `14`        | `--space-14` |
| 64px | `16`        | `--space-16` |

Above 44px, continue in `8px` increments (`48, 56, 64, 72, 80…`).

## Grid system

- **Mobile Screen Vertical** — 4 columns | Margin `24px` | Gutter `12px`
- **Cards Vertical** — 4 columns | Margin `16px` | Gutter `16px`
- **Cards Horizontal** — 3 rows | Margin `16px` | Gutter `16px`

## Usage rules

- Use `gap-{n}` for component and container gaps.
- Use `p-{n}` and `m-{n}` for padding and margins.
- Use `px-{n}` and `py-{n}` for directional spacing.
- Avoid arbitrary spacing values (`[13px]`, `[19px]`) unless they are direct translations from a one-off Figma element.
- Page containers: `px-6` (24px) on mobile, `px-8` (32px) on tablet, `px-10` (40px) on desktop.
- Card internal padding: `p-4` (16px) or `p-6` (24px).
- Section vertical spacing: `gap-8` (32px) to `gap-12` (48px).

## Border radius

- Small: `4px` (`rounded`)
- Medium: `8px` (`rounded-lg`)
- Large: `16px` (`rounded-2xl`)
- Full page cards: `24px` (`rounded-3xl`)
- Pills and tags: `full` (`rounded-full`)
