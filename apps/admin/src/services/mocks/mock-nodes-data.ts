import type {NodeMetrics, NodeRow} from "@/types/nodes-types";
import {NODE_SEEDS} from "./mock-node-seeds";

export type {NodeSeed} from "./mock-node-seeds";

export const MOCK_NODE_PAGE_SIZE = 10;
export const MOCK_NODE_TOTAL = 53;

export function hoursAgo(hours: number): string {
  const date = new Date();
  date.setHours(date.getHours() - hours, date.getMinutes() - 3);
  return date.toISOString();
}

export function secondsAgo(seconds: number): string {
  const date = new Date();
  date.setSeconds(date.getSeconds() - seconds);
  return date.toISOString();
}

export function monthsAgo(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString();
}

export function daysAhead(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

/** Mutable row store — registrations and status changes persist for the session. */
export const nodeRowsStore: NodeRow[] = NODE_SEEDS.map((seed) => ({
  id: seed.id,
  name: seed.name,
  partner: seed.partner,
  zone: seed.zone,
  capacity: {used: seed.used, total: seed.total},
  connectivity: seed.connectivity,
  status: seed.status,
  position: seed.position,
}));

export const seedById = new Map(NODE_SEEDS.map((seed) => [seed.id, seed]));

/** Metrics are server-computed over the whole fleet, independent of the active filters. */
export function nodeMetricsFor(rows: NodeRow[]): NodeMetrics {
  return {
    total: MOCK_NODE_TOTAL,
    online: rows.filter((row) => row.status === "online").length + 23,
    offline: rows.filter((row) => row.status === "offline").length + 3,
    warning: rows.filter((row) => row.status === "warning").length,
    maintenance: rows.filter((row) => row.status === "maintenance").length + 1,
    fullCapacity: rows.filter((row) => row.status === "full").length + 11,
  };
}

export const NODE_STATUS_FILTERS: string[] = ["online", "offline", "warning", "maintenance", "full", "decommissioned"];
