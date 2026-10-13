import type {SafeReservation} from "@/types/safe-types";
import {m} from "@/paraglide/messages";

/** The grey details card on the reserved screen — storage location and validity countdown. */
export function ReservedCard({reservation}: {reservation: SafeReservation}) {
  return (
    <div className="flex w-full flex-col gap-6 rounded-[12px] bg-[#f9f9f9] p-5">
      <div className="flex w-full flex-col gap-0.5 text-[14px] leading-[1.4] tracking-[0.14px]">
        <span className="text-grey-500">{m["safe.storage_at"]()}</span>
        <span className="font-medium text-foreground">{reservation.location}</span>
      </div>
      <div className="flex w-full flex-col gap-0.5 text-[14px] leading-[1.4] tracking-[0.14px]">
        <span className="text-grey-500">{m["safe.valid_until"]()}</span>
        <span className="font-medium text-foreground">
          {reservation.validUntil} <span className="text-[12px] tracking-[0.12px] text-status-fail">{reservation.remaining}</span>
        </span>
      </div>
    </div>
  );
}
