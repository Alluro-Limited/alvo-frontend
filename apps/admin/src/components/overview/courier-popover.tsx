import {useState} from "react";
import {cn} from "cnfast";
import chevronIcon from "@/assets/chevron-down-teal.svg";
import {formatEta, formatRelativeTime} from "@/lib/format";
import {m} from "@/paraglide/messages";
import {useCourierDetailQuery} from "@/queries/use-courier-detail-query";
import type {CourierDetail} from "@/types/dashboard-types";
import {DetailRow} from "./detail-row";
import {PopoverError} from "./popover-error";
import {PopoverHeader} from "./popover-header";
import {PopoverSkeleton} from "./popover-skeleton";
import {StatusPill} from "./status-pill";
import {UsageProgress} from "./usage-progress";

function CourierAvatar({courier}: {courier: CourierDetail}) {
  const initials = courier.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="relative">
      {courier.avatarUrl ? (
        <img src={courier.avatarUrl} alt="" className="size-10 rounded-full object-cover" />
      ) : (
        <span className="flex size-10 items-center justify-center rounded-full bg-white/20 text-sm font-medium text-white">{initials}</span>
      )}
      <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-accent bg-status-success" />
    </div>
  );
}

function CourierDetails({courier}: {courier: CourierDetail}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-[#f9f9f9] p-2">
      <div className="flex flex-col gap-2 border-b-[0.5px] border-grey-300 pb-3">
        <DetailRow label={m["overview.courier.last_location"]()}>
          <span className="text-primary-800">{courier.lastLocation}</span>
        </DetailRow>
        {courier.offlineSinceAt && (
          <DetailRow label={m["overview.courier.went_offline"]()}>
            <span className="text-status-fail">{formatRelativeTime(courier.offlineSinceAt)}</span>
          </DetailRow>
        )}
        <DetailRow label={m["overview.courier.rating"]()}>
          <span className="text-primary-800">{courier.rating} ★</span>
        </DetailRow>
      </div>
      <DetailRow label={m["overview.courier.pickup_node"]()}>
        <span className="text-primary-800">{courier.pickupNode}</span>
      </DetailRow>
      <DetailRow label={m["overview.courier.dropoff_node"]()}>
        <span className="text-primary-800">{courier.dropoffNode}</span>
      </DetailRow>
      <DetailRow label={m["overview.courier.delivery_type"]()}>
        <span className="text-primary-800">{courier.deliveryType}</span>
      </DetailRow>
      <DetailRow label={m["overview.courier.eta"]()}>
        <span className="text-primary-800">{formatEta(courier.etaAt)}</span>
      </DetailRow>
    </div>
  );
}

/** Courier detail card behind a marker click — purple header, deliveries bar, collapsible trip details. */
export function CourierPopover({id, onClose}: {id: string; onClose: () => void}) {
  const detail = useCourierDetailQuery(id);
  const [expanded, setExpanded] = useState(false);
  if (detail.isPending) return <PopoverSkeleton />;
  if (detail.isError || !detail.data) return <PopoverError onRetry={() => void detail.refetch()} />;
  const courier = detail.data;

  return (
    <>
      <PopoverHeader className="bg-accent" onClose={onClose}>
        <div className="flex items-center gap-2">
          <CourierAvatar courier={courier} />
          <div className="flex flex-col gap-0.5">
            <p className="text-sm leading-[1.4] font-medium text-white">{courier.name}</p>
            <div className="flex items-center gap-1">
              <p className="text-[10px] leading-[1.4] text-white">{courier.id}</p>
              <StatusPill status={courier.status} />
            </div>
          </div>
        </div>
      </PopoverHeader>
      <div className="flex flex-col gap-3 p-4">
        <UsageProgress
          title={m["overview.courier.todays_deliveries"]()}
          used={courier.deliveriesDone}
          total={courier.deliveriesTotal}
          freeLabel={(count) => m["overview.courier.remaining"]({count})}
          pctLabel={(pct) => m["overview.courier.pct_done"]({pct})}
        />
        <div className="flex flex-col gap-2">
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((open) => !open)}
            className="flex w-full items-center justify-between"
          >
            <span className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["overview.courier.details"]()}</span>
            <span className="flex items-center gap-1 text-xs leading-[1.4] font-medium tracking-[0.12px] text-primary-500">
              {expanded ? m["overview.courier.hide"]() : m["overview.courier.show"]()}
              <img src={chevronIcon} alt="" className={cn("size-3 transition-transform", expanded && "rotate-180")} />
            </span>
          </button>
          {expanded && <CourierDetails courier={courier} />}
        </div>
      </div>
    </>
  );
}
