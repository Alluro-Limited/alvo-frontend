import {useState} from "react";
import {Button, Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {UserCheck, UserLock} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {CourierSuspendReason} from "@/types/couriers-types";
import wlClose from "@/assets/wl-close.svg";
import {SelectShell} from "@/components/workloads/select-shell";
import {suspendReasonLabel} from "./courier-labels";

export type SuspendIntent = "suspend" | "unsuspend";

interface SuspendCourierDialogProps {
  open: boolean;
  intent: SuspendIntent;
  /** Courier name interpolated into the description copy. */
  name: string;
  /** Backend-supplied reason options from the list payload. */
  reasons: CourierSuspendReason[];
  submitting: boolean;
  /** The last attempt failed — shows an inline error and keeps the form open. */
  failed: boolean;
  onClose: () => void;
  onSubmit: (reason: CourierSuspendReason | null, notes: string) => void;
}

/** Suspend/unsuspend confirmation modal — suspend requires a reason, unsuspend takes notes only. */
export function SuspendCourierDialog({open, intent, name, reasons, submitting, failed, onClose, onSubmit}: SuspendCourierDialogProps) {
  const [reason, setReason] = useState<CourierSuspendReason | "">("");
  const [notes, setNotes] = useState("");
  const suspending = intent === "suspend";
  const canSubmit = (suspending ? reason !== "" : true) && !submitting;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[500px] max-w-[calc(100vw-32px)] p-6">
          <DialogHeader intent={intent} name={name} />
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

function DialogHeader({intent, name}: {intent: SuspendIntent; name: string}) {
  const suspending = intent === "suspend";
  const Icon = suspending ? UserLock : UserCheck;
  return (
    <div className="flex items-start gap-3">
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${suspending ? "bg-status-fail-subtle text-status-fail" : "bg-status-success-subtle text-status-success-dark"}`}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="flex-1">
        <DialogTitle className="text-lg leading-[1.3] font-medium text-black">
          {suspending ? m["couriers.suspend_title"]() : m["couriers.unsuspend_title"]()}
        </DialogTitle>
        <DialogDescription className="pt-3 text-base leading-[1.5] text-black">
          {suspending ? m["couriers.suspend_description"]({name}) : m["couriers.unsuspend_description"]({name})}
        </DialogDescription>
      </div>
      <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["workloads.close"]()}>
        <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
      </DialogClose>
    </div>
  );
}

interface SuspendFormProps {
  intent: SuspendIntent;
  reasons: CourierSuspendReason[];
  reason: CourierSuspendReason | "";
  notes: string;
  submitting: boolean;
  failed: boolean;
  canSubmit: boolean;
  onReason: (value: CourierSuspendReason | "") => void;
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
    if (submitting) return suspending ? m["couriers.suspend_confirming"]() : m["couriers.unsuspend_confirming"]();
    return suspending ? m["couriers.suspend_confirm"]() : m["couriers.unsuspend_confirm"]();
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
        {m["couriers.suspend_audit"]()}
      </p>
      {failed && <p className="pt-3 text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["couriers.suspend_error"]()}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          {m["couriers.suspend_cancel"]()}
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
      <label className="mt-4 block text-sm leading-[1.4] font-medium tracking-[0.14px] text-black" htmlFor="courier-suspend-notes">
        {m["couriers.suspend_notes_label"]()}
      </label>
      <textarea
        id="courier-suspend-notes"
        value={notes}
        onChange={(event) => onNotes(event.target.value)}
        placeholder={m["couriers.suspend_notes_placeholder"]()}
        rows={4}
        className="mt-2 w-full resize-none rounded-lg border-[0.75px] border-grey-300 px-4 py-3 text-sm leading-[1.4] tracking-[0.14px] text-grey-600 outline-none placeholder:text-grey-500 focus:border-primary-500"
      />
    </>
  );
}

function ReasonField({reasons, reason, onReason}: Pick<SuspendFormProps, "reasons" | "reason" | "onReason">) {
  return (
    <>
      <label className="block text-sm leading-[1.4] font-medium tracking-[0.14px] text-black" htmlFor="courier-suspend-reason">
        {m["couriers.suspend_reason_label"]()}
      </label>
      <SelectShell
        id="courier-suspend-reason"
        value={reason}
        onChange={(v) => onReason(v as CourierSuspendReason | "")}
        wrapperClassName="mt-2"
      >
        <option value="" disabled>
          {m["couriers.suspend_reason_placeholder"]()}
        </option>
        {reasons.map((value) => (
          <option key={value} value={value}>
            {suspendReasonLabel(value)}
          </option>
        ))}
      </SelectShell>
    </>
  );
}
