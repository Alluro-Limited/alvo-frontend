import type {ReactNode} from "react";
import {Dialog, DialogBackdrop, DialogPopup, DialogPortal} from "@alvo/ui";
import {cn} from "cnfast";

/** The right slide-over shell both item drawers share — backdrop, Escape handling, width control. */
export function DrawerShell({
  open,
  onClose,
  wide,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  wide?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup
          className={cn(
            "top-0 right-0 left-auto flex h-full translate-x-0 -translate-y-0 flex-col overflow-hidden rounded-none bg-grey-100 transition-[width]",
            wide ? "w-[1000px] max-w-[calc(100vw-48px)]" : "w-[480px] max-w-full",
            className
          )}
        >
          {children}
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
