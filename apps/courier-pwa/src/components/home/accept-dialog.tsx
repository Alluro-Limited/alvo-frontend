import {useState} from "react";
import {Checkbox, Dialog, DialogBackdrop, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {m} from "@/paraglide/messages";

interface AcceptDialogProps {
  open: boolean;
  pending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * The "Confirm job acceptance" gate: Accept job stays disabled until the courier ticks
 * the responsibility checkbox. Body remounts per open, so the checkbox always resets.
 */
export function AcceptDialog({open, pending, onConfirm, onClose}: AcceptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[calc(100%-48px)] max-w-[342px] p-6">
          {open && <AcceptDialogBody pending={pending} onConfirm={onConfirm} onClose={onClose} />}
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

function AcceptDialogBody({pending, onConfirm, onClose}: Omit<AcceptDialogProps, "open">) {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <DialogTitle className="text-[24px] font-bold tracking-[-0.01em]">{m["home.confirm_title"]()}</DialogTitle>
      <p className="mt-3 text-[14px] leading-[22px] text-grey-600">{m["home.confirm_desc"]()}</p>
      <div className="mt-5 flex items-center gap-3">
        <Checkbox
          checked={checked}
          onCheckedChange={(c) => setChecked(c === true)}
          aria-label={m["home.confirm_check"]()}
          className="size-5"
        />
        <span className="text-[14px] font-medium">{m["home.confirm_check"]()}</span>
      </div>
      <button
        type="button"
        onClick={onConfirm}
        disabled={!checked || pending}
        className="mt-6 h-[50px] w-full rounded-[10px] bg-primary-500 text-[16px] font-semibold text-white disabled:bg-grey-300 disabled:text-grey-500"
      >
        {m["home.confirm_accept"]()}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="mt-3 h-[50px] w-full rounded-[10px] bg-grey-100 text-[16px] font-semibold text-foreground"
      >
        {m["home.cancel"]()}
      </button>
    </>
  );
}
