interface UsageProgressProps {
  /** "Compartment capacity" or "Today's deliveries". */
  title: string;
  used: number;
  total: number;
  /** Rendered as "{count} slots free" / "{count} remaining" from the free count. */
  freeLabel: (count: number) => string;
  /** Rendered as "{pct}% full" / "{pct}% done" from the usage percent. */
  pctLabel: (pct: number) => string;
}

/** Popover usage block: title + "used / total", green fill bar, free count + percent. */
export function UsageProgress({title, used, total, freeLabel, pctLabel}: UsageProgressProps) {
  const percent = total > 0 ? Math.round((used / total) * 100) : 0;
  const free = Math.max(0, total - used);
  return (
    <div className="flex w-full flex-col gap-1.5 border-b-[0.5px] border-grey-300 pb-3">
      <div className="flex w-full items-center justify-between">
        <p className="text-[10px] leading-[1.4] font-medium tracking-[0.1px] text-grey-500">{title}</p>
        <p className="text-[10px] leading-[1.4] text-grey-600">
          <span className="text-sm font-medium tracking-[0.14px] text-black">{used}</span>
          {` / ${total}`}
        </p>
      </div>
      <div className="h-1 w-full overflow-clip rounded-xl bg-[#ececec]">
        <div className="h-full rounded-xl bg-status-success transition-[width] duration-500" style={{width: `${percent}%`}} />
      </div>
      <div className="flex w-full items-center justify-between text-[10px] leading-[1.4] font-medium tracking-[0.1px]">
        <span className="text-grey-600">{freeLabel(free)}</span>
        <span className="text-grey-500">{pctLabel(percent)}</span>
      </div>
    </div>
  );
}
