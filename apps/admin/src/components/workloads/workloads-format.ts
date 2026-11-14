import {m} from "@/paraglide/messages";

const EMPTY = "—";

/** Null for missing/unparseable timestamps — the API emits `null` for absent dates. */
function parseDate(iso?: string | null): Date | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** SLA cell label: remaining minutes → "1h 14m" / "56m"; null → "Done". */
export function formatSla(minutes: number | null): string {
  if (minutes === null) return m["workloads.sla_done"]();
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

/** Timeline stamp like "Today, 9:15 AM", falling back to "16 Mar, 9:15 AM" for other days. */
export function formatTimelineAt(iso: string): string {
  const date = parseDate(iso);
  if (!date) return EMPTY;
  const now = new Date();
  const time = date.toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit"});
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) return `Today, ${time}`;
  const day = date.toLocaleDateString("en-GB", {day: "numeric", month: "short"});
  return `${day}, ${time}`;
}

/** 1 → "1st", 2 → "2nd", 3 → "3rd", 4+ → "Nth" — labels for numbered route timelines. */
export function formatOrdinal(n: number): string {
  const suffix =
    n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th";
  return `${n}${suffix}`;
}

function dayDiff(iso: string): number | null {
  const then = parseDate(iso);
  if (!then) return null;
  const now = new Date();
  return Math.round((startOfDay(now).getTime() - startOfDay(then).getTime()) / 86_400_000);
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** Safe table "Stored" cell: "Today", "1 day ago", or "{count} days ago". */
export function formatStoredAgo(iso: string): string {
  const days = dayDiff(iso);
  if (days === null) return EMPTY;
  if (days <= 0) return m["workloads.stored_today"]();
  if (days === 1) return m["workloads.stored_day_ago"]();
  return m["workloads.stored_days_ago"]({count: days});
}

/** Safe info-card Date row — "16 Mar 2026". */
export function formatSafeDate(iso: string): string {
  const date = parseDate(iso);
  return date ? date.toLocaleDateString("en-GB", {day: "numeric", month: "short", year: "numeric"}) : EMPTY;
}

/** Safe info-card Duration row — how many days the item has been stored. */
export function formatStorageDuration(storedAt: string): string {
  const days = dayDiff(storedAt);
  return days === null ? EMPTY : m["workloads.duration_days"]({count: Math.max(0, days)});
}

/** Safe info-card "Expires in" row — "4 days (21 May, 2026 · 9:15 AM)". */
export function formatExpiresIn(expiresAt: string): string {
  const date = parseDate(expiresAt);
  if (!date) return EMPTY;
  const days = Math.max(0, Math.round((date.getTime() - Date.now()) / 86_400_000));
  const at = `${date.toLocaleDateString("en-GB", {day: "numeric", month: "short", year: "numeric"})} · ${date.toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit"})}`;
  return m["workloads.expires_in"]({days, at});
}

/** Triggers a browser download of the CSV body returned by the workloads service. */
export function downloadCsv(csv: string): void {
  const url = URL.createObjectURL(new Blob([csv], {type: "text/csv"}));
  const link = document.createElement("a");
  link.href = url;
  link.download = "workloads-parcels.csv";
  link.click();
  URL.revokeObjectURL(url);
}
