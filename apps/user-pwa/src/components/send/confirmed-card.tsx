import {Copy} from "lucide-react";
import type {SendBooking} from "@/types/send-types";
import {m} from "@/paraglide/messages";

interface ConfirmedCardProps {
  booking: SendBooking;
  onOpenGuide: () => void;
}

function copyValue(value: string) {
  void navigator.clipboard?.writeText(value).catch(() => undefined);
}

/** The grey details card on the confirmation screen: address, code + tracking rows, and the two actions. */
export function ConfirmedCard({booking, onOpenGuide}: ConfirmedCardProps) {
  return (
    <div className="mt-4 flex w-full flex-col gap-6 rounded-[12px] bg-[#f9f9f9] p-5">
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full flex-col gap-0.5 text-[14px] leading-[1.4] tracking-[0.14px]">
          <span className="text-grey-500">{m["send.dropoff_at"]()}</span>
          <span className="font-medium text-foreground">{booking.dropOffLocation}</span>
        </div>
        <CopyRow label={m["send.dropoff_code"]()} value={booking.dropOffCode} onCopy={() => copyValue(booking.dropOffCode)} />
        <CopyRow label={m["send.tracking"]()} value={`#${booking.trackingNumber}`} onCopy={() => copyValue(booking.trackingNumber)} />
      </div>
      <div className="flex w-full gap-2.5">
        <button
          type="button"
          className="flex h-[50px] flex-1 items-center justify-center rounded-[8px] bg-[#f2f2f2] px-5 text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-primary-500"
        >
          {m["send.directions"]()}
        </button>
        <button
          type="button"
          onClick={onOpenGuide}
          className="flex h-[50px] flex-1 items-center justify-center rounded-[8px] bg-[#f2f2f2] px-5 text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-primary-500"
        >
          {m["send.guide"]()}
        </button>
      </div>
    </div>
  );
}

function CopyRow({label, value, onCopy}: {label: string; value: string; onCopy: () => void}) {
  return (
    <div className="flex w-full items-center gap-2.5">
      <div className="flex flex-1 flex-col gap-0.5 text-[14px] leading-[1.4] tracking-[0.14px]">
        <span className="text-grey-500">{label}</span>
        <span className="font-medium text-foreground">{value}</span>
      </div>
      <button type="button" onClick={onCopy} aria-label={m["send.copy"]()} className="flex size-6 items-center justify-center">
        <Copy className="size-5 text-foreground" aria-hidden="true" />
      </button>
    </div>
  );
}
