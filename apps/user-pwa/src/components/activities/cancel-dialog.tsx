import {LoaderCircle, Trash2} from "lucide-react";
import {Dialog, DialogBackdrop, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {useCancelShipment} from "@/queries/use-activity-queries";
import {m} from "@/paraglide/messages";

interface CancelDialogProps {
  deliveryId: string;
  onClose: () => void;
  /** Fired once the shipment has been cancelled — the page swaps in the cancelled screen. */
  onCancelled: () => void;
}

/** Centered "Cancel Shipment?" confirmation — stops the shipment and refunds the payment to the wallet. */
export function CancelDialog({deliveryId, onClose, onCancelled}: CancelDialogProps) {
  const cancel = useCancelShipment(deliveryId);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[342px] rounded-[26px] p-6">
          <div className="flex w-full flex-col items-center gap-6">
            <span className="flex size-[52px] items-center justify-center rounded-full bg-status-fail-subtle">
              <Trash2 className="size-6 text-status-fail" aria-hidden="true" />
            </span>
            <div className="flex w-full flex-col gap-2 text-center">
              <DialogTitle className="text-[20px] font-bold leading-[1.2] text-foreground">{m["cxl.title"]()}</DialogTitle>
              <p className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["cxl.desc"]()}</p>
            </div>
            <div className="flex w-full flex-col gap-3">
              <button
                type="button"
                disabled={cancel.isPending}
                onClick={() => cancel.mutate(undefined, {onSuccess: onCancelled})}
                className="flex h-[50px] w-full items-center justify-center gap-2 rounded-[12px] bg-status-fail text-[16px] font-medium leading-[1.4] text-white disabled:opacity-70"
              >
                {cancel.isPending ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : null}
                {m["cxl.confirm"]()}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex h-[50px] w-full items-center justify-center rounded-[12px] bg-[#f2f2f2] text-[16px] font-medium leading-[1.4] text-foreground"
              >
                {m["cxl.keep"]()}
              </button>
            </div>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
