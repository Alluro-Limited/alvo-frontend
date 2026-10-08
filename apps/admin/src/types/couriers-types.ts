import type {DeliveryType} from "./assignment-types";
import type {Page} from "./workloads-types";

/** Account lifecycle states the couriers table and pills render. */
export type CourierStatus = "active" | "flagged" | "suspended";

/** Signup verification — pending rows show "-" for success rate and status until approved. */
export type CourierVerification = "verified" | "pending";

/** Vehicle categories shown as the icon column and the vehicle filter. */
export type VehicleType = "bicycle" | "car" | "motorcycle" | "van";

/** The six metric cards above the list. */
export interface CourierMetrics {
  total: number;
  active: number;
  onAssignment: number;
  pendingVerify: number;
  flagged: number;
  suspended: number;
}

/** One row in the couriers table — also the map marker payload. */
export interface CourierRow {
  /** e.g. "PRG-0299". */
  id: string;
  /** Zone rank shown before the avatar, e.g. 6 renders "#6". */
  rank: number;
  name: string;
  /** Optional backend-hosted photo; initials render when null. */
  photoUrl: string | null;
  vehicle: VehicleType;
  /** Delivery zone label, e.g. "Lekki". */
  zone: string;
  verification: CourierVerification;
  /** Whole-percent success rate — null for unverified couriers (the "-" cell). */
  successRate: number | null;
  status: CourierStatus;
  /** Live position for the map view. */
  position: [number, number];
}

export interface CourierListParams {
  query?: string;
  status?: string;
  verification?: string;
  vehicle?: string;
  page: number;
}

/** Delivery progress on an active assignment — the card pill and the Status filter. */
export type CourierTrackStatus = "in_transit" | "delayed";

/** Courier motion state — the popup header pill and its online dot. */
export type CourierMotion = "enroute" | "idle";

/** Service tier shown in the popup's Delivery Type row. */
export type CourierServiceTier = "standard" | "express";

/** A network node a track runs from/to. */
export interface CourierNodeRef {
  /** e.g. "Ikeja" / "Super Node". */
  name: string;
  /** e.g. "IK-023" / "SN-001". */
  code: string;
  zone: string;
  position: [number, number];
}

/** One courier on assignment — powers the map card, marker, polyline, and the tracking popup. */
export interface CourierTrack {
  /** Resolves to the courier drawer, e.g. "PRG-0299". */
  courierId: string;
  name: string;
  photoUrl: string | null;
  vehicle: VehicleType;
  status: CourierTrackStatus;
  motion: CourierMotion;
  /** Orange "Public Pool" pill when the assignment came off the open pool. */
  publicPool: boolean;
  type: DeliveryType;
  /** e.g. "B-2281". */
  batchId: string;
  items: number;
  pickup: CourierNodeRef;
  dropoff: CourierNodeRef;
  etaMinutes: number;
  distanceKm: number;
  /** Live courier position — the avatar pin. */
  position: [number, number];
  /** Route polyline from the pickup node to the courier — drawn when selected. */
  routePath: [number, number][];
  /** Popup detail block. */
  lastKnownLocation: string;
  offlineMinutes: number;
  rating: number;
  serviceTier: CourierServiceTier;
  /** ISO timestamp — the popup renders it as a clock time ("5:30PM"). */
  etaAt: string;
  phone: string;
}

export interface CourierTrackingParams {
  query?: string;
  status?: string;
  type?: string;
}

export interface CourierTrackingResponse {
  tracks: CourierTrack[];
  /** Filter options supplied by the backend. */
  filters: {statuses: string[]; types: string[]};
}

export interface CourierListResponse {
  metrics: CourierMetrics;
  couriers: Page<CourierRow>;
  /** Filter options supplied by the backend. */
  filters: {statuses: string[]; verifications: string[]; vehicles: string[]};
  /** Reason options for the suspend/delete dialogs — backend-supplied like user suspendReasons. */
  suspendReasons: CourierSuspendReason[];
  deleteReasons: CourierDeleteReason[];
}

export type CourierSuspendReason = "gps_tampering" | "safety_incident" | "policy_violations" | "recipient_complaint" | "fraud" | "other";

export type CourierDeleteReason = "account_closed" | "policy_violations" | "fraud" | "inactive" | "other";

/** A flag record attached to a courier account. */
export interface CourierFlag {
  reason: string;
  notes?: string;
  at: string;
}

/** A suspension record attached to a courier account. */
export interface CourierSuspension {
  reason: string;
  notes?: string;
  at: string;
}

export type CourierVerificationItemKey = "phone_email" | "id_account" | "drivers_licence" | "vehicle_photo" | "background_check";

/** One reviewable item in the Verification tab — file items carry the uploaded document name. */
export interface CourierVerificationItem {
  key: CourierVerificationItemKey;
  status: "approved" | "submitted";
  fileName: string | null;
}

/** The 2×2 performance grid plus the deliveries/out-of-zone stats. */
export interface CourierPerformance {
  rank: number;
  successRate: number;
  slaRate: number;
  avgTimeMinutes: number;
  totalDeliveries: number;
  outOfZone: number;
}

/** Detail payload behind the courier drawer. */
export interface CourierDetail {
  id: string;
  name: string;
  photoUrl: string | null;
  status: CourierStatus;
  verification: CourierVerification;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  nin: string;
  vehicle: VehicleType;
  vehicleBrand: string;
  plateNumber: string;
  zone: string;
  joinedAt: string;
  verificationItems: CourierVerificationItem[];
  performance: CourierPerformance;
  flag: CourierFlag | null;
  suspension: CourierSuspension | null;
}

export type CourierAssignmentStatus = "completed" | "cancelled" | "failed";

/** One row in the assignment-history modal. */
export interface CourierAssignment {
  /** ISO timestamp — the Date column renders "May 19, 2026". */
  date: string;
  /** e.g. "ASN-1089". */
  id: string;
  type: DeliveryType;
  pickup: string;
  dropoff: string;
  items: number;
  status: CourierAssignmentStatus;
}

export interface CourierAssignmentsParams {
  query?: string;
  type?: string;
  status?: string;
  page: number;
}

export interface SuspendCourierInput {
  reason: CourierSuspendReason;
  notes?: string;
}

export interface UnsuspendCourierInput {
  notes?: string;
}

export interface FlagCouriersInput {
  ids: string[];
  reason: string;
  notes?: string;
}

export interface DeleteCourierInput {
  reason: CourierDeleteReason;
}

export interface CourierExportParams extends Omit<CourierListParams, "page"> {
  ids?: string[];
}

export interface CouriersService {
  getCouriers: (params: CourierListParams) => Promise<CourierListResponse>;
  /** Active assignments behind the Map view — cards, markers, and the tracking popup. */
  getCourierTracking: (params: CourierTrackingParams) => Promise<CourierTrackingResponse>;
  getCourierDetail: (id: string) => Promise<CourierDetail>;
  /** Paginated deliveries behind the Assignment History modal. */
  getCourierAssignments: (id: string, params: CourierAssignmentsParams) => Promise<Page<CourierAssignment>>;
  /** Approves one verification item — returns the fresh detail so pills and items update. */
  approveVerificationItem: (id: string, itemKey: CourierVerificationItemKey) => Promise<CourierDetail>;
  suspendCourier: (id: string, input: SuspendCourierInput) => Promise<{id: string; status: CourierStatus}>;
  unsuspendCourier: (id: string, input: UnsuspendCourierInput) => Promise<{id: string; status: CourierStatus}>;
  flagCouriers: (input: FlagCouriersInput) => Promise<{ids: string[]; status: CourierStatus}>;
  deleteCourier: (id: string, input: DeleteCourierInput) => Promise<{id: string}>;
  /** CSV bodies — the browser downloads them client-side. */
  exportCouriers: (params: CourierExportParams) => Promise<string>;
  /** The history modal's Export — `ids` exports just the checked rows. */
  exportCourierAssignments: (id: string, params: Omit<CourierAssignmentsParams, "page"> & {ids?: string[]}) => Promise<string>;
}
