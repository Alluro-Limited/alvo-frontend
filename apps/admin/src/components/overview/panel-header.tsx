import type {ReactNode} from "react";
import {cn} from "cnfast";

interface PanelHeaderProps {
  title: string;
  /** Optional trailing control (filter tabs, "View all", badge). */
  children?: ReactNode;
  className?: string;
}

/** The 52px header strip shared by every dashboard panel. */
export function PanelHeader({title, children, className}: PanelHeaderProps) {
  return (
    <div className={cn("flex h-[52px] shrink-0 items-center justify-between gap-4 border-b border-grey-300 px-3", className)}>
      <h2 className="text-base leading-[1.4] font-semibold tracking-[0.16px] text-[#070d17]">{title}</h2>
      {children}
    </div>
  );
}
