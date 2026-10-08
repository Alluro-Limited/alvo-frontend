import {LogOut} from "lucide-react";
import {Button, Dialog, DialogBackdrop, DialogDescription, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {m} from "@/paraglide/messages";

interface SignOutDialogProps {
  open: boolean;
  submitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/** The "Sign out of Alvo?" confirmation — icon, copy, Cancel / Signout. */
export function SignOutDialog({open, submitting, onClose, onConfirm}: SignOutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[400px] max-w-[calc(100vw-32px)] p-6">
          <div className="flex size-11 items-center justify-center rounded-full bg-status-fail-subtle text-status-fail">
            <LogOut className="size-5" aria-hidden="true" />
          </div>
          <DialogTitle className="pt-4 text-xl leading-[1.3] font-semibold text-black">{m["profile.signout_title"]()}</DialogTitle>
          <DialogDescription className="pt-2 text-sm leading-[1.4] tracking-[0.14px] text-grey-600">
            {m["profile.signout_description"]()}
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={submitting}>
              {m["profile.signout_cancel"]()}
            </Button>
            <Button variant="destructive" isLoading={submitting} onClick={onConfirm}>
              {m["profile.signout_confirm"]()}
            </Button>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
