import type {ReactNode} from "react";
import {cn} from "cnfast";
import popoverCloseIcon from "@/assets/popover-close.svg";
import {m} from "@/paraglide/messages";

interface PopoverHeaderProps {
  /** Header tone — `bg-primary-500` for nodes, `bg-accent` for couriers. */
  className?: string;
  onClose: () => void;
  children: ReactNode;
}

/** Colored popover header strip: identity content on the left, white close control on the right. */
export function PopoverHeader({className, onClose, children}: PopoverHeaderProps) {
  return (
    <header className={cn("flex items-start justify-between gap-2 p-4", className)}>
      {children}
      <button type="button" onClick={onClose} aria-label={m["overview.popover.close"]()} className="p-0.5">
        <img src={popoverCloseIcon} alt="" className="size-4" />
      </button>
    </header>
  );
}
