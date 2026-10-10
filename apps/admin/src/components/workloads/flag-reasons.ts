import {m} from "@/paraglide/messages";

/** Flag reason enum shared by the flag modal options and the flagged banner label. */
export type FlagReason = "damaged_item" | "delivery_dispute" | "wrong_address" | "suspicious_activity" | "lost_package" | "other";

export const FLAG_REASONS: FlagReason[] = [
  "damaged_item",
  "delivery_dispute",
  "wrong_address",
  "suspicious_activity",
  "lost_package",
  "other",
];

const REASON_LABELS: Record<FlagReason, () => string> = {
  damaged_item: m["workloads.reason_damaged_item"],
  delivery_dispute: m["workloads.reason_delivery_dispute"],
  wrong_address: m["workloads.reason_wrong_address"],
  suspicious_activity: m["workloads.reason_suspicious_activity"],
  lost_package: m["workloads.reason_lost_package"],
  other: m["workloads.reason_other"],
};

/** Resolves a stored reason to its label, falling back to the raw value for unknown backend values. */
export function flagReasonLabel(reason: string): string {
  return reason in REASON_LABELS ? REASON_LABELS[reason as FlagReason]() : reason;
}
