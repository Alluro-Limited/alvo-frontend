import {ChevronRight} from "lucide-react";
import type {LucideIcon} from "lucide-react";

interface NavRowProps {
  icon: LucideIcon;
  label: string;
  /** Rendered as an anchor when set — external destinations like mailto or social links. */
  href?: string;
  onClick?: () => void;
  last?: boolean;
}

const rowClass = "flex w-full items-center gap-3 py-4 text-left";
const iconClass = "size-5 shrink-0 text-foreground";
const labelClass = "min-w-0 flex-1 truncate text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground";

/** The plain icon + label + chevron rows on the Get Help and Legal pages. */
export function NavRow({icon: Icon, label, href, onClick, last}: NavRowProps) {
  const border = last ? "" : "border-b-[0.5px] border-grey-300";
  if (href) {
    return (
      <a href={href} className={`${rowClass} ${border}`}>
        <Icon className={iconClass} aria-hidden="true" />
        <span className={labelClass}>{label}</span>
        <ChevronRight className="size-5 shrink-0 text-grey-500" aria-hidden="true" />
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={`${rowClass} ${border}`}>
      <Icon className={iconClass} aria-hidden="true" />
      <span className={labelClass}>{label}</span>
      <ChevronRight className="size-5 shrink-0 text-grey-500" aria-hidden="true" />
    </button>
  );
}
