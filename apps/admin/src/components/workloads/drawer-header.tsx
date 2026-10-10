import {Button, DialogClose, DialogTitle} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {ParcelDetail} from "@/types/workloads-types";
import wlClose from "@/assets/wl-close.svg";
import wlPin from "@/assets/wl-pin.svg";

interface DrawerHeaderProps {
  parcel: ParcelDetail | undefined;
  tracking: boolean;
  hasTracking: boolean;
  onToggleTracking: () => void;
}

/** Drawer title row: "Parcel details", parcel id, service type, Flagged pill, map toggle, close. */
export function DrawerHeader({parcel, tracking, hasTracking, onToggleTracking}: DrawerHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-grey-200 bg-white px-4 py-3">
      <div className="flex min-w-0 items-center gap-2">
        <DialogTitle className="text-base leading-[1.4] font-semibold whitespace-nowrap text-black">
          {m["workloads.drawer_title"]()}
        </DialogTitle>
        {parcel && (
          <>
            <span className="text-sm font-medium tracking-[0.14px] text-grey-600">{parcel.id}</span>
            <span className="rounded-full bg-grey-100 px-2 py-0.5 text-xs text-grey-600">
              {parcel.serviceType === "express" ? m["workloads.service_express"]() : m["workloads.service_standard"]()}
            </span>
          </>
        )}
        {parcel?.flag && (
          <span className="rounded-full bg-status-warning-subtle px-2 py-0.5 text-xs font-medium text-status-warning-dark">
            {m["workloads.flagged_tag"]()}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {hasTracking && (
          <Button variant={tracking ? "default" : "outline"} onClick={onToggleTracking}>
            <img src={wlPin} alt="" className="size-4" aria-hidden="true" />
            {tracking ? m["workloads.hide_map"]() : m["workloads.track_on_map"]()}
          </Button>
        )}
        <DialogClose className="rounded p-0.5 hover:bg-grey-100" aria-label={m["workloads.close_drawer"]()}>
          <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
        </DialogClose>
      </div>
    </header>
  );
}
