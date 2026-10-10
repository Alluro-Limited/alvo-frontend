import {useState} from "react";
import {Button, Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {MarkPaidInput, PayoutPaymentMethod, PayoutRow} from "@/types/payouts-types";
import wlClose from "@/assets/wl-close.svg";
import {formatNairaAmount} from "@/lib/format";
import {PayoutPaymentFields, type PayoutPaymentFieldsValue} from "./payout-payment-fields";

interface PayoutBatchDialogProps {
  rows: PayoutRow[];
  cycle: string;
  paymentMethods: PayoutPaymentMethod[];
  submitting: boolean;
  failed: boolean;
  onClose: () => void;
  onSubmit: (input: MarkPaidInput) => void;
}

/** Batch Mark-as-Paid dialog — the selected-courier summary over the shared payment fields. */
export function PayoutBatchDialog({rows, cycle, paymentMethods, submitting, failed, onClose, onSubmit}: PayoutBatchDialogProps) {
  const [fields, setFields] = useState<PayoutPaymentFieldsValue>({
    method: paymentMethods[0] ?? "bank_transfer",
    date: todayIso(),
    remarks: "",
  });
  const canSubmit = rows.length > 0 && fields.date !== "" && !submitting;
  return (
    <Dialog open={rows.length > 0} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[460px] max-w-[calc(100vw-32px)] p-6">
          <DialogHead />
          <BatchSummary rows={rows} />
          <PayoutPaymentFields value={fields} paymentMethods={paymentMethods} onChange={setFields} />
          {failed && <p className="mt-3 text-sm text-status-fail">{m["payout.dialog_error"]()}</p>}
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" className="h-10 rounded-lg px-4" onClick={onClose} disabled={submitting}>
              {m["payout.cancel"]()}
            </Button>
            <Button
              className="h-10 rounded-lg px-4"
              disabled={!canSubmit}
              isLoading={submitting}
              onClick={() =>
                onSubmit({
                  cycle,
                  courierIds: rows.map((row) => row.courierId),
                  paymentMethod: fields.method,
                  paymentDate: fields.date,
                  remarks: fields.remarks.trim() || undefined,
                })
              }
            >
              {submitting ? m["payout.batch_confirming"]() : m["payout.batch_confirm"]({count: rows.length})}
            </Button>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

function DialogHead() {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <DialogTitle className="text-lg leading-[1.3] font-medium text-black">{m["payout.batch_title"]()}</DialogTitle>
        <DialogDescription className="pt-1 text-sm text-grey-600">{m["payout.batch_subtitle"]()}</DialogDescription>
      </div>
      <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["payout.close"]()}>
        <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
      </DialogClose>
    </div>
  );
}

/** The aggregate strip — "N couriers · M deliveries" left, "₦X in total" right. */
function BatchSummary({rows}: {rows: PayoutRow[]}) {
  const totalDeliveries = rows.reduce((sum, row) => sum + row.deliveries, 0);
  const totalPayout = rows.reduce((sum, row) => sum + row.netPayout, 0);
  return (
    <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-grey-300 bg-grey-100 p-4">
      <div className="flex items-center gap-4 text-sm text-black">
        <span>
          <strong>{rows.length}</strong> {m["payout.batch_couriers"]()}
        </span>
        <span>
          <strong>{totalDeliveries}</strong> {m["payout.batch_deliveries"]()}
        </span>
      </div>
      <p className="text-sm leading-[1.4] text-black">
        <strong className="text-primary-800">{`₦${formatNairaAmount(totalPayout)}`}</strong> {m["payout.batch_total"]()}
      </p>
    </div>
  );
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
