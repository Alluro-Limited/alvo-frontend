import {useState} from "react";
import {Button, Dialog, DialogBackdrop, DialogClose, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {Flag} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {FlagPayoutInput, PayoutDisputeReason} from "@/types/payouts-types";
import wlClose from "@/assets/wl-close.svg";
import {SelectShell} from "@/components/workloads/select-shell";
import {DISPUTE_REASON_LABELS} from "./payout-labels";

interface PayoutFlagDialogProps {
  courierId: string | null;
  cycle: string;
  reasons: PayoutDisputeReason[];
  submitting: boolean;
  failed: boolean;
  onClose: () => void;
  onSubmit: (courierId: string, input: FlagPayoutInput) => void;
}

/** Flag-for-review dialog — dispute reason select plus a free-text details field. */
export function PayoutFlagDialog({courierId, cycle, reasons, submitting, failed, onClose, onSubmit}: PayoutFlagDialogProps) {
  const [reason, setReason] = useState<PayoutDisputeReason | "">("");
  const [details, setDetails] = useState("");
  const canSubmit = reason !== "" && details.trim() !== "" && !submitting;
  const submit = () => courierId && reason !== "" && onSubmit(courierId, {cycle, disputeReason: reason, details: details.trim()});
  return (
    <Dialog open={courierId !== null} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[460px] max-w-[calc(100vw-32px)] p-6">
          <DialogHead courierId={courierId} />
          <FlagForm reason={reason} details={details} reasons={reasons} onReason={setReason} onDetails={setDetails} />
          {failed && <p className="mt-3 text-sm text-status-fail">{m["payout.dialog_error"]()}</p>}
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" className="h-10 rounded-lg px-4" onClick={onClose} disabled={submitting}>
              {m["payout.cancel"]()}
            </Button>
            <Button className="h-10 rounded-lg px-4" disabled={!canSubmit} isLoading={submitting} onClick={submit}>
              {submitting ? m["payout.flag_confirming"]() : m["payout.flag_confirm"]()}
            </Button>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

function DialogHead({courierId}: {courierId: string | null}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-status-warning-subtle text-status-warning-dark">
        <Flag className="size-5" aria-hidden="true" />
      </span>
      <div className="flex-1">
        <DialogTitle className="text-lg leading-[1.3] font-medium text-black">{m["payout.flag_title"]()}</DialogTitle>
        <p className="pt-1 text-sm text-grey-600">{courierId}</p>
      </div>
      <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["payout.close"]()}>
        <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
      </DialogClose>
    </div>
  );
}

interface FlagFormProps {
  reason: PayoutDisputeReason | "";
  details: string;
  reasons: PayoutDisputeReason[];
  onReason: (v: PayoutDisputeReason | "") => void;
  onDetails: (v: string) => void;
}

const FIELD_LABEL = "mb-1.5 block text-sm leading-[1.4] font-medium tracking-[0.14px] text-black";

function FlagForm({reason, details, reasons, onReason, onDetails}: FlagFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className="block">
        <span className={FIELD_LABEL}>{m["payout.flag_reason_label"]()}</span>
        <SelectShell
          value={reason}
          onChange={(next) => onReason(next as PayoutDisputeReason | "")}
          wrapperClassName="w-full"
          aria-label={m["payout.flag_reason_label"]()}
        >
          <option value="">{m["payout.flag_reason_placeholder"]()}</option>
          {reasons.map((value) => (
            <option key={value} value={value}>
              {DISPUTE_REASON_LABELS[value]()}
            </option>
          ))}
        </SelectShell>
      </label>
      <label className="block">
        <span className={FIELD_LABEL}>{m["payout.flag_details_label"]()}</span>
        <textarea
          value={details}
          onChange={(event) => onDetails(event.target.value)}
          placeholder={m["payout.flag_details_placeholder"]()}
          rows={4}
          className="w-full resize-none rounded-lg border border-grey-300 bg-white px-3 py-2.5 text-sm text-black outline-none placeholder:text-grey-400 focus:border-primary-500"
        />
      </label>
    </div>
  );
}
