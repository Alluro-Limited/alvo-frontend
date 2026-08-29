# Inputs

## Use Base UI primitives

- Build every input from `@base-ui/react` primitives (`Input`, `OTPField`, `Field`, `Checkbox`, `Radio`, `Switch`).
- Never use Radix, shadcn, or uncontrolled native-only inputs.

## Style with design tokens

- Use colors, radii, spacing, and typography from `@alvo/design-tokens`.
- Empty/unselected states use `grey-300`.
- Active/focused states use `teal-500`.
- Invalid states use `status-fail` (`#dd524d`).
- Disabled states use `neutral` greys with `cursor-not-allowed` and `opacity-50`.

## States every input must support

- `default` / `empty`
- `focus` / `active`
- `filled`
- `invalid`
- `disabled`
- `readonly` (where applicable)

## Code input (PinInput)

- Use `OTPField` from `@base-ui/react/otp-field`.
- Support `length` (4, 6, etc.), `mask`, `value`, `onChange`, `onComplete`, `disabled`, `invalid`.
- Slots are `48px` circular cells.
- Empty slot = `bg-grey-300` dot.
- Focused empty slot = `bg-teal-500` dot.
- Filled slot = `text-teal-800` number.
- Masked slot = `text-teal-500` bullets.
- Invalid slot = `bg-status-fail` dot/text.

## Text input (Input)

- Use `Input` from `@base-ui/react/input`.
- Full width, `50px` height, `rounded-lg`, `px-4`, `text-base`.
- Border `grey-300`, focus `teal-500` ring.
- Invalid = `status-fail` border.
- Disabled = `neutral-100` background.

## Labels and validation

- Pair inputs with `Field.Label`, `Field.Description`, and `Field.Error` from `@base-ui/react/field`.
- Do not hardcode error messages; the consuming app provides them via `Field.Error` or `aria-describedby`.
