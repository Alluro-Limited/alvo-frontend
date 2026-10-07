import {useState} from "react";
import {Button, Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import usersMenuDelete from "@/assets/users-menu-delete.svg";
import wlClose from "@/assets/wl-close.svg";
import {SelectShell} from "@/components/workloads/select-shell";
import type {SmeDeactivateReason} from "@/types/smes-types";
import {smeDeactivateReasonLabel} from "./sme-labels";

interface DeactivateSmeDialogProps {
  open: boolean;
  /** Backend-supplied reason options from the list payload. */
  reasons: SmeDeactivateReason[];
  submitting: boolean;
  /** The last attempt failed — shows an inline error and keeps the form open. */
  failed: boolean;
  onClose: () => void;
  onSubmit: (reason: SmeDeactivateReason) => void;
}

/** Permanent-deactivation confirmation modal — requires a reason before the destructive button unlocks. */
export function DeactivateSmeDialog({open, reasons, submitting, failed, onClose, onSubmit}: DeactivateSmeDialogProps) {
  const [reason, setReason] = useState<SmeDeactivateReason | "">("");
  const canSubmit = reason !== "" && !submitting;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[500px] max-w-[calc(100vw-32px)] p-6">
          <div className="flex items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-status-fail-subtle">
              <img src={usersMenuDelete} alt="" className="size-5" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <DialogTitle className="text-lg leading-[1.3] font-medium text-black">{m["smes.deactivate_title"]()}</DialogTitle>
              <DialogDescription className="pt-3 text-base leading-[1.5] text-black">
                {m["smes.deactivate_description"]()}
              </DialogDescription>
            </div>
            <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["workloads.close"]()}>
              <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
            </DialogClose>
          </div>
          <DeactivateForm
            reasons={reasons}
            reason={reason}
            submitting={submitting}
            failed={failed}
            canSubmit={canSubmit}
            onReason={setReason}
            onCancel={onClose}
            onSubmit={() => canSubmit && onSubmit(reason)}
          />
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

interface DeactivateFormProps {
  reasons: SmeDeactivateReason[];
  reason: SmeDeactivateReason | "";
  submitting: boolean;
  failed: boolean;
  canSubmit: boolean;
  onReason: (value: SmeDeactivateReason | "") => void;
  onCancel: () => void;
  onSubmit: () => void;
}

function DeactivateForm({reasons, reason, submitting, failed, canSubmit, onReason, onCancel, onSubmit}: DeactivateFormProps) {
  return (
    <form
      noValidate
      className="pt-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (canSubmit) onSubmit();
      }}
    >
      <label className="block text-sm leading-[1.4] font-medium tracking-[0.14px] text-black" htmlFor="sme-deactivate-reason">
        {m["smes.deactivate_reason_label"]()}
      </label>
      <SelectShell
        id="sme-deactivate-reason"
        value={reason}
        onChange={(v) => onReason(v as SmeDeactivateReason | "")}
        wrapperClassName="mt-2"
      >
        <option value="" disabled>
          {m["smes.deactivate_reason_placeholder"]()}
        </option>
        {reasons.map((value) => (
          <option key={value} value={value}>
            {smeDeactivateReasonLabel(value)}
          </option>
        ))}
      </SelectShell>
      {failed && <p className="pt-3 text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["smes.deactivate_error"]()}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          {m["smes.deactivate_cancel"]()}
        </Button>
        <Button type="submit" variant={canSubmit ? "destructive" : "disabled"}>
          {submitting ? m["smes.deactivate_confirming"]() : m["smes.deactivate_confirm"]()}
        </Button>
      </div>
    </form>
  );
}
