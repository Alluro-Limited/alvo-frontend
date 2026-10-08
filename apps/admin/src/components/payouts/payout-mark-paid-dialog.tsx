import {useState} from "react";
import {Button, Dialog, DialogBackdrop, DialogClose, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {Check} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {MarkPaidInput, PayoutDetail, PayoutPaymentMethod} from "@/types/payouts-types";
import wlClose from "@/assets/wl-close.svg";
import {CourierAvatar} from "@/components/couriers/courier-avatar";
import {formatNairaAmount} from "@/lib/format";
import {PayoutPaymentFields, type PayoutPaymentFieldsValue} from "./payout-payment-fields";

interface PayoutMarkPaidDialogProps {
  detail: PayoutDetail | null;
  cycle: string;
  paymentMethods: PayoutPaymentMethod[];
  submitting: boolean;
  failed: boolean;
  onClose: () => void;
  onSubmit: (input: MarkPaidInput) => void;
}

/** Single-courier Mark-as-Paid dialog — courier card over the shared payment fields. */
export function PayoutMarkPaidDialog({detail, cycle, paymentMethods, submitting, failed, onClose, onSubmit}: PayoutMarkPaidDialogProps) {
  const [fields, setFields] = useState<PayoutPaymentFieldsValue>({
    method: paymentMethods[0] ?? "bank_transfer",
    date: todayIso(),
    remarks: "",
  });
  const canSubmit = fields.date !== "" && !submitting;
  return (
    <Dialog open={detail !== null} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[460px] max-w-[calc(100vw-32px)] p-6">
          <DialogHead />
          {detail && <CourierCard detail={detail} />}
          <PayoutPaymentFields value={fields} paymentMethods={paymentMethods} onChange={setFields} />
          {failed && <p className="mt-3 text-sm text-status-fail">{m["payout.dialog_error"]()}</p>}
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" className="h-10 rounded-lg px-4" onClick={onClose} disabled={submitting}>
              {m["payout.cancel"]()}
            </Button>
            <Button
              className="h-10 gap-1.5 rounded-lg px-4"
              disabled={!canSubmit}
              isLoading={submitting}
              onClick={() =>
                detail &&
                onSubmit({
                  cycle,
                  courierIds: [detail.courierId],
                  paymentMethod: fields.method,
                  paymentDate: fields.date,
                  remarks: fields.remarks.trim() || undefined,
                })
              }
            >
              <Check className="size-4" aria-hidden="true" />
              {submitting ? m["payout.mark_paid_confirming"]() : m["payout.mark_paid_confirm"]()}
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
      <DialogTitle className="text-lg leading-[1.3] font-medium text-black">{m["payout.mark_paid_title"]()}</DialogTitle>
      <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["payout.close"]()}>
        <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
      </DialogClose>
    </div>
  );
}

/** The courier + bank + owed-amount card the dialog tops the form with. */
function CourierCard({detail}: {detail: PayoutDetail}) {
  return (
    <div className="mb-5 flex items-center gap-3 rounded-xl border border-grey-300 p-4">
      <CourierAvatar id={detail.courierId} name={detail.name} photoUrl={detail.photoUrl} size="size-10" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{detail.name}</p>
        <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">
          {m["payout.bank_line"]({bank: detail.bank.bankName, account: detail.bank.accountNumber})}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm leading-[1.4] font-bold tracking-[0.14px] text-primary-800">{`₦${formatNairaAmount(detail.netPayout)}`}</p>
        <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">
          {m["payout.deliveries_count"]({count: detail.deliveriesCompleted})}
        </p>
      </div>
    </div>
  );
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
