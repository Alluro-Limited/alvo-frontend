import type {ReactNode} from "react";

/** One label/value row inside a marker popover's detail list. */
export function DetailRow({label, children}: {label: string; children: ReactNode}) {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{label}</p>
      <div className="text-xs leading-[1.4] font-medium tracking-[0.12px]">{children}</div>
    </div>
  );
}
