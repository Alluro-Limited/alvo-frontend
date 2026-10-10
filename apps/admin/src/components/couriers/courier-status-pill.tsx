import type {CourierStatus} from "@/types/couriers-types";
import {AccountStatusPill} from "@/components/accounts/account-pills";
import {COURIER_STATUS_LABELS} from "./courier-labels";

/** The bordered status pill in the couriers table and drawer header (Active / Flagged / Suspended). */
export function CourierStatusPill({status}: {status: CourierStatus}) {
  return <AccountStatusPill status={status} labels={COURIER_STATUS_LABELS} />;
}
