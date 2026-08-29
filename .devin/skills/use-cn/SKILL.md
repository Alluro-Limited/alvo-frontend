# use-cn

Use `cn` from `cnfast` for all conditional class merging in the Alvo frontend.

## Why

`cnfast` is the chosen `clsx` + `tailwind-merge` replacement across the monorepo. Using one utility keeps bundles consistent and avoids duplicate logic.

## How

### In packages

```ts
// packages/ui/src/components/ui/button.tsx
import { cn } from "cnfast";

<button className={cn(buttonVariants({ variant, size }), className)} />
```

### In apps

```ts
// apps/website/src/pages/home.tsx
import { cn } from "cnfast";

<div className={cn("bg-background p-4", className)} />
```

## Do not

- Import `cn` from `@/lib/utils`.
- Import `clsx` or `tailwind-merge` directly.
- Add another `cn` utility.
