import {Check, X} from "lucide-react";
import {cn} from "cnfast";
import {AuthSheet} from "@/components/auth/auth-sheet";
import type {TimelineEvent} from "@/types/activity-types";
import {m} from "@/paraglide/messages";

/** "Delivery Timeline" sheet — a vertical check-line of delivery milestones. */
export function TimelineSheet({open, events, onClose}: {open: boolean; events: TimelineEvent[]; onClose: () => void}) {
  return (
    <AuthSheet open={open} onClose={onClose}>
      <div className="mt-2 flex w-full flex-col pb-4">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-[20px] font-medium leading-[1.2] text-foreground">{m["del.timeline_title"]()}</h2>
          <button type="button" onClick={onClose} aria-label={m["loc.close"]()} className="flex size-8 items-center justify-center">
            <X className="size-[18px]" aria-hidden="true" />
          </button>
        </div>
        <ol className="mt-4 flex w-full flex-col">
          {events.map((event, i) => (
            <TimelineRow key={`${event.label}-${event.time}`} event={event} last={i === events.length - 1} />
          ))}
        </ol>
      </div>
    </AuthSheet>
  );
}

function TimelineRow({event, last}: {event: TimelineEvent; last: boolean}) {
  return (
    <li className="flex w-full gap-3">
      <span className="flex w-6 flex-col items-center">
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-[4px]",
            event.done ? "bg-primary-500 text-white" : "bg-grey-300 text-white"
          )}
        >
          <Check className="size-4" strokeWidth={3} aria-hidden="true" />
        </span>
        {last ? null : <span aria-hidden="true" className="w-px flex-1 bg-grey-300" />}
      </span>
      <span className="flex flex-1 flex-col gap-0.5 pb-6">
        <span className={cn("text-[14px] font-medium leading-[1.4] tracking-[0.14px]", event.done ? "text-foreground" : "text-grey-500")}>
          {event.label}
        </span>
        {event.time ? <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{event.time}</span> : null}
        {event.sub ? <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{event.sub}</span> : null}
      </span>
    </li>
  );
}
