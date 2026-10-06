/** Status values the backend reports for a single-send parcel. */
export type ParcelStatus = "pending_pickup" | "in_transit" | "delivered" | "failed" | "expired";

/** The workload surfaces. Only `single` is designed so far — batches and safe land later. */
export type WorkloadTab = "single" | "batches" | "safe";

/** Metric strip above the parcels table — server-computed per tab, independent of filters. */
export interface WorkloadMetrics {
  ongoing: number;
  pendingPickup: number;
  expired: number;
  slaAtRisk: number;
  flagged: number;
}

/** One row in the parcels table. */
export interface ParcelRow {
  id: string;
  sender: string;
  /** Display destination, e.g. "Ikeja, Lagos (IK-022)". */
  destination: string;
  courierId: string | null;
  destinationNodeId: string;
  status: ParcelStatus;
  /** Minutes left on the SLA clock; null when the SLA window closed → renders "Done". */
  slaRemainingMin: number | null;
  flagged: boolean;
}

/** Options behind the two filter dropdowns — supplied by the backend, not hardcoded. */
export interface WorkloadFilterOptions {
  statuses: ParcelStatus[];
  nodes: {id: string; label: string}[];
}

/** List query parameters sent to the service layer. */
export interface WorkloadListParams {
  tab: WorkloadTab;
  query?: string;
  status?: ParcelStatus;
  nodeId?: string;
  page: number;
}

export interface WorkloadListResponse {
  metrics: WorkloadMetrics;
  parcels: {
    items: ParcelRow[];
    page: number;
    pageSize: number;
    total: number;
  };
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
  timeline: ParcelTimelineStep[];
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
  getParcelDetail: (id: string) => Promise<ParcelDetail>;
  flagParcels: (input: FlagParcelsInput) => Promise<{flagged: number}>;
  /** CSV export of the parcels matching the current filters (or the given ids). */
  exportParcels: (params: WorkloadListParams & {ids?: string[]}) => Promise<string>;
}
