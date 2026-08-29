# Typography

## Font family

- Primary: `Aeonik` (provide font files; set `--font-sans: "Aeonik", "Archivo", sans-serif;`).
- Fallback: `Archivo` from Google Fonts is already loaded.
- Use `font-sans` for body/headings; use `font-mono` only for code.

## Type scale

| Token       | Size | Line height | Letter spacing | Weights                      |
| ----------- | ---- | ----------- | -------------- | ---------------------------- |
| Display 1   | 60px | 110%        | -1%            | Bold, Black                  |
| Display 2   | 48px | 110%        | -1%            | Bold, Black                  |
| Display 3   | 42px | 110%        | -1%            | Bold, Black                  |
| Display 4   | 32px | 110%        | -1%            | Bold, Black                  |
| Heading 1   | 28px | 120%        | -1%            | Medium, Bold, Black          |
| Heading 2   | 24px | 120%        | -1%            | Medium, Bold, Black          |
| Heading 3   | 20px | 120%        | 0%             | Medium, Bold, Black          |
| Heading 4   | 18px | 120%        | 0%             | Medium, Bold, Black          |
| Paragraph 1 | 18px | 140%        | 1%             | Light, Regular, Medium, Bold |
| Paragraph 2 | 16px | 140%        | 1%             | Light, Regular, Medium, Bold |
| Paragraph 3 | 14px | 140%        | 1%             | Light, Regular, Medium, Bold |
| Paragraph 4 | 12px | 140%        | 1%             | Light, Regular, Medium, Bold |
| Paragraph 5 | 10px | 140%        | 1%             | Light, Regular, Medium, Bold |

## Colors

- Default text: `--foreground` / `#070d17`
- Secondary/muted text: `--color-grey-600` / `#6a6e74` (paragraph labels)
- Placeholders/descriptions: `#98a2b3`

## Mapping to Tailwind

Use explicit sizes and tracking instead of `text-6xl` etc. to match Figma exactly:

- Display 1: `text-[60px] leading-[1.1] tracking-[-0.01em]`
- Display 2: `text-[48px] leading-[1.1] tracking-[-0.01em]`
- Display 3: `text-[42px] leading-[1.1] tracking-[-0.01em]`
- Display 4: `text-[32px] leading-[1.1] tracking-[-0.01em]`
- Heading 1: `text-[28px] leading-[1.2] tracking-[-0.01em]`
- Heading 2: `text-[24px] leading-[1.2] tracking-[-0.01em]`
- Heading 3: `text-[20px] leading-[1.2] tracking-[0]`
- Heading 4: `text-[18px] leading-[1.2] tracking-[0]`
- Paragraph 1: `text-[18px] leading-[1.4] tracking-[0.01em]`
- Paragraph 2: `text-[16px] leading-[1.4] tracking-[0.01em]`
- Paragraph 3: `text-[14px] leading-[1.4] tracking-[0.01em]`
- Paragraph 4: `text-[12px] leading-[1.4] tracking-[0.01em]`
- Paragraph 5: `text-[10px] leading-[1.4] tracking-[0.01em]`

## Buttons and tags

- Button/Tag large: `text-[18px] tracking-[0.02em]`
- Button/Tag small: `text-[16px] tracking-[0.02em]`
- Use `cap-height` / `text-box-trim` vertical trim where supported.

## Headings hierarchy

- Page hero / largest heading: Display 1
- Page title: Display 2 or Heading 1
- Section title: Heading 2
- Card title: Heading 3
- Subheading: Heading 4
