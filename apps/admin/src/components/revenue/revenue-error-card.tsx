import {m} from "@/paraglide/messages";

/** Inline error strip for any revenue section — matches the other consoles' retry treatment. */
export function RevenueErrorCard({onRetry}: {onRetry: () => void}) {
  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-4 rounded-xl border border-grey-300 bg-white px-4 py-6"
      data-testid="revenue-error"
    >
      <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{m["revenue.error_title"]()}</p>
      <button
        type="button"
        onClick={onRetry}
        className="h-9 rounded-md border border-primary-500 px-4 text-sm font-medium text-primary-500"
      >
        {m["revenue.retry"]()}
      </button>
    </div>
  );
}
