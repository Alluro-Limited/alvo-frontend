import {OctagonAlert} from "lucide-react";
import {m} from "@/paraglide/messages";

/** Full-page error state for a failed fetch, with a retry that re-runs the query. */
export function PageError({onRetry, isRetrying}: {onRetry: () => void; isRetrying: boolean}) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-[14px] bg-status-fail-subtle">
        <OctagonAlert className="size-6 text-status-fail" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-[18px] font-bold">{m["errors.load_title"]()}</p>
        <p className="text-[14px] leading-[22px] text-black/60">{m["errors.load_desc"]()}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="h-[44px] rounded-[8px] bg-primary-500 px-6 text-[15px] font-medium text-white disabled:opacity-60"
      >
        {isRetrying ? m["errors.retrying"]() : m["errors.retry"]()}
      </button>
    </div>
  );
}
