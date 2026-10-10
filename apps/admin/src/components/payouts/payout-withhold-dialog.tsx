import {useState} from "react";
import {Button, Dialog, DialogBackdrop, DialogClose, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {Lock} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {PayoutIssueType, WithholdPayoutInput} from "@/types/payouts-types";
import wlClose from "@/assets/wl-close.svg";
import {SelectShell} from "@/components/workloads/select-shell";
import {ISSUE_TYPE_LABELS} from "./payout-labels";

const FIELD_LABEL = "mb-1.5 block text-sm leading-[1.4] font-medium tracking-[0.14px] text-black";
const FIELD_INPUT = "h-10 w-full rounded-lg border border-grey-300 bg-white px-3 text-sm text-black outline-none focus:border-primary-500";
const TEXTAREA =
  "w-full resize-none rounded-lg border border-grey-300 bg-white px-3 py-2.5 text-sm text-black outline-none placeholder:text-grey-400 focus:border-primary-500";

interface PayoutWithholdDialogProps {
  courierId: string | null;
  cycle: string;
  issueTypes: PayoutIssueType[];
  submitting: boolean;
  failed: boolean;
  onClose: () => void;
  onSubmit: (courierId: string, input: WithholdPayoutInput) => void;
}

/** Withhold Payout dialog — parcel id, issue type, amount at risk, description. */
export function PayoutWithholdDialog({courierId, cycle, issueTypes, submitting, failed, onClose, onSubmit}: PayoutWithholdDialogProps) {
  const [form, setForm] = useState<WithholdFormValue>({parcelId: "", issueType: "", amount: "", description: ""});
  const amountValue = Number(form.amount.replaceAll(",", ""));
  const canSubmit =
    form.parcelId.trim() !== "" &&
    form.issueType !== "" &&
    Number.isFinite(amountValue) &&
    amountValue > 0 &&
    form.description.trim() !== "" &&
    !submitting;
  const submit = () =>
    courierId &&
    form.issueType !== "" &&
    onSubmit(courierId, {
      cycle,
      parcelId: form.parcelId.trim(),
      issueType: form.issueType,
      amountAtRisk: amountValue,
      description: form.description.trim(),
    });
  return (
    <Dialog open={courierId !== null} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[460px] max-w-[calc(100vw-32px)] p-6">
          <DialogHead courierId={courierId} />
          <WithholdForm value={form} issueTypes={issueTypes} onChange={setForm} />
          {failed && <p className="mt-3 text-sm text-status-fail">{m["payout.dialog_error"]()}</p>}
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" className="h-10 rounded-lg px-4" onClick={onClose} disabled={submitting}>
              {m["payout.cancel"]()}
            </Button>
            <Button
              className="h-10 rounded-lg bg-status-fail px-4 hover:bg-status-fail-dark"
              disabled={!canSubmit}
              isLoading={submitting}
              onClick={submit}
            >
              {submitting ? m["payout.withhold_confirming"]() : m["payout.withhold_confirm"]()}
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
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-status-fail-subtle text-status-fail">
        <Lock className="size-5" aria-hidden="true" />
      </span>
      <div className="flex-1">
        <DialogTitle className="text-lg leading-[1.3] font-medium text-black">{m["payout.withhold_title"]()}</DialogTitle>
        <p className="pt-1 text-sm text-grey-600">{courierId}</p>
      </div>
      <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["payout.close"]()}>
        <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
      </DialogClose>
    </div>
  );
}

interface WithholdFormValue {
  parcelId: string;
  issueType: PayoutIssueType | "";
  amount: string;
  description: string;
}

interface WithholdFormProps {
  value: WithholdFormValue;
  issueTypes: PayoutIssueType[];
  onChange: (value: WithholdFormValue) => void;
}

function WithholdForm({value, issueTypes, onChange}: WithholdFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className="block">
        <span className={FIELD_LABEL}>{m["payout.withhold_parcel_label"]()}</span>
        <input
          value={value.parcelId}
          onChange={(event) => onChange({...value, parcelId: event.target.value})}
          placeholder={m["payout.withhold_parcel_placeholder"]()}
          className={FIELD_INPUT}
        />
      </label>
      <IssueTypeSelect value={value.issueType} issueTypes={issueTypes} onChange={(issueType) => onChange({...value, issueType})} />
      <label className="block">
        <span className={FIELD_LABEL}>{m["payout.withhold_amount_label"]()}</span>
        <input
          value={value.amount}
          onChange={(event) => onChange({...value, amount: event.target.value.replace(/[^\d,]/g, "")})}
          inputMode="numeric"
          placeholder={m["payout.withhold_amount_placeholder"]()}
          className={FIELD_INPUT}
        />
      </label>
      <label className="block">
        <span className={FIELD_LABEL}>{m["payout.withhold_description_label"]()}</span>
        <textarea
          value={value.description}
          onChange={(event) => onChange({...value, description: event.target.value})}
          placeholder={m["payout.withhold_description_placeholder"]()}
          rows={3}
          className={TEXTAREA}
        />
      </label>
    </div>
  );
}

function IssueTypeSelect({
  value,
  issueTypes,
  onChange,
}: {
  value: PayoutIssueType | "";
  issueTypes: PayoutIssueType[];
  onChange: (v: PayoutIssueType | "") => void;
}) {
  return (
    <label className="block">
      <span className={FIELD_LABEL}>{m["payout.withhold_issue_label"]()}</span>
      <SelectShell
        value={value}
        onChange={(next) => onChange(next as PayoutIssueType | "")}
        wrapperClassName="w-full"
        aria-label={m["payout.withhold_issue_label"]()}
      >
        <option value="">{m["payout.withhold_issue_placeholder"]()}</option>
        {issueTypes.map((type) => (
          <option key={type} value={type}>
            {ISSUE_TYPE_LABELS[type]()}
          </option>
        ))}
      </SelectShell>
    </label>
  );
}
