import {Button, Dialog, DialogBackdrop, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {PaymentMethod} from "@/types/shipment-types";
import {MethodOptions} from "./method-options";

interface PaymentDialogProps {
  open: boolean;
  total: number;
  walletBalance: number;
  method: PaymentMethod | null;
  isPaying: boolean;
  errorMessage: string | null;
  onMethodChange: (method: PaymentMethod) => void;
  onPay: () => void;
  onClose: () => void;
}

/** Choose how to pay: wallet (with balance + insufficient-funds strip) or the online gateway. */
export function PaymentDialog({
  open,
  total,
  walletBalance,
  method,
  isPaying,
  errorMessage,
  onMethodChange,
  onPay,
  onClose,
}: PaymentDialogProps) {
  const insufficient = method === "wallet" && walletBalance < total;
  const payDisabled = method === null || insufficient || isPaying;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="flex w-[396px] flex-col gap-6 p-6">
          <div className="flex w-full flex-col gap-4">
            <DialogTitle className="text-sm tracking-[0.14px]">{m["pay.title"]()}</DialogTitle>
            <MethodOptions walletBalance={walletBalance} insufficient={insufficient} method={method} onMethodChange={onMethodChange} />
          </div>
          {errorMessage && (
            <p role="alert" className="w-full text-xs leading-[1.4] font-medium tracking-[0.12px] text-status-fail">
              {errorMessage}
            </p>
          )}
          <div className="flex w-full gap-3">
            <Button variant="outline" className="h-[50px] flex-1" onClick={onClose}>
              {m["pay.cancel"]()}
            </Button>
            <Button className="h-[50px] flex-1" disabled={payDisabled} isLoading={isPaying} onClick={onPay}>
              {isPaying ? m["pay.paying"]() : m["pay.pay"]()}
            </Button>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
