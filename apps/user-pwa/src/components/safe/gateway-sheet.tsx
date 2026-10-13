import {X} from "lucide-react";
import {AuthSheet} from "@/components/auth/auth-sheet";
import {m} from "@/paraglide/messages";
import loadingGearUrl from "@/assets/loading-gear.svg";

interface GatewaySheetProps {
  open: boolean;
  onClose: () => void;
}

/** "Payment Gateway" sheet — stands in for the hosted gateway while the online payment processes. */
export function GatewaySheet({open, onClose}: GatewaySheetProps) {
  return (
    <AuthSheet open={open} onClose={onClose}>
      <div className="mt-2 flex h-[70dvh] w-full flex-col">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-[20px] font-medium leading-[1.2] text-foreground">{m["safe.gateway"]()}</h2>
          <button type="button" onClick={onClose} aria-label={m["loc.close"]()} className="flex size-8 items-center justify-center">
            <X className="size-[18px]" aria-hidden="true" />
          </button>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <img src={loadingGearUrl} alt="" aria-hidden="true" className="size-12 animate-spin" />
          <p className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["safe.processing"]()}</p>
        </div>
      </div>
    </AuthSheet>
  );
}
