import type {ReactNode} from "react";

/** One titled group inside a summary panel (e.g. "Parcel sizes" or "Est. cost"). */
export function SummaryBlock({title, children}: {title?: string; children: ReactNode}) {
  return (
    <div className="flex w-full flex-col">
      {title && <p className="pb-2 text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{title}</p>}
      <div className="flex w-full flex-col divide-y divide-grey-300">{children}</div>
    </div>
  );
}

export function SummaryRow({label, value}: {label: string; value: string}) {
  return (
    <div className="grid grid-cols-2 py-1.5">
      <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{label}</p>
      <p className="text-right text-xs leading-[1.4] font-medium tracking-[0.12px] text-black">{value}</p>
    </div>
  );
}
