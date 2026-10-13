import {Button, Dialog, DialogBackdrop, DialogPopup, DialogPortal} from "@alvo/ui";
import lockerIconUrl from "@/assets/locker-icon.svg";
import mapUrl from "@/assets/map-home.png";
import type {LockerDetail} from "@/types/home-types";
import {m} from "@/paraglide/messages";

interface LockerModalProps {
  locker: LockerDetail | null;
  open: boolean;
  onClose: () => void;
}

/** Centered card for a tapped pin: locker summary, mini map, Get Direction / Cancel. */
export function LockerModal({locker, open, onClose}: LockerModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[342px] rounded-[26px] px-[18px] pt-8 pb-[18px]">
          {locker ? (
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full items-center gap-3 rounded-[14px] border-[1.5px] border-grey-100 bg-[#f9f9f9] px-3.5 py-2">
                <img src={lockerIconUrl} alt="" aria-hidden="true" className="size-9" />
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-[18px] font-medium leading-[1.2] text-black">{locker.name}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-[5px] rounded-full bg-[#f2fff7] py-2 pr-2.5 pl-2">
                      <span className="size-2 rounded-full bg-[#0e7b33]" aria-hidden="true" />
                      <span className="text-[12px] leading-[1.4] tracking-[0.24px] text-[#0e7b33] whitespace-nowrap">
                        {m["home.available"]()}
                      </span>
                    </span>
                    <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-black/50 whitespace-nowrap">
                      {m["home.slots"]({count: String(locker.slots)})}
                    </span>
                  </div>
                </div>
              </div>
              <img src={mapUrl} alt="" aria-hidden="true" className="h-[120px] w-full rounded-[12px] object-cover" />
              <div className="flex w-full flex-col gap-2">
                <Button className="w-full text-[16px] font-medium" onClick={onClose}>
                  {m["home.direction"]()}
                </Button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-[50px] w-full items-center justify-center rounded-[8px] bg-[#f2f2f2] px-5 py-3.5 text-[16px] font-medium leading-[1.4] tracking-[0.32px] text-primary-900"
                >
                  {m["home.cancel"]()}
                </button>
              </div>
            </div>
          ) : null}
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
