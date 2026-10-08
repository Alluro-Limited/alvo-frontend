import {m} from "@/paraglide/messages";
import type {PayoutDisputeReason, PayoutDisputeStatus, PayoutIssueType, PayoutPaymentMethod, PayoutStatus} from "@/types/payouts-types";

export const PAYOUT_STATUS_LABELS: Record<PayoutStatus, () => string> = {
  paid: m["payout.status_paid"],
  not_paid: m["payout.status_not_paid"],
  withheld: m["payout.status_withheld"],
  flagged: m["payout.status_flagged"],
};

/** StatusTag variants matching the Figma pill colors. */
export const PAYOUT_STATUS_TAGS: Record<PayoutStatus, "success" | "pending" | "fail" | "delayed"> = {
  paid: "success",
  not_paid: "pending",
  withheld: "fail",
  flagged: "delayed",
};

export const ISSUE_TYPE_LABELS: Record<PayoutIssueType, () => string> = {
  damaged: m["payout.issue_damaged"],
  lost: m["payout.issue_lost"],
  delayed: m["payout.issue_delayed"],
  missing_items: m["payout.issue_missing_items"],
  fraud: m["payout.issue_fraud"],
  other: m["payout.issue_other"],
};

export const DISPUTE_REASON_LABELS: Record<PayoutDisputeReason, () => string> = {
  underpaid: m["payout.reason_underpaid"],
  incorrect_amount: m["payout.reason_incorrect_amount"],
  missing_deliveries: m["payout.reason_missing_deliveries"],
  fraud: m["payout.reason_fraud"],
  other: m["payout.reason_other"],
};

export const PAYMENT_METHOD_LABELS: Record<PayoutPaymentMethod, () => string> = {
  bank_transfer: m["payout.payment_bank_transfer"],
  manual: m["payout.payment_manual"],
};

export const DISPUTE_STATUS_LABELS: Record<PayoutDisputeStatus, () => string> = {
  open: m["payout.dispute_open"],
  investigating: m["payout.dispute_investigating"],
  resolved: m["payout.dispute_resolved"],
};

/** Dispute pill variants — open red, investigating amber, resolved green. */
export const DISPUTE_STATUS_TAGS: Record<PayoutDisputeStatus, "fail" | "pending" | "success"> = {
  open: "fail",
  investigating: "pending",
  resolved: "success",
};
