import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {CourierStatus} from "@/types/dashboard-types";
import type {OverviewMapNode} from "@/types/dashboard-types";

const TONES = {
  online: "bg-[#f2fff7] text-status-success",
  offline: "bg-grey-100 text-grey-500",
  warning: "bg-status-warning-subtle text-status-warning-dark",
  enroute: "bg-secondary-50 text-secondary-500",
  idle: "bg-grey-100 text-grey-500",
} as const;

const LABELS: Record<keyof typeof TONES, () => string> = {
  online: m["overview.status.online"],
  offline: m["overview.status.offline"],
  warning: m["overview.status.warning"],
  enroute: m["overview.status.enroute"],
  idle: m["overview.status.idle"],
};

interface StatusPillProps {
  status: OverviewMapNode["status"] | CourierStatus;
}

/** Small rounded status chip in a popover header ("Online", "Enroute"). */
export function StatusPill({status}: StatusPillProps) {
  return (
    <span className={cn("rounded-lg px-1 py-0.5 text-[10px] leading-[1.4] font-medium tracking-[0.1px]", TONES[status])}>
      {LABELS[status]()}
    </span>
  );
}
