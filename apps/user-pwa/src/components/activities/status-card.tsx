import {ChevronRight, MoveUp} from "lucide-react";
import {useNavigate} from "@tanstack/react-router";
import {ProgressBar} from "./progress-bar";
import {StatusPill} from "./status-pill";
import type {DeliveryDetail} from "@/types/activity-types";
import {m} from "@/paraglide/messages";
import foldedMapsUrl from "@/assets/folded-maps.png";

/** The bordered milestone card — route + status pill, progress bar, status note, and the track row. */
export function StatusCard({delivery}: {delivery: DeliveryDetail}) {
  const navigate = useNavigate();
  return (
    <div className="flex w-full flex-col gap-4 rounded-[12px] border-[0.5px] border-grey-300 px-4 pb-4 pt-[18px]">
      <div className="flex w-full flex-col gap-5">
        <div className="flex w-full items-center justify-between">
          <span className="flex items-center gap-2 text-[14px] font-semibold tracking-[0.14px] text-foreground">
            {delivery.origin}
            <MoveUp className="size-4" aria-hidden="true" />
            {delivery.destination}
          </span>
          <StatusPill status={delivery.status} />
        </div>
        <ProgressBar progress={delivery.progress} status={delivery.status} />
        <div className="flex w-full flex-col gap-1">
          <p className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{delivery.statusMessage}</p>
          <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-600">{delivery.updatedAt}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => void navigate({to: "/delivery/$id/track", params: {id: delivery.id}})}
        className="flex w-full items-center justify-between rounded-[8px] bg-[#f9f9f9] p-3 text-left"
      >
        <span className="flex items-center gap-2.5">
          <img src={foldedMapsUrl} alt="" aria-hidden="true" className="h-8 w-[30px]" />
          <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{m["del.track_cta"]()}</span>
        </span>
        <ChevronRight className="size-6 text-primary-500" aria-hidden="true" />
      </button>
    </div>
  );
}
