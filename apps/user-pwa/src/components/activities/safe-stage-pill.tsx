import type {SafeStage} from "@/types/activity-types";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";

const STYLES: Record<SafeStage, {label: SimpleMessage; className: string}> = {
  reserved: {label: "del.ss_reserved", className: "bg-[#f9f9f9] text-grey-600"},
  awaiting: {label: "del.ss_awaiting", className: "bg-[#e8f4fe] text-[#1570ef]"},
  stored: {label: "del.ss_stored", className: "bg-[#e9fafb] text-primary-500"},
  picked: {label: "del.ss_picked", className: "bg-[#dff2d5] text-success-600"},
  expired: {label: "del.ss_expired", className: "bg-[#fde8ef] text-status-fail-dark"},
};

/** The safe-storage lifecycle pill on Safe Details — Reserved → Awaiting Drop-Off → Stored → Picked Up → Expired. */
export function SafeStagePill({stage}: {stage: SafeStage}) {
  const style = STYLES[stage];
  return (
    <span
      className={`self-start rounded-[9px] px-2 py-1 text-[12px] font-semibold leading-[1.4] tracking-[0.01em] uppercase ${style.className}`}
    >
      {m[style.label]()}
    </span>
  );
}
