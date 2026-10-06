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

/** Triggers a browser download of the CSV body returned by the workloads service. */
export function downloadCsv(csv: string): void {
  const url = URL.createObjectURL(new Blob([csv], {type: "text/csv"}));
  const link = document.createElement("a");
  link.href = url;
  link.download = "workloads-parcels.csv";
  link.click();
  URL.revokeObjectURL(url);
}
