import {m} from "@/paraglide/messages";

const wholeGrouping = new Intl.NumberFormat("en-NG", {maximumFractionDigits: 0});
const decimalGrouping = new Intl.NumberFormat("en-NG", {minimumFractionDigits: 2, maximumFractionDigits: 2});

/** Revenue figure without the ₦ symbol (the design styles the symbol separately): `0` → `0.00`, `201892` → `201,892`. */
export function formatNairaAmount(value: number): string {
  return value === 0 || value % 1 !== 0 ? decimalGrouping.format(value) : wholeGrouping.format(value);
}

const SECOND_MS = 1_000;
const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/** Relative activity time like the feed's "8 seconds ago" / "6m ago" / "2h ago". */
export function formatRelativeTime(iso: string, now = Date.now()): string {
  const elapsed = Math.max(0, now - new Date(iso).getTime());
  if (elapsed < MINUTE_MS) return m["overview.time_seconds_ago"]({seconds: Math.round(elapsed / SECOND_MS)});
  if (elapsed < HOUR_MS) return m["overview.time_minutes_ago"]({minutes: Math.max(1, Math.round(elapsed / MINUTE_MS))});
  if (elapsed < DAY_MS) return m["overview.time_hours_ago"]({hours: Math.round(elapsed / HOUR_MS)});
  return m["overview.time_days_ago"]({days: Math.round(elapsed / DAY_MS)});
}

/** ETA clock label like the courier popover's "5:30PM". */
export function formatEta(iso: string): string {
  const date = new Date(iso);
  const hour = date.getHours() % 12 || 12;
  return `${hour}:${String(date.getMinutes()).padStart(2, "0")}${date.getHours() >= 12 ? "PM" : "AM"}`;
}
