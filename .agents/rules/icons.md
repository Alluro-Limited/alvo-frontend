# Icons

## Installed icon libraries

All apps can import these directly because they are shared workspace dependencies in `@alvo/ui`:

- `@hugeicons/react` + `@hugeicons/core-free-icons` — Hugeicons `StrokeRounded` (line) and `SolidRounded` (fill) styles
- `lucide-react` — Lucide feather-style icons

## When to use each

- **Hugeicons** — primary icon set for the Priveace/Alvo design system. Use for navigation, actions, form icons, status, etc.
- **Lucide** — fallback for any Hugeicons icon that is missing, or when a Lucide icon is a closer match to the Figma.

## Usage

Apps import directly from the package; the libraries live in `@alvo/ui` dependencies and are hoisted to the workspace root.

### Hugeicons

```tsx
import {HugeiconsIcon} from "@hugeicons/react";
import {SearchIcon} from "@hugeicons/core-free-icons";

<HugeiconsIcon icon={SearchIcon} size={24} color="currentColor" strokeWidth={1.5} />;
```

### Lucide

```tsx
import {Search} from "lucide-react";

<Search size={24} className="text-teal-500" />;
```

## Naming

- Use PascalCase React component names in code (`SearchIcon`, `Search`).
- If a Figma icon does not exist in the installed libraries, download its SVG from Figma and add it to `packages/ui/src/icons/{set}/{name}.tsx` as a React component, then re-export from `packages/ui/src/icons/index.ts`.

## Missing icons

1. Search Hugeicons first, then Lucide.
2. If not found, download the SVG asset from the Figma node.
3. Run `bunx svgo` on the SVG if needed, then create a typed React component.
4. Add it to `packages/ui/src/icons/index.ts` and `packages/ui/src/index.ts`.

## Default styling

- Size: `24px` unless the Figma says otherwise.
- Color: `currentColor` so the parent text color applies.
- Stroke width for Hugeicons: `1.5` by default, `2` for bold/emphasis.
- Use `className` to override color, size, or opacity.
