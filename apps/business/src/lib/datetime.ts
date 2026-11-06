/** Display formatting for API timestamps — the wire carries ISO strings. */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const time = (d: Date) => {
  let h = d.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${String(d.getMinutes()).padStart(2, "0")} ${ampm}`;
};

/** "10 Feb 2026" — batch rows. */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "13 Mar 2026 · 3:18 PM" — wallet transactions. */
export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} · ${time(new Date(iso))}`;
}
