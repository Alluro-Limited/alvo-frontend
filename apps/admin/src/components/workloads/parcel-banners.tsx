import {m} from "@/paraglide/messages";
import type {ParcelDetail, ParcelStatus} from "@/types/workloads-types";
import {flagReasonLabel} from "./flag-reasons";
import {STATUS_LABELS} from "./status-labels";

const BANNER_TONES: Record<ParcelStatus, string> = {
  in_transit: "bg-[#e6f9f7] text-primary-600",
  delivered: "bg-status-success-subtle text-status-success-dark",
  pending_pickup: "bg-accent-50 text-accent-500",
  failed: "bg-status-fail-subtle text-status-fail-dark",
  expired: "bg-status-warning-subtle text-status-warning-dark",
};

/** The coloured status strip at the top of the drawer ("In transit / Departed on …"). */
export function ParcelStatusBanner({status, note}: {status: ParcelStatus; note?: string}) {
  return (
    <div className={`rounded-lg px-3 py-2.5 ${BANNER_TONES[status]}`}>
      <p className="text-sm leading-[1.4] font-medium tracking-[0.14px]">{STATUS_LABELS[status]()}</p>
      {note && <p className="text-xs leading-[1.4] tracking-[0.12px]">{note}</p>}
    </div>
  );
}

/** The amber banner shown once a parcel carries a flag — mirrors the flag record fields. */
export function FlaggedBanner({flag}: {flag: NonNullable<ParcelDetail["flag"]>}) {
  return (
    <div className="rounded-lg bg-status-warning-subtle px-3 py-1.5 text-status-warning-dark">
      <p className="text-sm leading-[1.4] font-medium tracking-[0.14px]">{m["workloads.flagged_banner_title"]()}</p>
      <p className="text-xs leading-[1.4] tracking-[0.12px]">{m["workloads.flagged_reason"]({reason: flagReasonLabel(flag.reason)})}</p>
      {flag.notes && <p className="text-xs leading-[1.4] tracking-[0.12px]">{m["workloads.flagged_notes"]({notes: flag.notes})}</p>}
    </div>
  );
}
