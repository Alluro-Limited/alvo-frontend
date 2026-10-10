import type {Page} from "./workloads-types";

/** Account lifecycle states the SME table and pills render. */
export type SmeStatus = "active" | "flagged" | "suspended";

/** KYC verification levels shown in the Verification column and filter. */
export type SmeVerification = "verified" | "partial" | "unverified";

/** The five metric cards above the list. */
export interface SmeMetrics {
  total: number;
  verified: number;
  suspended: number;
  flagged: number;
  newToday: number;
}

/** One row in the SMEs table. */
export interface SmeRow {
  id: string;
  businessName: string;
  industry: string;
  location: string;
  verification: SmeVerification;
  /** ISO date the account was created. */
  joinedAt: string;
  status: SmeStatus;
}

export interface SmeListParams {
  query?: string;
  status?: string;
  verification?: string;
  page: number;
}

/** Reasons offered by the suspend dialog — supplied by the backend. */
export type SmeSuspendReason =
  | "fraudulent_bulk_uploads"
  | "payment_default"
  | "fake_documents"
  | "policy_violations"
  | "abusive_behavior"
  | "other";

/** Reasons offered by the deactivate dialog — supplied by the backend. */
export type SmeDeactivateReason = "customer_decision" | "business_closed" | "compliance_hold" | "duplicate_account" | "other";

export interface SmeListResponse {
  metrics: SmeMetrics;
  smes: Page<SmeRow>;
  /** Filter options supplied by the backend. */
  filters: {statuses: string[]; verifications: string[]};
  /** Reason options for the suspend dialog. */
  suspendReasons: SmeSuspendReason[];
  /** Reason options for the deactivate dialog. */
  deactivateReasons: SmeDeactivateReason[];
  /** Options for the edit modal's Business Type select. */
  businessTypes: string[];
}

/** A flag record attached to an SME account. */
export interface SmeFlag {
  reason: string;
  notes?: string;
  /** ISO timestamp of when the flag was raised. */
  at: string;
}

/** A suspension record attached to an SME account. */
export interface SmeSuspension {
  reason: string;
  notes?: string;
  /** ISO timestamp of when the account was suspended. */
  at: string;
}

/** Where one verification item sits in the review pipeline. */
export type SmeVerificationItemStatus = "not_uploaded" | "submitted" | "approved";

/** One row in the drawer's Verification card — label and checklist come from the backend. */
export interface SmeVerificationItem {
  key: string;
  /** Display label, e.g. "CAC Certificate" or "Public search". */
  label: string;
  status: SmeVerificationItemStatus;
  /** Uploaded file name — null when nothing was submitted (e.g. "Public search"). */
  fileName: string | null;
  /** Checklist lines shown in the Review & Approve modal. */
  checklist: string[];
}

/** One entry in the drawer's Batch History tab — grouped by day in the UI. */
export interface SmeBatch {
  id: string;
  parcels: number;
  amountKobo: number;
  /** ISO timestamp the batch was submitted. */
  createdAt: string;
  status: "active" | "completed";
}

/** Detail payload behind the SME drawer. */
export interface SmeDetail {
  id: string;
  /** Public reference shown under the name, e.g. "SME-001". */
  ref: string;
  businessName: string;
  businessType: string;
  businessPhone: string;
  businessEmail: string;
  location: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  cacNumber: string;
  joinedAt: string;
  verification: SmeVerification;
  status: SmeStatus;
  /** Whether the business holds a dedicated virtual account. */
  dvaEnabled: boolean;
  flag: SmeFlag | null;
  suspension: SmeSuspension | null;
  walletBalanceKobo: number;
  dvaAccount: string;
  bank: string;
  verificationItems: SmeVerificationItem[];
  batches: SmeBatch[];
}

/** Editable fields behind the Edit info modal's two tabs. */
export interface SmeUpdateInput {
  businessName?: string;
  businessType?: string;
  businessPhone?: string;
  businessEmail?: string;
  location?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface SuspendSmeInput {
  reason: SmeSuspendReason;
  notes?: string;
}

export interface UnsuspendSmeInput {
  notes?: string;
}

export interface FlagSmesInput {
  ids: string[];
  reason: string;
  notes?: string;
}

export interface DeactivateSmeInput {
  reason: SmeDeactivateReason;
}

export interface SmeExportParams extends Omit<SmeListParams, "page"> {
  ids?: string[];
}

export interface SmesService {
  getSmes: (params: SmeListParams) => Promise<SmeListResponse>;
  getSmeDetail: (id: string) => Promise<SmeDetail>;
  /** Saves the Edit info modal — returns the updated detail payload. */
  updateSme: (id: string, input: SmeUpdateInput) => Promise<SmeDetail>;
  /** Approves one verification item — returns the updated detail payload. */
  approveVerificationItem: (id: string, itemKey: string) => Promise<SmeDetail>;
  suspendSme: (id: string, input: SuspendSmeInput) => Promise<{id: string; status: SmeStatus}>;
  unsuspendSme: (id: string, input: UnsuspendSmeInput) => Promise<{id: string; status: SmeStatus}>;
  flagSmes: (input: FlagSmesInput) => Promise<{ids: string[]; status: SmeStatus}>;
  deactivateSme: (id: string, input: DeactivateSmeInput) => Promise<{id: string}>;
  /** CSV body — the browser downloads it client-side. */
  exportSmes: (params: SmeExportParams) => Promise<string>;
}
