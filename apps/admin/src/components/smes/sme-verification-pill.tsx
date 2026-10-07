import type {SmeVerification} from "@/types/smes-types";
import {AccountVerificationPill} from "@/components/accounts/account-pills";
import {SME_VERIFICATION_LABELS} from "./sme-labels";

/** The filled Verification pill in the SMEs table (Verified / Partial / Unverified). */
export function SmeVerificationPill({verification}: {verification: SmeVerification}) {
  return <AccountVerificationPill verification={verification} labels={SME_VERIFICATION_LABELS} />;
}
