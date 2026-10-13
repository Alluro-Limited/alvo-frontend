import {Check} from "lucide-react";
import type {TimelineEntry} from "@/types/delivery-types";
import {m} from "@/paraglide/messages";

/** The "Status Timeline" card — checkboxes joined by a teal rail, newest status last. */
export function StatusTimeline({entries}: {entries: TimelineEntry[]}) {
  return (
    <section className="rounded-[14px] bg-grey-50 p-4">
      <h2 className="text-[15px] font-semibold">{m["job.timeline"]()}</h2>
      <ol className="mt-4">
        {entries.map((entry, i) => (
          <li key={`${entry.label}-${entry.at}`} className="relative flex gap-3 pb-5 last:pb-0">
            {i < entries.length - 1 && <span className="absolute left-2 top-5 bottom-0 w-0.5 bg-primary-200" aria-hidden="true" />}
            <span className="relative grid size-4 shrink-0 place-items-center rounded-[4px] bg-primary-500" aria-hidden="true">
              <Check className="size-3 text-white" strokeWidth={3} />
            </span>
            <div>
              <p className="text-[13px] font-semibold">{entry.label}</p>
              <p className="text-[12px] text-grey-500">{entry.at}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
