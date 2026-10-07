import {cn} from "cnfast";

/** The small PNG file-type badge on uploaded documents — a document shape with a teal strip. */
export function CourierPngBadge({className}: {className?: string}) {
  return (
    <span
      className={cn("relative inline-flex size-6 items-end justify-center rounded-sm border border-grey-200 bg-grey-100", className)}
      aria-hidden="true"
    >
      <span className="absolute top-0 right-0 size-1.5 rounded-tr-sm border-b border-l border-grey-200 bg-white" />
      <span className="w-full rounded-b-sm bg-primary-500 text-center text-[6px] leading-[10px] font-bold text-white">PNG</span>
    </span>
  );
}
