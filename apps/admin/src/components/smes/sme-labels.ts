import {formatClockTime} from "@/lib/format";
import {m} from "@/paraglide/messages";
import type {SmeDeactivateReason, SmeStatus, SmeSuspendReason, SmeVerification} from "@/types/smes-types";

export const SME_STATUS_LABELS: Record<SmeStatus, () => string> = {
  active: m["smes.status_active"],
  flagged: m["smes.status_flagged"],
  suspended: m["smes.status_suspended"],
};

export const SME_VERIFICATION_LABELS: Record<SmeVerification, () => string> = {
  verified: m["smes.verification_verified"],
  partial: m["smes.verification_partial"],
  unverified: m["smes.verification_unverified"],
};

const SUSPEND_REASON_LABELS: Record<SmeSuspendReason, () => string> = {
  fraudulent_bulk_uploads: m["smes.reason_fraudulent_bulk_uploads"],
  payment_default: m["smes.reason_payment_default"],
  fake_documents: m["smes.reason_fake_documents"],
  policy_violations: m["smes.reason_policy_violations"],
  abusive_behavior: m["smes.reason_abusive_behavior"],
  other: m["smes.reason_other"],
};

const DEACTIVATE_REASON_LABELS: Record<SmeDeactivateReason, () => string> = {
  customer_decision: m["smes.deactivate_reason_customer_decision"],
  business_closed: m["smes.deactivate_reason_business_closed"],
  compliance_hold: m["smes.deactivate_reason_compliance_hold"],
  duplicate_account: m["smes.deactivate_reason_duplicate_account"],
  other: m["smes.deactivate_reason_other"],
};

/** Fallback-tolerant status label for backend filter options. */
export function smeStatusLabel(status: string): string {
  return status in SME_STATUS_LABELS ? SME_STATUS_LABELS[status as SmeStatus]() : status;
}

export function smeVerificationLabel(verification: string): string {
  return verification in SME_VERIFICATION_LABELS ? SME_VERIFICATION_LABELS[verification as SmeVerification]() : verification;
}

/** Maps the backend filter ids to labeled options for the list toolbar. */
export function smeFilterOptions(filters: {statuses: string[]; verifications: string[]}) {
  return {
    statusOptions: filters.statuses.map((id) => ({id, label: smeStatusLabel(id)})),
    verificationOptions: filters.verifications.map((id) => ({id, label: smeVerificationLabel(id)})),
  };
}

/** Resolves a stored suspend reason to its label, falling back to the raw value for unknown backend values. */
export function smeSuspendReasonLabel(reason: string): string {
  return reason in SUSPEND_REASON_LABELS ? SUSPEND_REASON_LABELS[reason as SmeSuspendReason]() : reason;
}

export function smeDeactivateReasonLabel(reason: string): string {
  return reason in DEACTIVATE_REASON_LABELS ? DEACTIVATE_REASON_LABELS[reason as SmeDeactivateReason]() : reason;
}

const DAY_MS = 86_400_000;

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** "Today" / "Yesterday" / "14/06/2026" — the Batch History group header. */
export function batchDayLabel(iso: string, now = new Date()): string {
  const day = new Date(iso);
  if (sameDay(day, now)) return m["smes.batch_today"]();
  if (sameDay(day, new Date(now.getTime() - DAY_MS))) return m["smes.batch_yesterday"]();
  const dd = String(day.getDate()).padStart(2, "0");
  const mm = String(day.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${day.getFullYear()}`;
}

/** "Today, 7:15 AM" — the timestamp part of a batch row's meta line. */
export function batchStamp(iso: string, now = new Date()): string {
  return `${batchDayLabel(iso, now)}, ${formatClockTime(iso)}`;
}
