import type {ReactNode} from "react";
import {ChevronRight} from "lucide-react";
import type {LucideIcon} from "lucide-react";

interface AccountRowProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  /** Extra content between the label and the chevron (e.g. the wallet amount). */
  trailing?: ReactNode;
}

/** A list row inside an account section card — tinted icon chip, label, chevron. */
export function AccountRow({icon: Icon, label, onClick, trailing}: AccountRowProps) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-[#e9fafb] text-primary-500">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-1 items-center gap-1 text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">
        <span className="truncate">{label}</span>
        {trailing}
      </span>
      <ChevronRight className="size-5 shrink-0 text-grey-500" aria-hidden="true" />
    </button>
  );
}
