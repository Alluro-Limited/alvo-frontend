import {m} from "@/paraglide/messages";

/** The progress card — percentage bar plus the ETA line, only while a courier is en route. */
export function AssignmentProgressCard({progress, etaMin}: {progress: number; etaMin: number | null}) {
  return (
    <div className="rounded-lg bg-white p-4">
      <div className="flex items-center justify-between pb-2">
        <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{m["assignment.progress"]()}</p>
        <p className="text-sm leading-[1.4] font-semibold tracking-[0.14px] text-black">{progress}%</p>
      </div>
      <div
        className="h-1.5 overflow-clip rounded-full bg-grey-200"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-primary-500" style={{width: `${progress}%`}} />
      </div>
      {etaMin !== null && (
        <p className="pt-2 text-xs leading-[1.4] tracking-[0.12px] text-grey-600">{m["assignment.eta_line"]({minutes: etaMin})}</p>
      )}
    </div>
  );
}
