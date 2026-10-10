import type {SmeStatus} from "@/types/smes-types";
import {AccountStatusPill} from "@/components/accounts/account-pills";
import {SME_STATUS_LABELS} from "./sme-labels";

/** The bordered status pill in the SMEs table and drawer header (Active / Flagged / Suspended). */
export function SmeStatusPill({status}: {status: SmeStatus}) {
  return <AccountStatusPill status={status} labels={SME_STATUS_LABELS} />;
}
