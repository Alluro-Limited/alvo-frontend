import type {Page} from "./workloads-types";

/** Lifecycle states the assignment table and metrics render. */
export type AssignmentStatus = "created" | "pending_pickup" | "active" | "public_pool" | "failed" | "flagged" | "completed";

/** The three delivery modes shown as explainer cards and type pills. */
export type DeliveryType = "bulk" | "node" | "express";

/** One row in the assignments table and one card/marker in the map view. */
export interface AssignmentRow {
  id: string;
  type: DeliveryType;
  /** Assigned courier — null renders "-" (unassigned/public pool). */
  courier: AssignmentCourier | null;
  pickup: string;
  dropoff: string;
  items: number;
  status: AssignmentStatus;
  /** Minutes/distance to completion — shown on the map card while a courier is on the run. */
  etaMin: number | null;
  distanceKm: number | null;
  /** [lng, lat] marker position for the map view — usually the drop-off node. */
  position: [number, number];
}

/** The six metric cards above the list. */
export interface AssignmentMetrics {
  active: number;
  pendingPickup: number;
  completed: number;
  publicPool: number;
  failed: number;
  flagged: number;
}

export interface AssignmentListParams {
  query?: string;
  status?: string;
  type?: string;
  page: number;
}

export interface AssignmentListResponse {
  metrics: AssignmentMetrics;
  assignments: Page<AssignmentRow>;
  /** Filter options supplied by the backend. */
  filters: {statuses: string[]; types: string[]};
}

/** Map-surface params — the same filters as the list, without pagination. */
export type AssignmentMapParams = Pick<AssignmentListParams, "query" | "status" | "type">;

/** A flag record attached to an assignment. */
export interface AssignmentFlag {
  reason: string;
  notes?: string;
  /** ISO timestamp of when the flag was raised. */
  at: string;
}

/** Courier info shown when an assignment has been taken. */
export interface AssignmentCourier {
  name: string;
  /** Courier code, e.g. "PRG-034". */
  code: string;
}

/** One step in the drawer timeline — backend decides labels per delivery type. */
export interface AssignmentTimelineStep {
  label: string;
  /** ISO timestamp — null renders "-". */
  at: string | null;
  /** Secondary line, e.g. "65% picked up" or "In progress". */
  detail?: string;
  done: boolean;
}

/** Item states inside an assignment — drives the items-modal chips and row pills. */
export type AssignmentItemStatus = "waiting" | "picked_up" | "en_route" | "at_super_node" | "delivered";

export interface AssignmentItem {
  id: string;
  /** e.g. "Drop slot B3". */
  slot: string;
  weightKg: number;
  status: AssignmentItemStatus;
}

/** Detail payload behind the assignment drawer. */
export interface AssignmentDetail {
  id: string;
  type: DeliveryType;
  status: AssignmentStatus;
  pickup: string;
  dropoff: string;
  items: number;
  /** Null until a courier accepts — hides courier rows, progress and ETA. */
  courier: AssignmentCourier | null;
  /** 0-100 — null when no courier is on it. */
  progress: number | null;
  etaMin: number | null;
  /** Courier codes that declined — drives the public-pool banner. */
  declinedBy: string[] | null;
  flag: AssignmentFlag | null;
  timeline: AssignmentTimelineStep[];
  /** "Ikeja (IK-023) → Lekki (LK-015)" — the route strip inside the items modal. */
  route: string;
  /** Ordered item-status chips in the items modal — the sequence differs per delivery type. */
  itemStatusOrder: AssignmentItemStatus[];
  assignmentItems: AssignmentItem[];
}

/** An assignment the manual-assign flow offers in step 1 — only pending/public-pool/failed qualify. */
export interface AssignableAssignment {
  id: string;
  type: DeliveryType;
  status: AssignmentStatus;
  route: string;
  items: number;
}

/** An idle courier offered in step 2 of manual assign. */
export interface IdleCourier {
  id: string;
  name: string;
  /** Courier code, e.g. "PRG-047". */
  code: string;
  rank: number;
  zones: string[];
  /** 0-100. */
  successRate: number;
}

export interface AssignCourierInput {
  assignmentId: string;
  courierId: string;
}

export interface FlagAssignmentInput {
  reason: string;
  notes?: string;
}

export interface AssignmentsService {
  getAssignments: (params: AssignmentListParams) => Promise<AssignmentListResponse>;
  /** Every assignment matching the filters — unpaginated, for the map markers and cards. */
  getAssignmentMap: (params: AssignmentMapParams) => Promise<AssignmentRow[]>;
  getAssignmentDetail: (id: string) => Promise<AssignmentDetail>;
  getAssignable: () => Promise<AssignableAssignment[]>;
  getIdleCouriers: (query?: string) => Promise<IdleCourier[]>;
  assignCourier: (input: AssignCourierInput) => Promise<{id: string; courier: string}>;
  flagAssignment: (id: string, input: FlagAssignmentInput) => Promise<{id: string; status: AssignmentStatus}>;
}
