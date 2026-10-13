import {ChevronRight} from "lucide-react";
import {Button} from "@alvo/ui";
import {DetailsTabs} from "./details-tabs";
import type {DetailsAction} from "./details-tabs";
import {SafeStagePill} from "./safe-stage-pill";
import {SummaryCard} from "./summary-card";
import type {DeliveryDetail, SafeBlock} from "@/types/activity-types";
import {m} from "@/paraglide/messages";
import mapUrl from "@/assets/map-home.png";

interface SafeBodyProps {
  delivery: DeliveryDetail;
  onAction: (a: DetailsAction) => void;
  onExtend: () => void;
  onSupport: () => void;
}

/** The Safe Details body — tiles, expiry countdown, locker info + navigate row, summary, Extend Pickup. */
export function SafeBody({delivery, onAction, onExtend, onSupport}: SafeBodyProps) {
  const safe = delivery.safe;
  if (!safe) return null;
  return (
    <>
      <DetailsTabs onAction={onAction} />
      <SafeStatus safe={safe} />
      <span aria-hidden="true" className="mt-6 h-px w-full bg-grey-300" />
      <LockerBlock safe={safe} />
      <SummaryCard delivery={delivery} />
      <Button className="mt-4 w-full text-[16px] font-medium" onClick={onExtend}>
        {m["del.extend_pickup"]()}
      </Button>
      <button
        type="button"
        onClick={onSupport}
        className="mt-4 self-center text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-status-fail"
      >
        {m["del.need_help"]()}
      </button>
    </>
  );
}

function SafeStatus({safe}: {safe: SafeBlock}) {
  return (
    <div className="mt-6 flex w-full flex-col gap-1">
      <SafeStagePill stage={safe.stage} />
      <span className="mt-1 text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["del.expires_in"]()}</span>
      <span className="text-[22px] font-bold leading-[1.2] text-status-fail">{safe.expiresIn}</span>
      <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">
        {`${m["del.booked_at"]()} ${safe.bookedAt} • ${m["del.pickup_at"]()} ${safe.pickupAt}`}
      </span>
    </div>
  );
}

function LockerBlock({safe}: {safe: SafeBlock}) {
  return (
    <div className="mt-4 flex w-full flex-col gap-1">
      <span className="text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-foreground">{safe.lockerName}</span>
      <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-primary-500">
        {`${m["del.locker_no"]()} ${safe.lockerNo}`}
      </span>
      <span className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{safe.address}</span>
      <button type="button" className="mt-3 flex w-full items-center gap-3 rounded-[12px] bg-[#f0fbfc] p-2 text-left">
        <img src={mapUrl} alt="" aria-hidden="true" className="size-[52px] shrink-0 rounded-[8px] object-cover" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{m["del.navigate"]()}</span>
          <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{safe.distance}</span>
        </span>
        <ChevronRight className="size-5 shrink-0 text-primary-500" aria-hidden="true" />
      </button>
    </div>
  );
}
