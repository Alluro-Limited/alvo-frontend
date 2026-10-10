import {useState} from "react";
import {Button, Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import wlClose from "@/assets/wl-close.svg";
import usersMenuDelete from "@/assets/users-menu-delete.svg";

interface DeleteUserDialogProps {
  open: boolean;
  /** The account holder's name — the confirmation field must match it. */
  name: string;
  submitting: boolean;
  /** The last attempt failed — shows an inline error and keeps the form open. */
  failed: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/** Permanent-delete confirmation — the admin types the user's name to unlock the destructive CTA. */
export function DeleteUserDialog({open, name, submitting, failed, onClose, onConfirm}: DeleteUserDialogProps) {
  const [confirmation, setConfirmation] = useState("");
  const confirmed = confirmation.trim().toLowerCase() === name.trim().toLowerCase();
  const canSubmit = confirmed && !submitting;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[500px] max-w-[calc(100vw-32px)] p-6">
          <Header name={name} />
          <WarningList />
          <form
            noValidate
            className="pt-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (canSubmit) onConfirm();
            }}
          >
            <label className="block text-sm leading-[1.4] font-medium tracking-[0.14px] text-black" htmlFor="delete-confirm">
              {m["users.delete_confirm_label"]({name})}
            </label>
            <input
              id="delete-confirm"
              type="text"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder={m["users.delete_confirm_placeholder"]({name})}
              autoComplete="off"
              className="mt-2 h-10 w-full rounded-lg border-[0.75px] border-grey-300 bg-white px-4 text-sm leading-[1.4] tracking-[0.14px] text-grey-600 outline-none placeholder:text-grey-500 focus:border-primary-500"
            />
            {failed && <p className="pt-3 text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["users.delete_error"]()}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                {m["users.delete_cancel"]()}
              </Button>
              <Button type="submit" variant={canSubmit ? "destructive" : "disabled"}>
                {submitting ? m["users.delete_confirming"]() : m["users.delete_confirm"]()}
              </Button>
            </div>
          </form>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

function Header({name}: {name: string}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-status-fail-subtle">
        <img src={usersMenuDelete} alt="" className="size-5" aria-hidden="true" />
      </span>
      <div className="flex-1">
        <DialogTitle className="text-lg leading-[1.3] font-medium text-black">{m["users.delete_title"]()}</DialogTitle>
        <DialogDescription className="pt-3 text-base leading-[1.5] text-black">{m["users.delete_description"]({name})}</DialogDescription>
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
    <div className="mt-5 rounded-lg bg-status-fail-subtle px-4 py-3">
      <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-status-fail-dark">{m["users.delete_warning_title"]()}</p>
      <ul className="list-inside list-disc pt-1 text-sm leading-[1.6] tracking-[0.14px] text-status-fail">
        <li>{m["users.delete_warning_1"]()}</li>
        <li>{m["users.delete_warning_2"]()}</li>
        <li>{m["users.delete_warning_3"]()}</li>
      </ul>
    </div>
  );
}
