import {m} from "@/paraglide/messages";

/** Detail fetch failed — small retry affordance inside the popover. */
export function PopoverError({onRetry}: {onRetry: () => void}) {
  return (
    <div role="alert" className="flex flex-col items-center gap-2 p-4">
      <p className="text-xs text-grey-500">{m["overview.popover.load_error"]()}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg border border-primary-500 px-3 py-1.5 text-xs font-medium text-primary-500"
      >
        {m["overview.retry"]()}
      </button>
    </div>
  );
}
