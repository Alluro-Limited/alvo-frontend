import {useEffect} from "react";
import {Dialog, DialogBackdrop, DialogPopup, DialogPortal} from "@alvo/ui";
import {m} from "@/paraglide/messages";

const GATEWAY_SIMULATION_MS = 1500;

interface GatewayDialogProps {
  open: boolean;
  onComplete: () => void;
}

/**
 * Stand-in for the hosted checkout: the design shows a blank "Online payment gateway"
 * surface, so the mock completes the payment automatically after a short delay.
 */
export function GatewayDialog({open, onComplete}: GatewayDialogProps) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onComplete, GATEWAY_SIMULATION_MS);
    return () => clearTimeout(timer);
  }, [open, onComplete]);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="flex w-[396px] flex-col p-6">
          <div className="flex h-[348px] w-full items-center justify-center">
            <p className="text-[10px] leading-[1.4] tracking-[0.1px] text-black opacity-50">{m["pay.gateway_caption"]()}</p>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
