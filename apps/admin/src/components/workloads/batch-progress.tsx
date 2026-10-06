import {m} from "@/paraglide/messages";

/** "N of M parcels delivered · P%" label above a teal progress bar — shared by card and detail header. */
export function BatchProgress({delivered, total, width}: {delivered: number; total: number; width: string}) {
  const progress = total === 0 ? 0 : Math.round((delivered / total) * 100);
  return (
    <div className={`flex flex-col items-end gap-1.5 ${width}`}>
      <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-600">
        {m["workloads.batch_parcels_progress"]({delivered, total})} · {progress}%
      </p>
      <div
        className="h-2 w-full overflow-clip rounded-full bg-grey-200"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-primary-500 transition-[width] duration-500" style={{width: `${progress}%`}} />
      </div>
    </div>
  );
}
