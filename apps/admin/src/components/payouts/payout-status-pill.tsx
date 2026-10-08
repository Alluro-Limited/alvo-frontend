import {StatusTag} from "@alvo/ui";
import type {PayoutStatus} from "@/types/payouts-types";
import {PAYOUT_STATUS_LABELS, PAYOUT_STATUS_TAGS} from "./payout-labels";

/** The dotted status pill in the payout table and the drawer amount strip. */
export function PayoutStatusPill({status}: {status: PayoutStatus}) {
  return <StatusTag status={PAYOUT_STATUS_TAGS[status]}>{PAYOUT_STATUS_LABELS[status]()}</StatusTag>;
}
