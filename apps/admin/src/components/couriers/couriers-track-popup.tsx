import {Star, X} from "lucide-react";
import {m} from "@/paraglide/messages";
import phoneIcon from "@/assets/courier-phone.svg";
import {formatEta} from "@/lib/format";
import type {CourierTrack} from "@/types/couriers-types";
import {CourierAvatar} from "./courier-avatar";
import {MOTION_LABELS, TIER_LABELS} from "./courier-labels";

/** One label/value row inside the popup's detail card. */
function PopupRow({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="shrink-0 text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{label}</span>
      <span className="truncate text-xs leading-[1.4] font-medium tracking-[0.12px] text-primary-800">{children}</span>
    </div>
  );
}

/** The purple header — avatar + online dot, name/id/motion pill, and the close button. */
function PopupHeader({track, onClose}: {track: CourierTrack; onClose: () => void}) {
  return (
    <div className="flex items-start justify-between bg-accent-500 p-4">
      <div className="flex items-center gap-2">
        <span className="relative">
          <CourierAvatar id={track.courierId} name={track.name} photoUrl={track.photoUrl} size="size-10 ring-2 ring-status-success-dark" />
          <span className="absolute right-0 bottom-0 size-3 rounded-xl border-2 border-white bg-status-success-dark" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-sm leading-[1.4] font-medium tracking-[0.14px] text-white">{track.name}</span>
          <span className="flex items-center gap-3">
            <span className="text-[10px] leading-[1.4] tracking-[0.1px] text-white">{track.courierId}</span>
            <span className="rounded-[15px] bg-secondary-50 px-2 py-0.5 text-xs leading-[1.4] font-medium tracking-[0.12px] text-secondary-500">
              {MOTION_LABELS[track.motion]()}
            </span>
          </span>
        </span>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label={m["couriers.popup_close"]()}
        className="rounded p-0.5 text-white transition-colors hover:bg-white/15"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

/** The grey detail card — location/offline/rating over the divider, then nodes, type, and ETA. */
function PopupDetails({track}: {track: CourierTrack}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-grey-100 p-2">
      <div className="flex flex-col gap-3 border-b border-grey-300 pb-3">
        <PopupRow label={m["couriers.popup_location"]()}>{track.lastKnownLocation}</PopupRow>
        <PopupRow label={m["couriers.popup_offline"]()}>
          {track.offlineMinutes === 1
            ? m["couriers.popup_offline_minutes_one"]({minutes: track.offlineMinutes})
            : m["couriers.popup_offline_minutes"]({minutes: track.offlineMinutes})}
        </PopupRow>
        <PopupRow label={m["couriers.popup_rating"]()}>
          <span className="inline-flex items-center gap-1">
            {track.rating.toFixed(1)}
            <Star className="size-3.5 fill-status-warning text-status-warning" aria-hidden="true" />
          </span>
        </PopupRow>
      </div>
      <PopupRow label={m["couriers.popup_pickup"]()}>
        {track.pickup.name} ({track.pickup.code})
      </PopupRow>
      <PopupRow label={m["couriers.popup_dropoff"]()}>
        {track.dropoff.name} ({track.dropoff.code})
      </PopupRow>
      <PopupRow label={m["couriers.popup_delivery_type"]()}>{TIER_LABELS[track.serviceTier]()}</PopupRow>
      <PopupRow label={m["couriers.popup_eta"]()}>{formatEta(track.etaAt)}</PopupRow>
    </div>
  );
}

/** The "Courier online" card floating over the map for the selected track. */
export function CouriersTrackPopup({track, x, y, onClose}: {track: CourierTrack; x: number; y: number; onClose: () => void}) {
  return (
    <div
      role="group"
      aria-label={track.name}
      className="absolute z-10 w-[260px] -translate-y-1/2 overflow-clip rounded-2xl border border-grey-300 bg-white shadow-[0_0_10px_4px_rgba(0,0,0,0.03)]"
      style={{left: x + 24, top: y}}
    >
      <PopupHeader track={track} onClose={onClose} />
      <div className="flex flex-col gap-3 p-4">
        <PopupDetails track={track} />
        <div className="flex items-center justify-between rounded-lg bg-grey-100 p-2">
          <img src={phoneIcon} alt="" className="size-4 text-grey-500" aria-hidden="true" />
          <span className="text-base leading-[1.4] font-bold tracking-[0.16px] text-primary-800">{track.phone}</span>
        </div>
      </div>
    </div>
  );
}
