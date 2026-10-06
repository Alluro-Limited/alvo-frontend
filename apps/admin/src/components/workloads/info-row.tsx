import type {ReactNode} from "react";

/** A label/value row inside the drawer's info card. */
export function InfoRow({label, children}: {label: string; children: ReactNode}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-grey-200 py-3 last:border-b-0">
      <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{label}</p>
      <div className="text-right text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{children}</div>
    </div>
  );
}
