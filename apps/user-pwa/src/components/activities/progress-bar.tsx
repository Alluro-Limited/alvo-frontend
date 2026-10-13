import {cn} from "cnfast";
import type {DeliveryStatus} from "@/types/activity-types";

const COLORS: Record<DeliveryStatus, string> = {
  pending: "bg-[#d97706]",
  booked: "bg-primary-500",
  dropped: "bg-[#30b5fd]",
  enroute: "bg-primary-500",
  delayed: "bg-[#d97706]",
  complete: "bg-success-400",
  expired: "bg-status-fail",
  collected: "bg-success-400",
  cancelled: "bg-grey-300",
};

interface ProgressBarProps {
  /** Filled milestone segments, 0–4 (fractions allowed — a knob marks the in-progress edge). */
  progress: number;
  status: DeliveryStatus;
}

/** The four-segment milestone bar — filled segments colored by status, knob on the active edge. */
export function ProgressBar({progress, status}: ProgressBarProps) {
  const color = COLORS[status];
  return (
    <div className="flex w-full items-center gap-1.5" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={4}>
      {[0, 1, 2, 3].map((i) => {
        const fill = Math.min(Math.max(progress - i, 0), 1);
        const active = fill > 0 && fill < 1;
        return (
          <span key={i} className="relative h-2 flex-1 rounded-[20px] bg-grey-100">
            <span className={cn("absolute inset-y-0 left-0 rounded-[20px]", color)} style={{width: `${fill * 100}%`}} />
            {active ? (
              <span
                aria-hidden="true"
                className={cn("absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full border-2 border-white shadow", color)}
                style={{left: `calc(${fill * 100}% - 7px)`}}
              />
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
