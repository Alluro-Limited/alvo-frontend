import {ArrowRight, CalendarDays} from "lucide-react";
import {Dialog, DialogBackdrop, DialogPopup, DialogPortal} from "@alvo/ui";
import {VEHICLE_CAPACITY} from "@/lib/vehicle-capacity";
import {m} from "@/paraglide/messages";
import type {VehicleType} from "@/types/earnings-types";

interface VehicleChangeSheetProps {
  from: VehicleType;
  to: VehicleType;
  open: boolean;
  pending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/** "Confirm vehicle change?" bottom sheet: current → new vehicle icons, assessment warning, actions. */
export function VehicleChangeSheet({from, to, open, pending, onConfirm, onClose}: VehicleChangeSheetProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="top-auto bottom-0 left-0 w-full max-w-none translate-x-0 translate-y-0 rounded-t-[32px] rounded-b-none px-6 pt-3 pb-[max(24px,env(safe-area-inset-bottom))]">
          <div className="mx-auto h-[7px] w-14 rounded-full bg-grey-300" aria-hidden="true" />
          <div className="mt-6 flex items-center justify-center gap-4">
            <VehicleBadge vehicle={from} />
            <ArrowRight className="size-4 text-grey-500" aria-hidden="true" />
            <VehicleBadge vehicle={to} highlight />
          </div>
          <h2 className="mt-6 text-center text-[20px] font-bold">{m["vehc.title"]()}</h2>
          <p className="mt-4 text-center text-[16px] leading-[22px] text-black/60">{m["vehc.desc"]()}</p>
          <div className="mt-4 flex items-center gap-2 rounded-[12px] bg-[#f9f9f9] p-3">
            <CalendarDays className="size-6 shrink-0" aria-hidden="true" />
            <p className="text-[14px] font-medium">{m["vehc.note"]()}</p>
          </div>
          <div className="mt-5 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-[50px] flex-1 rounded-[8px] bg-grey-200 text-[16px] font-medium text-primary-850"
            >
              {m["home.cancel"]()}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={pending}
              className="h-[50px] flex-1 rounded-[8px] bg-primary-500 text-[16px] font-medium text-white disabled:opacity-60"
            >
              {pending ? m["vehc.requesting"]() : m["vehc.request"]()}
            </button>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

function VehicleBadge({vehicle, highlight}: {vehicle: VehicleType; highlight?: boolean}) {
  return (
    <span className="flex w-16 flex-col items-center gap-1">
      <span className="grid size-16 place-items-center rounded-full bg-grey-100">
        <img src={VEHICLE_CAPACITY[vehicle].icon} alt="" className="size-10" />
      </span>
      <span className={`text-[10px] ${highlight ? "font-medium text-primary-500" : ""}`}>{m[`veh.${vehicle}`]()}</span>
    </span>
  );
}
