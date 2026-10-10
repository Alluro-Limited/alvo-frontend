import {m} from "@/paraglide/messages";
import type {SuspendReason, UserStatus, UserVerification} from "@/types/users-types";

export const USER_STATUS_LABELS: Record<UserStatus, () => string> = {
  active: m["users.status_active"],
  flagged: m["users.status_flagged"],
  suspended: m["users.status_suspended"],
};

export const USER_VERIFICATION_LABELS: Record<UserVerification, () => string> = {
  verified: m["users.verification_verified"],
  partial: m["users.verification_partial"],
  unverified: m["users.verification_unverified"],
};

const SUSPEND_REASON_LABELS: Record<SuspendReason, () => string> = {
  suspicious_activity: m["users.reason_suspicious_activity"],
  payment_fraud: m["users.reason_payment_fraud"],
  policy_violations: m["users.reason_policy_violations"],
  abusive_behavior: m["users.reason_abusive_behavior"],
  duplicate_account: m["users.reason_duplicate_account"],
  other: m["users.reason_other"],
};

/** Fallback-tolerant status label for backend filter options. */
export function userStatusLabel(status: string): string {
  return status in USER_STATUS_LABELS ? USER_STATUS_LABELS[status as UserStatus]() : status;
}

export function userVerificationLabel(verification: string): string {
  return verification in USER_VERIFICATION_LABELS ? USER_VERIFICATION_LABELS[verification as UserVerification]() : verification;
}

/** Maps the backend filter ids to labeled options for the list toolbar. */
export function userFilterOptions(filters: {statuses: string[]; verifications: string[]}) {
  return {
    statusOptions: filters.statuses.map((id) => ({id, label: userStatusLabel(id)})),
    verificationOptions: filters.verifications.map((id) => ({id, label: userVerificationLabel(id)})),
  };
}

/** Resolves a stored suspend reason to its label, falling back to the raw value for unknown backend values. */
export function suspendReasonLabel(reason: string): string {
  return reason in SUSPEND_REASON_LABELS ? SUSPEND_REASON_LABELS[reason as SuspendReason]() : reason;
}

export {formatJoined, formatJoinedLong, formatNaira} from "@/lib/format";
