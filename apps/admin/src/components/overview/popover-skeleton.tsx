import {m} from "@/paraglide/messages";

/** Placeholder rows while a marker's detail fetch is in flight. */
export function PopoverSkeleton() {
  return (
    <div role="status" aria-label={m["overview.loading"]()} className="animate-pulse">
      <div className="h-16 bg-grey-200" />
      <div className="flex flex-col gap-3 p-4">
        {Array.from({length: 4}, (_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="h-3 w-20 rounded bg-grey-200" />
            <div className="h-3 w-12 rounded bg-grey-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
