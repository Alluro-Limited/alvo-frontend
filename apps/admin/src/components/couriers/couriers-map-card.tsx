import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import dropboxIcon from "@/assets/courier-dropbox.svg";
import packageIcon from "@/assets/courier-package.svg";
import routeIcon from "@/assets/courier-route.svg";
import type {CourierTrack, CourierTrackStatus} from "@/types/couriers-types";
import {TYPE_SHORT_LABELS} from "@/components/assignment/assignment-labels";
import {CourierAvatar} from "./courier-avatar";
import {TRACK_STATUS_LABELS, VEHICLE_LABELS} from "./courier-labels";

const STATUS_PILL: Record<CourierTrackStatus, string> = {
  in_transit: "border-primary-600 bg-primary-50/40 text-primary-600",
  delayed: "border-status-delayed bg-status-delayed-subtle text-status-delayed",
};

/** Dotted pill — In Transit (teal) and Delayed (orange). */
function StatusPill({status}: {status: CourierTrackStatus}) {
  return (
    <span className={cn("flex h-6 items-center gap-[5px] rounded-[33px] border pr-2.5 pl-2", STATUS_PILL[status])}>
      <span className="size-2 rounded-full bg-current" aria-hidden="true" />
      <span className="text-xs leading-[1.4] tracking-[0.24px] whitespace-nowrap">{TRACK_STATUS_LABELS[status]()}</span>
    </span>
  );
}

/** Orange Public Pool pill — same dotted pill family as the status. */
function PublicPoolPill() {
  return (
    <span className="flex h-6 items-center gap-[5px] rounded-[33px] border border-warning-500 bg-warning-50 pr-2.5 pl-2 text-warning-500">
      <span className="size-2 rounded-full bg-current" aria-hidden="true" />
      <span className="text-xs leading-[1.4] tracking-[0.24px] whitespace-nowrap">{m["couriers.track_public_pool"]()}</span>
    </span>
  );
}

/** Blue delivery-type pill with the dropbox glyph. */
function TypePill({type}: {type: CourierTrack["type"]}) {
  return (
    <span className="flex h-6 items-center gap-1 rounded-[40px] border border-secondary-500 bg-secondary-50 pr-2.5 pl-2 text-secondary-500">
      <img src={dropboxIcon} alt="" className="size-3" aria-hidden="true" />
      <span className="truncate text-xs leading-[1.4] tracking-[0.24px] whitespace-nowrap">{TYPE_SHORT_LABELS[type]()}</span>
    </span>
  );
}

function DetailRow({icon, children}: {icon: string; children: React.ReactNode}) {
  return (
    <p className="flex items-center gap-1.5">
      <img src={icon} alt="" className="size-3.5 shrink-0 text-grey-600" aria-hidden="true" />
      <span className="truncate text-xs leading-[1.4] font-medium tracking-[0.12px] text-grey-600">{children}</span>
    </p>
  );
}

/** One floating-panel card — courier, status/type pills, batch + route, and the ETA line. */
export function CouriersMapCard({
  track,
  selected,
  onSelect,
}: {
  track: CourierTrack;
  selected: boolean;
  onSelect: (courierId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(track.courierId)}
      aria-pressed={selected}
      aria-label={track.name}
      className={cn(
        "flex w-full shrink-0 flex-col gap-2 rounded-xl border p-3 text-left transition-colors",
        selected ? "border-primary-500 bg-white" : "border-transparent bg-grey-100 hover:bg-grey-200"
      )}
    >
      <span className="flex items-center gap-4">
        <CourierAvatar id={track.courierId} name={track.name} photoUrl={track.photoUrl} size="size-8" />
        <span className="min-w-0">
          <span className="block truncate text-sm leading-[1.4] font-bold tracking-[0.14px] text-primary-500">{track.name}</span>
          <span className="block text-xs leading-[1.4] tracking-[0.12px] text-grey-600">
            {track.courierId} · {VEHICLE_LABELS[track.vehicle]()}
          </span>
        </span>
      </span>
      <span className="flex items-center gap-2">
        <StatusPill status={track.status} />
        {track.publicPool && <PublicPoolPill />}
        <TypePill type={track.type} />
      </span>
      <DetailRow icon={packageIcon}>
        {track.batchId} •{" "}
        {track.items === 1 ? m["couriers.track_items_one"]({count: track.items}) : m["couriers.track_items"]({count: track.items})}
      </DetailRow>
      <DetailRow icon={routeIcon}>
        {track.pickup.name} ({track.pickup.code}) → {track.dropoff.name} ({track.dropoff.zone})
      </DetailRow>
      <span className="text-[10px] leading-[1.4] font-medium tracking-[0.1px] text-grey-500">
        {m["couriers.track_eta"]({minutes: track.etaMinutes, distance: track.distanceKm})}
      </span>
    </button>
  );
}
