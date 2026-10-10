import type {DeliveryType} from "./assignment-types";
import type {Page} from "./workloads-types";

/** Payout lifecycle — the Status pill and the drawer actions key off this. */
export type PayoutStatus = "paid" | "not_paid" | "withheld" | "flagged";

/** Backend-supplied issue categories for the Withhold dialog's Issue type select. */
export type PayoutIssueType = "damaged" | "lost" | "delayed" | "missing_items" | "fraud" | "other";

/** Backend-supplied dispute reasons for the Flag dialog's Dispute reason select. */
export type PayoutDisputeReason = "underpaid" | "incorrect_amount" | "missing_deliveries" | "fraud" | "other";

/** Payment channels the Mark-as-Paid dialogs offer. */
export type PayoutPaymentMethod = "bank_transfer" | "manual";

/** Lifecycle of a payment dispute in the drawer's Payment Disputes section. */
export type PayoutDisputeStatus = "open" | "investigating" | "resolved";

/** One payout cycle — the header's date-range field selects among these. */
export interface PayoutCycle {
  id: string;
  /** Display range, e.g. "June 16 - 30, 2026". */
  label: string;
}

/** The four KPI cards — all figures aggregate the selected cycle. */
export interface PayoutMetrics {
  totalPayout: number;
  courierCount: number;
  paidAmount: number;
  paidCouriers: number;
  notPaidAmount: number;
  /** Count of unpaid couriers — the "N awaiting transfer" subtext. */
  awaitingTransfer: number;
  withheldAmount: number;
  withheldCouriers: number;
  withheldIssues: number;
}

/** One row in the courier payout table. */
export interface PayoutRow {
  /** e.g. "PRG-0215". */
  courierId: string;
  name: string;
  photoUrl: string | null;
  accountNumber: string;
  bankName: string;
  deliveries: number;
  /** The Next Payout column — naira the courier is owed for the cycle. */
  netPayout: number;
  status: PayoutStatus;
}

/** One courier entry inside a Withheld/Flagged summary card. */
export interface PayoutIssueItem {
  /** Issue record id. */
  id: string;
  courierId: string;
  courierName: string;
  /** "1 issue — Damaged". */
  issueCount: number;
  issueLabel: string;
  /** Held/flagged naira rendered in the row's right column. */
  amount: number;
}

/** The Withheld Payouts / Flagged Payments card payload — `items` holds the top three. */
export interface PayoutIssuesSummary {
  unresolvedCount: number;
  heldAmount: number;
  items: PayoutIssueItem[];
}

export interface PayoutListParams {
  query?: string;
  status?: string;
  /** Selected cycle id. */
  cycle: string;
  page: number;
}

export interface PayoutListResponse {
  metrics: PayoutMetrics;
  payouts: Page<PayoutRow>;
  withheld: PayoutIssuesSummary;
  flagged: PayoutIssuesSummary;
  /** Cycle options for the header date-range field, newest first. */
  cycles: PayoutCycle[];
  filters: {statuses: PayoutStatus[]};
  /** Dialog option lists — backend-supplied like the suspend reasons elsewhere. */
  issueTypes: PayoutIssueType[];
  disputeReasons: PayoutDisputeReason[];
  paymentMethods: PayoutPaymentMethod[];
}

/** One dispute row in the drawer's Payment Disputes section. */
export interface PayoutDispute {
  id: string;
  /** e.g. "PRC-1044". */
  parcelId: string;
  /** Short reason line under the pill, e.g. "Damaged parcel". */
  title: string;
  status: PayoutDisputeStatus;
  description: string;
  /** ISO date — the "May 12, 2026" footer. */
  date: string;
}

/** Bank account block the drawer and the Mark-as-Paid courier card render. */
export interface PayoutBank {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

/** The courier payout detail behind the side drawer. */
export interface PayoutDetail {
  courierId: string;
  name: string;
  photoUrl: string | null;
  status: PayoutStatus;
  deliveriesCompleted: number;
  grossEarnings: number;
  netPayout: number;
  bank: PayoutBank;
  disputes: PayoutDispute[];
  /** ISO timestamp when the payout was settled — the flag card's "Paid May 22, 2025". */
  paidAt: string | null;
}

/** One row in the View Deliveries modal. */
export interface PayoutDelivery {
  /** ISO date. */
  date: string;
  /** e.g. "ASN-1089". */
  id: string;
  type: DeliveryType;
  pickup: string;
  dropoff: string;
  /** Naira earned for this delivery — the Earned column. */
  earned: number;
  items: number;
  status: "completed" | "cancelled" | "failed";
}

export interface PayoutDeliveriesParams {
  query?: string;
  type?: string;
  status?: string;
  page: number;
}

export interface PayoutDeliveriesResponse {
  deliveries: Page<PayoutDelivery>;
  /** Sum of every earned delivery in the cycle — the footer "₦18,900". */
  totalEarned: number;
}

export interface MarkPaidInput {
  cycle: string;
  courierIds: string[];
  paymentMethod: PayoutPaymentMethod;
  /** ISO date — "2026-06-25". */
  paymentDate: string;
  remarks?: string;
}

export interface WithholdPayoutInput {
  cycle: string;
  /** e.g. "PRC-12345". */
  parcelId: string;
  issueType: PayoutIssueType;
  amountAtRisk: number;
  description: string;
}

export interface FlagPayoutInput {
  cycle: string;
  disputeReason: PayoutDisputeReason;
  details: string;
}

export interface PayoutExportParams {
  query?: string;
  status?: string;
  cycle: string;
  ids?: string[];
}

export interface PayoutsService {
  /** Metrics + issue cards + the filtered, paginated payout table for one cycle. */
  getPayouts: (params: PayoutListParams) => Promise<PayoutListResponse>;
  getPayoutDetail: (courierId: string, cycle: string) => Promise<PayoutDetail>;
  /** Deliveries behind the View Deliveries modal — filtered + paginated. */
  getPayoutDeliveries: (courierId: string, cycle: string, params: PayoutDeliveriesParams) => Promise<PayoutDeliveriesResponse>;
  /** Marks one or more payouts paid — batch calls pass every selected id. */
  markPayoutsPaid: (input: MarkPaidInput) => Promise<{ids: string[]; status: PayoutStatus}>;
  withholdPayout: (courierId: string, input: WithholdPayoutInput) => Promise<{id: string; status: PayoutStatus}>;
  flagPayout: (courierId: string, input: FlagPayoutInput) => Promise<{id: string; status: PayoutStatus}>;
  /** CSV body — `ids` exports just the checked rows. */
  exportPayouts: (params: PayoutExportParams) => Promise<string>;
}
