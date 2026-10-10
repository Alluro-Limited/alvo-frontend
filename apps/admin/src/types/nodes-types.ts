import type {Page} from "./workloads-types";

/** Operational states the backend reports for a physical node. */
export type NodeStatus = "online" | "offline" | "warning" | "maintenance" | "full" | "decommissioned";

/** Connectivity quality shown in the Network column — drives the signal dot. */
export type NodeConnectivity = "4g_lte" | "3g" | "unstable" | "no_signal";

/** Metric keys for the strip above the list — order in the payload is the display order. */
export type NodeMetricKey = "total" | "online" | "offline" | "warning" | "maintenance" | "fullCapacity";

export type NodeMetrics = Partial<Record<NodeMetricKey, number>>;

/** Slots or kilograms used vs total, e.g. 18/24 slots or 109/2400 kg. */
export interface NodeCapacity {
  used: number;
  total: number;
}

/** One row in the Nodes table. `position` is [lng, lat] for the Map view. */
export interface NodeRow {
  id: string;
  name: string;
  partner: string;
  /** Zone/Area label, e.g. "Lekki". */
  zone: string;
  capacity: NodeCapacity;
  connectivity: NodeConnectivity;
  status: NodeStatus;
  position: [number, number];
}

export interface NodeListParams {
  query?: string;
  status?: string;
  page: number;
}

export interface NodeListResponse {
  metrics: NodeMetrics;
  nodes: Page<NodeRow>;
  /** Status filter options — supplied by the backend, not hardcoded. */
  filters: {statuses: string[]};
}

export type CompartmentSize = "small" | "medium" | "large";

/** One compartment family on the detail page — pickup slots or the drop-off bay. */
export interface CompartmentGroup {
  key: "pickup" | "dropoff";
  used: number;
  total: number;
  /** Pickup counts slots; the drop-off bay is metered in kilograms. */
  unit: "slots" | "kg";
  /** Per-size occupancy chips under the progress bar. */
  breakdown: {size: CompartmentSize; count: number; unit: "slots" | "items"}[];
}

export type NodeSensorKey = "network" | "power" | "door" | "tamper";

export interface NodeSensor {
  key: NodeSensorKey;
  label: string;
  value: string;
  /** "warn" tints the icon tile red — e.g. degraded network. */
  tone: "ok" | "warn";
}

/** A parcel or safe item currently inside the node. */
export interface NodeContentItem {
  id: string;
  kind: "parcel" | "safe";
  owner: string;
  slot: string;
  /** ISO timestamp — renders as "2h ago". */
  sinceAt: string;
  /** Right-side state label, e.g. "Awaiting pickup" / "Active storage". */
  label: string;
}

export interface NodeMaintenanceEvent {
  id: string;
  /** e.g. "Scheduled service". */
  title: string;
  /** ISO timestamp. */
  at: string;
  vendor: string;
  status: "completed" | "scheduled" | "in_progress";
}

/** An allowed status transition — `reasons` is null when the target needs none (e.g. Full). */
export interface NodeStatusOption {
  status: NodeStatus;
  reasons: string[] | null;
}

/** Detail payload behind `/nodes/$nodeId`. */
export interface NodeDetail {
  id: string;
  /** Short hardware code shown in the status modal subtitle, e.g. "LK-022". */
  code: string;
  name: string;
  status: NodeStatus;
  partner: string;
  zone: string;
  /** Display line, e.g. "Lagos · Victoria Island". */
  region: string;
  address: string;
  /** ISO install date — renders "Installed Mar 2025". */
  installedAt: string;
  uptimeToday: number;
  /** ISO timestamp — renders as "8s ago". */
  lastHeartbeatAt: string;
  connectivity: NodeConnectivity;
  pickupOccupancy: NodeCapacity;
  compartments: CompartmentGroup[];
  sensors: NodeSensor[];
  contents: NodeContentItem[];
  maintenance: NodeMaintenanceEvent[];
  /** Transitions the change-status modal offers — the backend decides what is legal. */
  statusOptions: NodeStatusOption[];
  position: [number, number];
}

/** Payload the register wizard submits — step data collected across the four screens. */
export interface RegisterNodeInput {
  name: string;
  partner: string;
  region: string;
  zone: string;
  address: string;
  latitude: number;
  longitude: number;
  capacity: {small: number; medium: number; large: number; dropoffKg: number};
}

export interface ChangeNodeStatusInput {
  status: NodeStatus;
  reason?: string;
  notes?: string;
}

export interface NodesService {
  getNodes: (params: NodeListParams) => Promise<NodeListResponse>;
  getNodeDetail: (id: string) => Promise<NodeDetail>;
  registerNode: (input: RegisterNodeInput) => Promise<NodeRow>;
  changeNodeStatus: (id: string, input: ChangeNodeStatusInput) => Promise<{id: string; status: NodeStatus}>;
}
