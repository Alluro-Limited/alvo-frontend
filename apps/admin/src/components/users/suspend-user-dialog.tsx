import {useState} from "react";
import {Button, Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {SuspendReason} from "@/types/users-types";
import wlClose from "@/assets/wl-close.svg";
import usersModalSuspend from "@/assets/users-modal-suspend.svg";
import usersModalUnsuspend from "@/assets/users-modal-unsuspend.svg";
import {SelectShell} from "@/components/workloads/select-shell";
import {suspendReasonLabel} from "./user-labels";

export type SuspendIntent = "suspend" | "unsuspend";

interface SuspendUserDialogProps {
  open: boolean;
  intent: SuspendIntent;
  /** Backend-supplied reason options from the user detail payload. */
  reasons: SuspendReason[];
  submitting: boolean;
  /** The last attempt failed — shows an inline error and keeps the form open. */
  failed: boolean;
  onClose: () => void;
  onSubmit: (reason: SuspendReason | null, notes: string) => void;
}

const COPY: Record<SuspendIntent, {icon: string; title: () => string; description: () => string}> = {
  suspend: {icon: usersModalSuspend, title: m["users.suspend_title"], description: m["users.suspend_description"]},
  unsuspend: {icon: usersModalUnsuspend, title: m["users.unsuspend_title"], description: m["users.unsuspend_description"]},
};

/** Suspend/unsuspend confirmation modal — suspend requires a reason, unsuspend takes notes only. */
export function SuspendUserDialog({open, intent, reasons, submitting, failed, onClose, onSubmit}: SuspendUserDialogProps) {
  const [reason, setReason] = useState<SuspendReason | "">("");
  const [notes, setNotes] = useState("");
  const copy = COPY[intent];
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
              <img src={copy.icon} alt="" className="size-5" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <DialogTitle className="text-lg leading-[1.3] font-medium text-black">{copy.title()}</DialogTitle>
              <DialogDescription className="pt-3 text-base leading-[1.5] text-black">{copy.description()}</DialogDescription>
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
            onReason={(v) => setReason(v)}
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
  intent: SuspendIntent;
  reasons: SuspendReason[];
  reason: SuspendReason | "";
  notes: string;
  submitting: boolean;
  failed: boolean;
  canSubmit: boolean;
  onReason: (value: SuspendReason | "") => void;
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
    if (submitting) return suspending ? m["users.suspend_confirming"]() : m["users.unsuspend_confirming"]();
    return suspending ? m["users.suspend_confirm"]() : m["users.unsuspend_confirm"]();
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
        {m["users.suspend_audit"]()}
      </p>
      {failed && <p className="pt-3 text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["users.suspend_error"]()}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          {m["users.suspend_cancel"]()}
        </Button>
        <Button type="submit" variant={canSubmit ? (suspending ? "destructive" : "default") : "disabled"}>
          {confirmLabel()}
        </Button>
      </div>
    </form>
  );
}

function NotesField({notes, onNotes}: Pick<SuspendFormProps, "notes" | "onNotes">) {
  return (
    <>
      <label className="mt-4 block text-sm leading-[1.4] font-medium tracking-[0.14px] text-black" htmlFor="suspend-notes">
        {m["users.suspend_notes_label"]()}
      </label>
      <textarea
        id="suspend-notes"
        value={notes}
        onChange={(event) => onNotes(event.target.value)}
        placeholder={m["users.suspend_notes_placeholder"]()}
        rows={4}
        className="mt-2 w-full resize-none rounded-lg border-[0.75px] border-grey-300 px-4 py-3 text-sm leading-[1.4] tracking-[0.14px] text-grey-600 outline-none placeholder:text-grey-500 focus:border-primary-500"
      />
    </>
  );
}

function ReasonField({reasons, reason, onReason}: Pick<SuspendFormProps, "reasons" | "reason" | "onReason">) {
  return (
    <>
      <label className="block text-sm leading-[1.4] font-medium tracking-[0.14px] text-black" htmlFor="suspend-reason">
        {m["users.suspend_reason_label"]()}
      </label>
      <SelectShell id="suspend-reason" value={reason} onChange={(v) => onReason(v as SuspendReason | "")} wrapperClassName="mt-2">
        <option value="" disabled>
          {m["users.suspend_reason_placeholder"]()}
        </option>
        {reasons.map((value) => (
          <option key={value} value={value}>
            {suspendReasonLabel(value)}
          </option>
        ))}
      </SelectShell>
      <p className="pt-2 text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["users.suspend_reason_hint"]()}</p>
    </>
  );
}
