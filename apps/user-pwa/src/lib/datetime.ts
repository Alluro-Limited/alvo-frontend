/** Display formatting for API timestamps — the wire carries ISO strings, the screens show copy like "Dec 22, 11:34 AM". */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const time = (d: Date) => {
  let h = d.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${String(d.getMinutes()).padStart(2, "0")} ${ampm}`;
};

const ordinal = (day: number) => {
  if (day >= 11 && day <= 13) return `${day}th`;
  return `${day}${["th", "st", "nd", "rd"][day % 10] ?? "th"}`;
};

const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const yesterday = (now: Date) => {
  const d = new Date(now);
  d.setDate(d.getDate() - 1);
  return d;
};

/** "Dec 22, 11:34 AM" — code windows and booking confirmations. */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${time(d)}`;
}

/** "20 Dec, 10:15 AM" — timeline events. */
export function formatShortDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${time(d)}`;
}

/** "11:03 AM" — notification rows. */
export function formatTime(iso: string): string {
  return time(new Date(iso));
}

/** "20th Dec, 2025 • 3:45PM" — the activity card's ETA line. */
export function formatEta(iso: string): string {
  const d = new Date(iso);
  return `${ordinal(d.getDate())} ${MONTHS[d.getMonth()]}, ${d.getFullYear()} • ${time(d).replace(" ", "")}`;
}

/** "Tomorrow, 8:00 AM"-style arrival hints — relative day plus the earliest ETA time. */
export function formatArrival(iso: string, now: Date = new Date()): string {
  const d = new Date(iso);
  if (sameDay(d, now)) return `Today, ${time(d)}`;
  if (sameDay(d, yesterday(now))) return `Yesterday, ${time(d)}`;
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (sameDay(d, tomorrow)) return `Tomorrow, ${time(d)}`;
  return formatDateTime(iso);
}

/** "7 hours 59 mins remaining" / "2 days remaining" — countdown copy under access codes. */
export function formatRemaining(iso: string, now: Date = new Date()): string {
  const ms = new Date(iso).getTime() - now.getTime();
  if (ms <= 0) return "expired";
  const mins = Math.floor(ms / 60_000);
  if (mins >= 60 * 24) {
    const days = Math.floor(mins / (60 * 24));
    return `${days} day${days === 1 ? "" : "s"} remaining`;
  }
  const hours = Math.floor(mins / 60);
  const rest = mins % 60;
  if (hours === 0) return `${rest} min${rest === 1 ? "" : "s"} remaining`;
  return `${hours} hour${hours === 1 ? "" : "s"} ${rest} mins remaining`;
}

/** "today" / "yesterday" / "dd/mm/yyyy" — activity-feed day-group keys (today/yesterday localize downstream). */
export function dayKey(iso: string, now: Date = new Date()): string {
  const d = new Date(iso);
  if (sameDay(d, now)) return "today";
  if (sameDay(d, yesterday(now))) return "yesterday";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

/** "Today" / "Yesterday" / "dd/mm/yyyy" — notification and transaction section labels. */
export function sectionLabel(iso: string, now: Date = new Date()): string {
  const d = new Date(iso);
  if (sameDay(d, now)) return "Today";
  if (sameDay(d, yesterday(now))) return "Yesterday";
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

/** "Oct 22, 2024" — transaction row dates. */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** "0.5km away" / "120m away" — node distances. */
export function formatDistance(meters: number): string {
  return meters >= 950 ? `${(meters / 1000).toFixed(1)}km away` : `${Math.round(meters)}m away`;
}
