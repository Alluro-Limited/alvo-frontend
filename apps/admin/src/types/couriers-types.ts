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

export type CourierMapParams = Omit<CourierListParams, "page">;

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
  /** Unpaginated, filtered rows for the Map view markers. */
  getCourierMap: (params: CourierMapParams) => Promise<CourierRow[]>;
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
