import {useState} from "react";
import {Button, Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {UserX} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {CourierDeleteReason} from "@/types/couriers-types";
import wlClose from "@/assets/wl-close.svg";
import {SelectShell} from "@/components/workloads/select-shell";
import {deleteReasonLabel} from "./courier-labels";

interface DeleteCourierDialogProps {
  open: boolean;
  /** Courier name interpolated into the description copy. */
  name: string;
  /** Backend-supplied reason options from the list payload. */
  reasons: CourierDeleteReason[];
  submitting: boolean;
  /** The last attempt failed — shows an inline error and keeps the form open. */
  failed: boolean;
  onClose: () => void;
  onConfirm: (reason: CourierDeleteReason) => void;
}

/** Permanent-delete confirmation — a reason select plus the "Before proceeding" warning list. */
export function DeleteCourierDialog({open, name, reasons, submitting, failed, onClose, onConfirm}: DeleteCourierDialogProps) {
  const [reason, setReason] = useState<CourierDeleteReason | "">("");
  const canSubmit = reason !== "" && !submitting;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[500px] max-w-[calc(100vw-32px)] p-6">
          <Header name={name} />
          <form
            noValidate
            className="pt-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (canSubmit) onConfirm(reason);
            }}
          >
            <ReasonField reason={reason} reasons={reasons} onChange={setReason} />
            <WarningList />
            <p className="mt-4 rounded-lg bg-grey-100 px-4 py-3 text-sm leading-[1.4] tracking-[0.14px] text-grey-600">
              {m["couriers.delete_audit"]()}
            </p>
            {failed && <p className="pt-3 text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["couriers.delete_error"]()}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                {m["couriers.delete_cancel"]()}
              </Button>
              <Button type="submit" variant={canSubmit ? "destructive" : "disabled"}>
                {submitting ? m["couriers.delete_confirming"]() : m["couriers.delete_confirm"]()}
              </Button>
            </div>
          </form>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

/** The required reason select — submit stays disabled until one is chosen. */
function ReasonField({
  reason,
  reasons,
  onChange,
}: {
  reason: CourierDeleteReason | "";
  reasons: CourierDeleteReason[];
  onChange: (v: CourierDeleteReason | "") => void;
}) {
  return (
    <>
      <label className="block text-sm leading-[1.4] font-medium tracking-[0.14px] text-black" htmlFor="courier-delete-reason">
        {m["couriers.delete_reason_label"]()}
      </label>
      <SelectShell
        id="courier-delete-reason"
        value={reason}
        onChange={(v) => onChange(v as CourierDeleteReason | "")}
        wrapperClassName="mt-2"
      >
        <option value="" disabled>
          {m["couriers.delete_reason_placeholder"]()}
        </option>
        {reasons.map((value) => (
          <option key={value} value={value}>
            {deleteReasonLabel(value)}
          </option>
        ))}
      </SelectShell>
    </>
  );
}

function Header({name}: {name: string}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-status-fail-subtle text-status-fail">
        <UserX className="size-5" aria-hidden="true" />
      </span>
      <div className="flex-1">
        <DialogTitle className="text-lg leading-[1.3] font-medium text-black">{m["couriers.delete_title"]()}</DialogTitle>
        <DialogDescription className="pt-3 text-base leading-[1.5] text-black">
          {m["couriers.delete_description"]({name})}
        </DialogDescription>
      </div>
      <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["workloads.close"]()}>
        <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
      </DialogClose>
    </div>
  );
}

/** The "Before proceeding" warning block listing the deletion consequences. */
function WarningList() {
  return (
    <div className="mt-4 rounded-lg bg-status-fail-subtle px-4 py-3">
      <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-status-fail-dark">{m["couriers.delete_warning_title"]()}</p>
      <ul className="list-inside list-disc pt-1 text-sm leading-[1.6] tracking-[0.14px] text-status-fail">
        <li>{m["couriers.delete_warning_1"]()}</li>
        <li>{m["couriers.delete_warning_2"]()}</li>
        <li>{m["couriers.delete_warning_3"]()}</li>
        <li>{m["couriers.delete_warning_4"]()}</li>
      </ul>
    </div>
  );
}
