import {MoveUp} from "lucide-react";
import type {DeliveryTrack} from "@/types/activity-types";
import {m} from "@/paraglide/messages";

/** The track screen's bottom sheet — route title, single progress bar, and pickup/ETA times. */
export function TrackSheet({track, origin, destination}: {track: DeliveryTrack; origin: string; destination: string}) {
  return (
    <div className="mt-auto flex w-full flex-col gap-2.5 bg-white px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-6">
      <span aria-hidden="true" className="mx-auto h-1 w-12 rounded-full bg-grey-200" />
      <div className="mt-2 flex w-full flex-col gap-3">
        <div className="flex w-full items-center justify-between">
          <span className="flex items-center gap-2 text-[16px] font-semibold leading-[1.4] tracking-[0.16px] text-foreground">
            {origin}
            <MoveUp className="size-4" aria-hidden="true" />
            {destination}
          </span>
        </div>
        <span className="relative h-2 w-full rounded-[20px] bg-grey-100">
          <span className="absolute inset-y-0 left-0 rounded-[20px] bg-primary-500" style={{width: `${track.progress * 100}%`}} />
        </span>
        <div className="mt-1 flex w-full items-center justify-between">
          <TrackCell value={track.pickupTime} label={m["del.pickup"]()} />
          <span className="flex flex-col items-center">
            <span className="text-[12px] font-bold leading-[1.4] tracking-[0.12px] text-[#f43f5e]">{track.duration}</span>
            <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-600">{track.distance}</span>
          </span>
          <TrackCell value={track.eta} label={m["del.eta"]()} align="right" />
        </div>
      </div>
    </div>
  );
}

function TrackCell({value, label, align}: {value: string; label: string; align?: "right"}) {
  return (
    <span className={`flex flex-col ${align === "right" ? "items-end" : "items-start"}`}>
      <span className="text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-foreground">{value}</span>
      <span className="text-[12px] font-bold leading-[1.4] tracking-[0.12px] text-grey-600 uppercase">{label}</span>
    </span>
  );
}
