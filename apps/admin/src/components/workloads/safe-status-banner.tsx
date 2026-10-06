import type {SafeItemStatus} from "@/types/workloads-types";
import {SAFE_STATUS_LABELS} from "./safe-status-labels";

const BANNER_TONES: Record<SafeItemStatus, string> = {
  active: "bg-[#e6f9f7] text-primary-600",
  pending_pickup: "bg-accent-50 text-accent-500",
  expiring_soon: "bg-status-warning-subtle text-status-warning-dark",
  expired: "bg-status-fail-subtle text-status-fail-dark",
  retrieved: "bg-status-success-subtle text-status-success-dark",
};

/** The coloured status strip at the top of the Safe drawer ("Active / Stored on …"). */
export function SafeStatusBanner({status, note}: {status: SafeItemStatus; note?: string}) {
  return (
    <div className={`rounded-lg px-3 py-2.5 ${BANNER_TONES[status]}`}>
      <p className="text-sm leading-[1.4] font-medium tracking-[0.14px]">{SAFE_STATUS_LABELS[status]()}</p>
      {note && <p className="text-xs leading-[1.4] tracking-[0.12px]">{note}</p>}
    </div>
  );
}
