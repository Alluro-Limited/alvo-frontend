const grouping = new Intl.NumberFormat("en-NG", {maximumFractionDigits: 0});

/** "16,425" / "2,392" — package volume and transaction counts. */
export function formatCount(value: number): string {
  return grouping.format(value);
}

/**
 * Compact naira without the symbol — the KPI cards style ₦ separately.
 * ≥₦1M → "4.15M"/"19.72M" (two decimals), ≥₦1k → "955k"/"980k", smaller → "0.00".
 * `zero` covers the design's three empty renderings: "0.00k" (overview money cards),
 * "0.00" (node revenue), and "0" (partner fees).
 */
export function formatCompactNaira(value: number, zero: "0.00k" | "0.00" | "0" = "0.00"): string {
  if (value === 0) return zero;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`;
  return value.toFixed(2);
}

/** Uptime cell color — green ≥96%, orange ≥95%, red below, matching the ranking table. */
export function uptimeTone(uptime: number): "good" | "warn" | "bad" {
  if (uptime >= 96) return "good";
  if (uptime >= 95) return "warn";
  return "bad";
}

/** Whole-percent text — "62% of total" and the donut's "60%" legend. */
export function formatPct(pct: number): string {
  return `${Math.round(pct)}%`;
}

/** One-decimal uptime cell text: "98.2%". */
export function formatUptime(uptime: number): string {
  return `${uptime.toFixed(1)}%`;
}
