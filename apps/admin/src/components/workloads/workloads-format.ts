import {m} from "@/paraglide/messages";

/** SLA cell label: remaining minutes → "1h 14m" / "56m"; null → "Done". */
export function formatSla(minutes: number | null): string {
  if (minutes === null) return m["workloads.sla_done"]();
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

/** Timeline stamp like "Today, 9:15 AM", falling back to "16 Mar, 9:15 AM" for other days. */
export function formatTimelineAt(iso: string): string {
  const date = new Date(iso);
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

/** Triggers a browser download of the CSV body returned by the workloads service. */
export function downloadCsv(csv: string): void {
  const url = URL.createObjectURL(new Blob([csv], {type: "text/csv"}));
  const link = document.createElement("a");
  link.href = url;
  link.download = "workloads-parcels.csv";
  link.click();
  URL.revokeObjectURL(url);
}
