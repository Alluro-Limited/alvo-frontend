/** `48500` → `48,500`, `0` → `0.00`: whole amounts stay integer-only, zero shows decimals. */
export function formatNaira(amount: number | undefined) {
  const value = amount ?? 0;
  return value.toLocaleString("en-NG", {minimumFractionDigits: value === 0 ? 2 : 0});
}
