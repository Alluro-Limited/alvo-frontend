import {X} from "lucide-react";
import shipmentMapUrl from "@/assets/shipment-map.png";
import {m} from "@/paraglide/messages";
import type {ShipmentTracking} from "@/types/batch-types";
import {TrackingDetails} from "./tracking-details";
import {TrackingTimeline} from "./tracking-timeline";

interface TrackingOverlayProps {
  tracking: ShipmentTracking;
  onClose: () => void;
}

/**
 * Full-screen shipment tracking view: its own header with a close control, an
 * in-transit status banner, the route map on the left, and shipment details +
 * tracking timeline on the right. Rendered over the batch detail.
 */
export function TrackingOverlay({tracking, onClose}: TrackingOverlayProps) {
  return (
    <dialog
      open
      aria-label={tracking.recipientName}
      className="fixed inset-0 z-50 m-0 flex h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-0"
    >
      <button type="button" aria-label={m["batches.track_close"]()} onClick={onClose} className="h-full w-[276px] shrink-0 bg-white/60" />
      <div className="flex min-w-0 flex-1 flex-col bg-[#f9f9f9]">
        <header className="flex items-center justify-between border-b-[0.5px] border-grey-300 bg-white px-6 py-3">
          <div className="flex flex-col">
            <p className="text-base leading-[1.4] font-medium tracking-[0.16px] text-black">{tracking.recipientName}</p>
            <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">
              {tracking.shipmentId} · {m["batches.track_batch"]({id: tracking.batchId})} · {tracking.batchName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={m["batches.track_close"]()}
            className="flex size-6 items-center justify-center rounded bg-[#f9f9f9]"
          >
            <X className="size-4 text-grey-600" aria-hidden="true" />
          </button>
        </header>
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
          <div className="flex w-full flex-col justify-center rounded bg-primary-100/30 px-3 py-1.5">
            <p className="text-xs leading-[1.4] font-medium tracking-[0.12px] text-primary-600">{tracking.statusTitle}</p>
            <p className="text-xs leading-[1.4] tracking-[0.12px] text-primary-500">{tracking.statusDetail}</p>
          </div>
          <div className="flex items-start gap-6">
            <div className="relative min-h-[480px] flex-1 self-stretch overflow-clip rounded">
              <img src={shipmentMapUrl} alt={m["batches.track_map_alt"]()} className="absolute inset-0 size-full object-cover" />
            </div>
            <div className="flex w-[389px] shrink-0 flex-col gap-6">
              <TrackingDetails tracking={tracking} />
              <div className="flex w-full flex-col gap-4 rounded bg-[#f9f9f9] p-4">
                <p className="w-full text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["batches.timeline"]()}</p>
                <TrackingTimeline events={tracking.timeline} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
