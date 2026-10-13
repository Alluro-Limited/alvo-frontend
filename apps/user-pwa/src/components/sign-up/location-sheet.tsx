import {Button} from "@alvo/ui";
import {Info} from "lucide-react";
import {AuthSheet} from "@/components/auth/auth-sheet";
import locationIconUrl from "@/assets/icon-location.svg";
import {m} from "@/paraglide/messages";

interface LocationSheetProps {
  open: boolean;
  onClose: () => void;
  onAllow: () => void;
}

/** "Locate Nearest Lockers" sheet — geolocation consent with the privacy note from the design. */
export function LocationSheet({open, onClose, onAllow}: LocationSheetProps) {
  return (
    <AuthSheet open={open} onClose={onClose}>
      <div className="mt-9 flex w-full flex-col items-center gap-8">
        <img src={locationIconUrl} alt="" aria-hidden="true" className="size-16" />
        <div className="flex w-full flex-col gap-2 text-center">
          <h2 className="text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-foreground">{m["su.loc_title"]()}</h2>
          <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-grey-500">{m["su.loc_desc"]()}</p>
        </div>
      </div>
      <div className="mt-8 flex w-full flex-col gap-4 rounded-[12px] border-[0.5px] border-primary-500 bg-[#f2fcfd] p-4">
        <span className="flex items-center overflow-clip rounded-[8px] bg-primary-500 p-1.5">
          <Info className="size-6 text-white" aria-hidden="true" />
        </span>
        <div className="flex w-full flex-col gap-0.5 text-primary-900">
          <span className="text-[16px] font-medium leading-[1.4] tracking-[0.16px]">{m["su.loc_privacy"]()}</span>
          <span className="text-[14px] leading-[1.4] tracking-[0.14px] opacity-70">{m["su.loc_privacy_desc"]()}</span>
        </div>
      </div>
      <div className="mt-8 flex w-full flex-col gap-2.5">
        <Button className="w-full text-[16px] font-medium" onClick={onAllow}>
          {m["su.loc_allow"]()}
        </Button>
        <button
          type="button"
          onClick={onClose}
          className="flex h-[50px] w-full items-center justify-center rounded-[8px] px-5 py-3.5 text-[16px] font-medium leading-[1.4] tracking-[0.32px] text-primary-900"
        >
          {m["su.loc_later"]()}
        </button>
      </div>
    </AuthSheet>
  );
}
