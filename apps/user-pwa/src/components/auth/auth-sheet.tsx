import type {ReactNode} from "react";
import {Dialog, DialogBackdrop, DialogPopup, DialogPortal} from "@alvo/ui";

interface AuthSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

/** Bottom sheet used by the auth flows: drag handle, rounded top, safe-area padding. */
export function AuthSheet({open, onClose, children}: AuthSheetProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="top-auto bottom-0 left-0 w-full max-w-none translate-x-0 translate-y-0 rounded-t-[32px] rounded-b-none px-6 pt-3 pb-[max(24px,env(safe-area-inset-bottom))]">
          <div className="mx-auto h-[7px] w-14 rounded-full bg-grey-300" aria-hidden="true" />
          {children}
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
