import type {
  CompartmentGroup,
  NodeContentItem,
  NodeConnectivity,
  NodeDetail,
  NodeMaintenanceEvent,
  NodeRow,
  NodeSensor,
  NodeStatus,
  NodeStatusOption,
} from "@/types/nodes-types";
import {daysAhead, hoursAgo, monthsAgo, type NodeSeed, nodeRowsStore, secondsAgo, seedById} from "./mock-nodes-data";

const OFFLINE_REASONS = ["power_failure", "connectivity_issue", "hardware_fault", "others"];
const MAINTENANCE_REASONS = ["scheduled_service", "compartment_repair", "hardware_upgrade", "partner_request", "others"];
const WARNING_REASONS = ["partner_request", "contract_ended", "location_closed", "others"];
const ONLINE_REASONS = ["resolved", "reconnected", "back_in_service", "others"];
const DECOMMISSIONED_REASONS = ["contract_ended", "location_closed", "replaced", "others"];

/** Allowed transitions per current status — mirrors what a backend policy would return. */
export function statusOptionsFor(current: NodeStatus): NodeStatusOption[] {
  const targets: NodeStatusOption[] = [
    {status: "online", reasons: ONLINE_REASONS},
    {status: "offline", reasons: OFFLINE_REASONS},
    {status: "warning", reasons: WARNING_REASONS},
    {status: "maintenance", reasons: MAINTENANCE_REASONS},
    {status: "full", reasons: null},
    {status: "decommissioned", reasons: DECOMMISSIONED_REASONS},
  ];
  return current === "decommissioned"
    ? targets.filter((option) => option.status === "online")
    : targets.filter((option) => option.status !== current);
}

const CONTENTS: NodeContentItem[] = [
  {id: "PRV-88201", kind: "parcel", owner: "Kemi Adeyemi", slot: "A3", sinceAt: hoursAgo(2), label: "Awaiting pickup"},
  {id: "SFE-10083", kind: "safe", owner: "Kemi Adeyemi", slot: "A3", sinceAt: hoursAgo(72), label: "Active storage"},
  {id: "PRV-88245", kind: "parcel", owner: "Kemi Adeyemi", slot: "A3", sinceAt: hoursAgo(2), label: "Awaiting pickup"},
  {id: "PRV-88251", kind: "parcel", owner: "Kemi Adeyemi", slot: "A3", sinceAt: hoursAgo(2), label: "Awaiting pickup"},
];

const MAINTENANCE_LOG: NodeMaintenanceEvent[] = [1, 2, 3, 4].map((index) => ({
  id: `mnt-${index}`,
  title: "Scheduled service",
  at: monthsAgo(index),
  vendor: "Techfix Ltd",
  status: "completed",
}));

function compartmentsFor(used: number, total: number): CompartmentGroup[] {
  const occupied = Math.round(used / 6);
  const breakdown = (unit: "slots" | "items") => [
    {size: "small" as const, count: occupied, unit},
    {size: "medium" as const, count: occupied, unit},
    {size: "large" as const, count: occupied, unit},
  ];
  return [
    {key: "pickup", used, total, unit: "slots", breakdown: breakdown("slots")},
    {key: "dropoff", used: used === 0 ? 0 : 109, total: 2400, unit: "kg", breakdown: breakdown("items")},
  ];
}

/** Nodes with zero slots occupied show the empty contents/maintenance states from Figma. */
function activityFor(seed: NodeSeed): {contents: NodeContentItem[]; maintenance: NodeMaintenanceEvent[]} {
  if (seed.used === 0) return {contents: [], maintenance: []};
  const contents = CONTENTS.slice(0, Math.min(4, Math.max(1, Math.round(seed.used / 6))));
  const maintenance = [...MAINTENANCE_LOG];
  if (seed.status === "maintenance") {
    maintenance.push({id: "mnt-next", title: "Scheduled service", at: daysAhead(3), vendor: "Techfix Ltd", status: "scheduled"});
  }
  return {contents, maintenance};
}

const NETWORK_VALUE: Record<NodeConnectivity, string> = {
  "4g_lte": "4G LTE",
  "3g": "3G",
  unstable: "Unstable",
  no_signal: "No signal",
};

function sensorsFor(row: NodeRow): NodeSensor[] {
  const weakSignal = row.connectivity === "unstable" || row.connectivity === "no_signal";
  const offline = row.status === "offline";
  return [
    {key: "network", label: "Network signal", value: NETWORK_VALUE[row.connectivity], tone: weakSignal ? "warn" : "ok"},
    {key: "power", label: "Power status", value: offline ? "On battery" : "Mains connected", tone: offline ? "warn" : "ok"},
    {key: "door", label: "Door sensor", value: "Operational", tone: "ok"},
    {key: "tamper", label: "Tamper detection", value: "No incidents", tone: "ok"},
  ];
}

/** Detail payload for a node — ND-10076 mirrors the Figma detail page. */
export function nodeDetailFor(id: string): NodeDetail | undefined {
  const row = nodeRowsStore.find((node) => node.id === id);
  const seed = seedById.get(id);
  if (!row) return undefined;
  const showcase = id === "ND-10076";
  const {contents, maintenance} = seed ? activityFor(seed) : {contents: [], maintenance: []};
  return {
    id: row.id,
    code: showcase ? "LK-022" : `LK-${id.slice(3)}`,
    name: row.name,
    status: row.status,
    partner: row.partner,
    zone: row.zone,
    region: `Lagos · ${row.zone}`,
    address: showcase ? "Plot 12, Adeola Odeku, VI" : `${row.zone}, Lagos`,
    installedAt: monthsAgo(14),
    uptimeToday: showcase ? 99.8 : 96.2,
    lastHeartbeatAt: row.status === "offline" ? hoursAgo(3) : secondsAgo(8),
    connectivity: row.connectivity,
    pickupOccupancy: row.capacity,
    compartments: compartmentsFor(row.capacity.used, row.capacity.total),
    sensors: sensorsFor(row),
    contents,
    maintenance,
    statusOptions: statusOptionsFor(row.status),
    position: row.position,
  };
}
