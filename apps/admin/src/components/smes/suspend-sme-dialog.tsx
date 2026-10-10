import {useState} from "react";
import {Button, Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import smeModalLock from "@/assets/sme-modal-lock.svg";
import wlClose from "@/assets/wl-close.svg";
import {SelectShell} from "@/components/workloads/select-shell";
import type {SmeSuspendReason} from "@/types/smes-types";
import {smeSuspendReasonLabel} from "./sme-labels";

export type SmeSuspendIntent = "suspend" | "unsuspend";

interface SuspendSmeDialogProps {
  open: boolean;
  intent: SmeSuspendIntent;
  /** Business name interpolated into the description copy. */
  name: string;
  /** Backend-supplied reason options from the list payload. */
  reasons: SmeSuspendReason[];
  submitting: boolean;
  /** The last attempt failed — shows an inline error and keeps the form open. */
  failed: boolean;
  onClose: () => void;
  onSubmit: (reason: SmeSuspendReason | null, notes: string) => void;
}

/** Suspend/unsuspend confirmation modal — suspend requires a reason, unsuspend takes notes only. */
export function SuspendSmeDialog({open, intent, name, reasons, submitting, failed, onClose, onSubmit}: SuspendSmeDialogProps) {
  const [reason, setReason] = useState<SmeSuspendReason | "">("");
  const [notes, setNotes] = useState("");
  const suspending = intent === "suspend";
  const canSubmit = (suspending ? reason !== "" : true) && !submitting;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[500px] max-w-[calc(100vw-32px)] p-6">
          <div className="flex items-start gap-3">
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-full ${suspending ? "bg-status-fail-subtle" : "bg-status-success-subtle"}`}
            >
              <img src={smeModalLock} alt="" className="size-5" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <DialogTitle className="text-lg leading-[1.3] font-medium text-black">
                {suspending ? m["smes.suspend_title"]() : m["smes.unsuspend_title"]()}
              </DialogTitle>
              <DialogDescription className="pt-3 text-base leading-[1.5] text-black">
                {suspending ? m["smes.suspend_description"]({name}) : m["smes.unsuspend_description"]({name})}
              </DialogDescription>
            </div>
            <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["workloads.close"]()}>
              <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
            </DialogClose>
          </div>
          <SuspendForm
            intent={intent}
            reasons={reasons}
            reason={reason}
            notes={notes}
            submitting={submitting}
            failed={failed}
            canSubmit={canSubmit}
            onReason={setReason}
            onNotes={setNotes}
            onCancel={onClose}
            onSubmit={() => onSubmit(reason === "" ? null : reason, notes.trim())}
          />
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

interface SuspendFormProps {
  intent: SmeSuspendIntent;
  reasons: SmeSuspendReason[];
  reason: SmeSuspendReason | "";
  notes: string;
  submitting: boolean;
  failed: boolean;
  canSubmit: boolean;
  onReason: (value: SmeSuspendReason | "") => void;
  onNotes: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

function SuspendForm({
  intent,
  reasons,
  reason,
  notes,
  submitting,
  failed,
  canSubmit,
  onReason,
  onNotes,
  onCancel,
  onSubmit,
}: SuspendFormProps) {
  const suspending = intent === "suspend";
  const confirmLabel = () => {
    if (submitting) return suspending ? m["smes.suspend_confirming"]() : m["smes.unsuspend_confirming"]();
    return suspending ? m["smes.suspend_confirm"]() : m["smes.unsuspend_confirm"]();
  };
  return (
    <form
      noValidate
      className="pt-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (canSubmit) onSubmit();
      }}
    >
      {suspending && <ReasonField reasons={reasons} reason={reason} onReason={onReason} />}
      <NotesField notes={notes} onNotes={onNotes} />
      <p className="mt-4 rounded-lg bg-grey-100 px-4 py-3 text-sm leading-[1.4] tracking-[0.14px] text-grey-600">
        {m["smes.suspend_audit"]()}
      </p>
      {failed && <p className="pt-3 text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["smes.suspend_error"]()}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          {m["smes.suspend_cancel"]()}
        </Button>
        <Button type="submit" variant={canSubmit ? (suspending ? "destructive" : "default") : "disabled"}>
          {confirmLabel()}
        </Button>
      </div>
    </form>
  );
}

function ReasonField({reasons, reason, onReason}: Pick<SuspendFormProps, "reasons" | "reason" | "onReason">) {
  return (
    <>
      <label className="block text-sm leading-[1.4] font-medium tracking-[0.14px] text-black" htmlFor="sme-suspend-reason">
        {m["smes.suspend_reason_label"]()}
      </label>
      <SelectShell id="sme-suspend-reason" value={reason} onChange={(v) => onReason(v as SmeSuspendReason | "")} wrapperClassName="mt-2">
        <option value="" disabled>
          {m["smes.suspend_reason_placeholder"]()}
        </option>
        {reasons.map((value) => (
          <option key={value} value={value}>
            {smeSuspendReasonLabel(value)}
          </option>
        ))}
      </SelectShell>
    </>
  );
}

function NotesField({notes, onNotes}: Pick<SuspendFormProps, "notes" | "onNotes">) {
  return (
    <>
      <label className="mt-4 block text-sm leading-[1.4] font-medium tracking-[0.14px] text-black" htmlFor="sme-suspend-notes">
        {m["smes.suspend_notes_label"]()}
      </label>
      <textarea
        id="sme-suspend-notes"
        value={notes}
        onChange={(event) => onNotes(event.target.value)}
        placeholder={m["smes.suspend_notes_placeholder"]()}
        rows={4}
        className="mt-2 w-full resize-none rounded-lg border-[0.75px] border-grey-300 px-4 py-3 text-sm leading-[1.4] tracking-[0.14px] text-grey-600 outline-none placeholder:text-grey-500 focus:border-primary-500"
      />
    </>
  );
}
