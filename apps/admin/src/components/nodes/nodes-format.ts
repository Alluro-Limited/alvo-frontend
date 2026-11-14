import {m} from "@/paraglide/messages";

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

const EMPTY = "—";

/** Null for missing/unparseable timestamps — the API emits `null` for absent dates. */
function parseDate(iso?: string | null): Date | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Heartbeat age like the detail card's "8s ago" / "2m ago". */
export function formatHeartbeat(iso: string, now = Date.now()): string {
  const date = parseDate(iso);
  if (!date) return EMPTY;
  const elapsed = Math.max(0, now - date.getTime());
  if (elapsed < MINUTE_MS) return m["nodes.heartbeat_seconds_ago"]({count: Math.max(1, Math.round(elapsed / 1000))});
  if (elapsed < HOUR_MS) return m["nodes.heartbeat_minutes_ago"]({count: Math.round(elapsed / MINUTE_MS)});
  if (elapsed < DAY_MS) return m["nodes.heartbeat_hours_ago"]({count: Math.round(elapsed / HOUR_MS)});
  return m["nodes.heartbeat_days_ago"]({count: Math.round(elapsed / DAY_MS)});
}

/** Content age like the contents list's "2h ago" / "3 days ago". */
export function formatSinceAgo(iso: string, now = Date.now()): string {
  const date = parseDate(iso);
  if (!date) return EMPTY;
  const elapsed = Math.max(0, now - date.getTime());
  if (elapsed < HOUR_MS) return m["nodes.heartbeat_minutes_ago"]({count: Math.max(1, Math.round(elapsed / MINUTE_MS))});
  if (elapsed < DAY_MS) return m["nodes.time_hours"]({count: Math.round(elapsed / HOUR_MS)});
  return m["nodes.time_days"]({count: Math.round(elapsed / DAY_MS)});
}

const MONTH_YEAR = new Intl.DateTimeFormat("en-US", {month: "short", year: "numeric"});
const DAY_MONTH_YEAR = new Intl.DateTimeFormat("en-US", {month: "short", day: "numeric", year: "numeric"});

/** "Mar 2025" for the installed meta line. */
export function formatInstalled(iso: string): string {
  const date = parseDate(iso);
  return date ? MONTH_YEAR.format(date) : EMPTY;
}

/** "May 10, 2026" for maintenance history rows. */
export function formatEventDate(iso: string): string {
  const date = parseDate(iso);
  return date ? DAY_MONTH_YEAR.format(date) : EMPTY;
}
