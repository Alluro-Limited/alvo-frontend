import type {Page, ParcelStatus} from "./workloads-types";

/** Account lifecycle states the users table and pills render. */
export type UserStatus = "active" | "flagged" | "suspended";

/** KYC verification levels shown in the Verification column and filter. */
export type UserVerification = "verified" | "partial" | "unverified";

/** The five metric cards above the list. */
export interface UserMetrics {
  total: number;
  verified: number;
  suspended: number;
  flagged: number;
  newToday: number;
}

/** One row in the users table. */
export interface UserRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  verification: UserVerification;
  /** ISO date the account was created. */
  joinedAt: string;
  status: UserStatus;
}

export interface UserListParams {
  query?: string;
  status?: string;
  verification?: string;
  page: number;
}

export interface UserListResponse {
  metrics: UserMetrics;
  users: Page<UserRow>;
  /** Filter options supplied by the backend. */
  filters: {statuses: string[]; verifications: string[]};
  /** Reason options for the suspend dialog — backend-supplied like node statusOptions. */
  suspendReasons: SuspendReason[];
}

/** Reasons offered by the suspend dialog — supplied by the backend. */
export type SuspendReason =
  | "suspicious_activity"
  | "payment_fraud"
  | "policy_violations"
  | "abusive_behavior"
  | "duplicate_account"
  | "other";

/** A flag record attached to a user account. */
export interface UserFlag {
  reason: string;
  notes?: string;
  /** ISO timestamp of when the flag was raised. */
  at: string;
}

/** A suspension record attached to a user account. */
export interface UserSuspension {
  reason: string;
  notes?: string;
  /** ISO timestamp of when the account was suspended. */
  at: string;
}

/** One entry in the drawer's recent-activity feed. */
export interface UserActivity {
  id: string;
  /** e.g. "Parcel PRV-88201 dropped off". */
  label: string;
  /** Display timestamp, e.g. "Today, 10:14 AM". */
  at: string;
}

/** One row in the drawer's "View all items" parcels modal. */
export interface UserParcel {
  id: string;
  recipient: string;
  destination: string;
  /** Courier code, e.g. "PRG-023". */
  courier: string;
  status: ParcelStatus;
  /** Display SLA, e.g. "1h 14m" or "Done". */
  sla: string;
}

export interface UserParcelsParams {
  query?: string;
  status?: string;
  page: number;
}

/** Detail payload behind the user drawer. */
export interface UserDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  verification: UserVerification;
  joinedAt: string;
  status: UserStatus;
  flag: UserFlag | null;
  suspension: UserSuspension | null;
  walletBalanceKobo: number;
  totalSpentKobo: number;
  parcelsSent: number;
  parcelsDelivered: number;
  recentActivity: UserActivity[];
}

export interface SuspendUserInput {
  reason: SuspendReason;
  notes?: string;
}

export interface UnsuspendUserInput {
  notes?: string;
}

export interface FlagUsersInput {
  ids: string[];
  reason: string;
  notes?: string;
}

export interface UserExportParams extends Omit<UserListParams, "page"> {
  ids?: string[];
}

export interface UsersService {
  getUsers: (params: UserListParams) => Promise<UserListResponse>;
  getUserDetail: (id: string) => Promise<UserDetail>;
  /** Paginated parcels behind the drawer's "View all items" modal. */
  getUserParcels: (id: string, params: UserParcelsParams) => Promise<Page<UserParcel>>;
  suspendUser: (id: string, input: SuspendUserInput) => Promise<{id: string; status: UserStatus}>;
  unsuspendUser: (id: string, input: UnsuspendUserInput) => Promise<{id: string; status: UserStatus}>;
  flagUsers: (input: FlagUsersInput) => Promise<{ids: string[]; status: UserStatus}>;
  deleteUser: (id: string) => Promise<{id: string}>;
  /** CSV body — the browser downloads it client-side. */
  exportUsers: (params: UserExportParams) => Promise<string>;
}
