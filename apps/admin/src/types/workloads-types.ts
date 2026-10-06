/** Status values the backend reports for a parcel. */
export type ParcelStatus = "pending_pickup" | "in_transit" | "delivered" | "failed" | "expired";

/** The workload surfaces. Single Send and Batches are built; Safe lands later. */
export type WorkloadTab = "single" | "batches" | "safe";

/**
 * Metric keys the strip above the list can render. The response only carries
 * the keys that apply to the current tab — order in the payload is the display order.
 */
export type WorkloadMetricKey =
  | "ongoing"
  | "pendingPickup"
  | "expired"
  | "slaAtRisk"
  | "flagged"
  | "active"
  | "queued"
  | "slaBreaches"
  | "expiredParcel"
  | "total"
  | "delivered"
  | "inTransit";

/** Metric strip above the list — server-computed per tab, independent of filters. */
export type WorkloadMetrics = Partial<Record<WorkloadMetricKey, number>>;

/** A paginated slice of a list resource. */
export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

/** One row in the parcels table (single-send listing or inside a batch). */
export interface ParcelRow {
  id: string;
  /** The sending SME/customer — shown as "Sender" on single-send lists. */
  sender: string;
  /** Set on batch listings — shown as "Recipient" there. */
  recipient?: string;
  /** Display destination, e.g. "Ikeja, Lagos (IK-022)". */
  destination: string;
  courierId: string | null;
  destinationNodeId: string;
  /** Last node the parcel passed through — populated on batch listings ("Last Node"). */
  lastNodeId?: string;
  status: ParcelStatus;
  /** Minutes left on the SLA clock; null when the SLA window closed → renders "Done". */
  slaRemainingMin: number | null;
  flagged: boolean;
}

/** Pills a batch can carry at once — the backend returns whichever apply. */
export type BatchTag = "active" | "completed" | "queued" | "stalled" | "flagged";

/** Keys for the small count chips under a batch's progress bar. */
export type BatchBreakdownKey = "delivered" | "in_transit" | "delayed";

/** One card in the Batches list. */
export interface BatchRow {
  id: string;
  tags: BatchTag[];
  /** The SME that uploaded the batch, e.g. "Kuda Bank". */
  sme: string;
  /** ISO timestamp the batch was created/uploaded. */
  createdAt: string;
  city: string;
  /** Total value of the batch in naira. */
  totalValue: number;
  parcelCount: number;
  /** Parcels already delivered — drives the progress fill. */
  delivered: number;
  breakdown: {key: BatchBreakdownKey; count: number}[];
}

/** Options behind the two filter dropdowns — supplied by the backend, not hardcoded. */
export interface WorkloadFilterOptions {
  statuses: string[];
  locations: {id: string; label: string}[];
}

/** List query parameters sent to the service layer. */
export interface WorkloadListParams {
  tab: WorkloadTab;
  query?: string;
  status?: string;
  /** Location filter — a node id on single send, a city on batches. */
  location?: string;
  /** Scope to one batch's parcels (batch detail + exports). */
  batchId?: string;
  page: number;
}

export interface WorkloadListResponse {
  metrics: WorkloadMetrics;
  /** Present for tabs that list parcels (single send). */
  parcels?: Page<ParcelRow>;
  /** Present for the batches tab. */
  batches?: Page<BatchRow>;
  filters: WorkloadFilterOptions;
}

/** The batch detail header + per-batch metric strip + filter options. */
export interface BatchDetail {
  id: string;
  tags: BatchTag[];
  sme: string;
  createdAt: string;
  city: string;
  totalValue: number;
  parcelCount: number;
  delivered: number;
  metrics: WorkloadMetrics;
  filters: WorkloadFilterOptions;
}

/** The fixed lifecycle steps rendered in the detail timeline. */
export type TimelineStepKey = "created" | "dropped_at_node" | "picked_up" | "delivered" | "collected";

export interface ParcelTimelineStep {
  key: TimelineStepKey;
  /** Who/what logged the step — "Via mobile app", "LK-022", "PRG-023". */
  actor?: string;
  /** ISO timestamp; absent means the step has not happened yet (renders "-"). */
  at?: string;
}

/** One leg of a parcel's journey. Batch parcels can travel multiple legs. */
export interface ParcelRoute {
  /** Backend-supplied leg label like "1st Route Timeline"; absent → the default title. */
  label?: string;
  steps: ParcelTimelineStep[];
}

/** A flag record, attached to the parcel when an admin flags it for review. */
export interface ParcelFlagRecord {
  reason: string;
  notes?: string;
  /** ISO timestamp of when the flag was raised. */
  at: string;
}

/** A locker/node pin shown on the tracking map. */
export interface ParcelTrackingStop {
  id: string;
  /** Pin label like "P01". */
  label: string;
  position: [number, number];
  tone: "default" | "alert";
}

/** The live tracking payload behind "Track on map". */
export interface ParcelTracking {
  /** Ordered [lng, lat] waypoints for the courier's route line. */
  route: [number, number][];
  stops: ParcelTrackingStop[];
  courierPosition: [number, number];
  etaMinutes: number;
  destinationPosition: [number, number];
}

/** Detail payload behind the parcel drawer. */
export interface ParcelDetail {
  id: string;
  serviceType: "standard" | "express";
  status: ParcelStatus;
  /** Banner sub-line, e.g. "Departed on 16 Mar 2026 at 2:34 PM". */
  statusNote?: string;
  flag: ParcelFlagRecord | null;
  sender: string;
  recipient: string;
  courier: {id: string; name: string; avatarUrl?: string} | null;
  route: {from: string; to: string};
  size: string;
  /** Charge in naira. */
  charged: number;
  slaRemainingMin: number | null;
  /** One route leg per timeline card — single-send parcels have exactly one. */
  routes: ParcelRoute[];
  /** Present when live tracking is available for the parcel. */
  tracking?: ParcelTracking;
}

export interface FlagParcelsInput {
  ids: string[];
  reason: string;
  notes?: string;
}

export interface WorkloadsService {
  getWorkloads: (params: WorkloadListParams) => Promise<WorkloadListResponse>;
  getBatchDetail: (id: string) => Promise<BatchDetail>;
  getBatchParcels: (batchId: string, params: WorkloadListParams) => Promise<Page<ParcelRow>>;
  getParcelDetail: (id: string) => Promise<ParcelDetail>;
  flagParcels: (input: FlagParcelsInput) => Promise<{flagged: number}>;
  /** CSV export of the rows matching the current filters (or the given ids). */
  exportList: (params: WorkloadListParams & {ids?: string[]}) => Promise<string>;
}
