import {m} from "@/paraglide/messages";
import {formatNaira} from "@/lib/format-naira";
import type {ShipmentTracking} from "@/types/batch-types";

const SIZE_LABEL: Record<string, () => string> = {
  S: m["batch.size_s"],
  M: m["batch.size_m"],
  B: m["batch.size_b"],
};

function DetailRow({label, value, last}: {label: string; value: string; last?: boolean}) {
  return (
    <div className={last ? "flex items-center gap-2.5 py-3" : "flex items-center gap-2.5 border-b-[0.5px] border-grey-400 py-3"}>
      <p className="flex-1 text-xs leading-[1.4] tracking-[0.24px] text-grey-500">{label}</p>
      <p className="flex-1 text-right text-xs leading-[1.4] tracking-[0.24px] text-black">{value}</p>
    </div>
  );
}

/** The "Shipment details" card — label/value pairs down the right column. */
export function TrackingDetails({tracking}: {tracking: ShipmentTracking}) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border-[0.75px] border-grey-200 bg-white p-4">
      <p className="w-full text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["batches.shipment_details"]()}</p>
      <div className="flex w-full flex-col">
        <DetailRow label={m["batches.col_recipient"]()} value={tracking.recipient} />
        <DetailRow label={m["batches.col_phone"]()} value={tracking.phone} />
        <DetailRow label={m["batches.origin_locker"]()} value={tracking.originLocker} />
        <DetailRow label={m["batches.destination_locker"]()} value={tracking.destinationLocker} />
        <DetailRow label={m["batches.parcel_size"]()} value={`${SIZE_LABEL[tracking.size]()} (${tracking.size})`} />
        <DetailRow
          label={m["batches.delivery_priority"]()}
          value={tracking.priority === "express" ? m["shipments.priority_express"]() : m["shipments.priority_standard"]()}
        />
        <DetailRow label={m["batches.delivery_fee"]()} value={`₦${formatNaira(tracking.deliveryFee)}`} last />
      </div>
    </div>
  );
}
