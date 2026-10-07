import type {UserVerification} from "@/types/users-types";
import {AccountVerificationPill} from "@/components/accounts/account-pills";
import {USER_VERIFICATION_LABELS} from "./user-labels";

/** The filled Verification pill — a check-circle glyph plus the level label. */
export function VerificationPill({verification}: {verification: UserVerification}) {
  return <AccountVerificationPill verification={verification} labels={USER_VERIFICATION_LABELS} />;
}
