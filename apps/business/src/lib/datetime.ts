/** Display formatting for API timestamps — the wire carries ISO strings. */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const EMPTY = "—";

/** Null for missing/unparseable timestamps — the API emits `null` for absent dates. */
function parseDate(iso?: string | null): Date | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

const time = (d: Date) => {
  let h = d.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${String(d.getMinutes()).padStart(2, "0")} ${ampm}`;
};

/** "10 Feb 2026" — batch rows. */
export function formatDate(iso?: string | null): string {
  const d = parseDate(iso);
  return d ? `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}` : EMPTY;
}

/** "13 Mar 2026 · 3:18 PM" — wallet transactions. */
export function formatDateTime(iso?: string | null): string {
  const d = parseDate(iso);
  return d ? `${formatDate(iso)} · ${time(d)}` : EMPTY;
}
