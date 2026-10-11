import type {ReactNode} from "react";
import {cn} from "cnfast";

interface StatCardProps {
  label: string;
  icon: string;
  /** Tinted background behind the 20px icon. */
  iconBg: string;
  value: ReactNode;
  sub: string;
}

/** One metric tile: label + tinted icon on top, 28px value and grey description below. */
export function StatCard({label, icon, iconBg, value, sub}: StatCardProps) {
  return (
    <div className="flex flex-col items-start rounded-xl border border-grey-200 bg-white p-6">
      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex w-full items-center justify-center gap-2.5">
          <p className="min-w-px flex-1 text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{label}</p>
          <div className={cn("flex items-center rounded p-1", iconBg)}>
            <img src={icon} alt="" aria-hidden="true" className="size-5" />
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-1 text-black">
          <p className="w-full text-[28px] leading-[1.2] font-medium tracking-[-0.28px]">{value}</p>
          <p className="w-full text-xs leading-[1.4] tracking-[0.12px] opacity-70">{sub}</p>
        </div>
      </div>
    </div>
  );
}
