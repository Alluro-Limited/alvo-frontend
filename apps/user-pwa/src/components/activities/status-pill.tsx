import type {ActivityKind, DeliveryStatus} from "@/types/activity-types";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";

const STYLES: Record<DeliveryStatus, {label: SimpleMessage; className: string}> = {
  pending: {label: "del.st_pending", className: "bg-[#fef6e7] text-[#b54708]"},
  booked: {label: "del.st_booked", className: "bg-[#f9f9f9] text-grey-600"},
  dropped: {label: "del.st_dropped", className: "bg-[#e8f4fe] text-[#1570ef]"},
  enroute: {label: "del.st_enroute", className: "bg-[#e9fafb] text-primary-500"},
  delayed: {label: "del.st_delayed", className: "bg-[#fef6e7] text-[#b54708]"},
  complete: {label: "del.st_complete", className: "bg-[#dff2d5] text-success-600"},
  expired: {label: "del.st_expired", className: "bg-[#fde8ef] text-status-fail-dark"},
  collected: {label: "del.st_collected", className: "bg-[#dff2d5] text-success-600"},
  cancelled: {label: "del.st_cancelled", className: "bg-[#f9f9f9] text-grey-600"},
};

/** The small rounded status pill used on activity cards and the details milestone. `booked` safes read "RESERVED". */
export function StatusPill({status, kind}: {status: DeliveryStatus; kind?: ActivityKind}) {
  const style = STYLES[status];
  const label: SimpleMessage = kind === "safe" && status === "booked" ? "del.st_reserved" : style.label;
  return (
    <span className={`rounded-[9px] px-2 py-1 text-[12px] font-semibold leading-[1.4] tracking-[0.01em] uppercase ${style.className}`}>
      {m[label]()}
    </span>
  );
}
