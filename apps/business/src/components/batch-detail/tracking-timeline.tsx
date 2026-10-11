import {Check} from "lucide-react";
import {cn} from "cnfast";
import type {TrackingEvent} from "@/types/batch-types";

function TimelineBox({done}: {done: boolean}) {
  return (
    <span className={cn("flex size-4 shrink-0 items-center justify-center rounded-[2px]", done ? "bg-primary-500" : "bg-grey-400")}>
      {done && <Check className="size-2 text-white" strokeWidth={3} aria-hidden="true" />}
    </span>
  );
}

/** The vertical "Tracking timeline": done events get teal boxes, pending ones grey. */
export function TrackingTimeline({events}: {events: TrackingEvent[]}) {
  return (
    <ol className="flex w-full flex-col">
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const nextDone = !isLast && events[index + 1].done;
        return (
          <li key={event.title} className="flex gap-3">
            <span className="flex flex-col items-center">
              <TimelineBox done={event.done} />
              {!isLast && <span className={cn("h-[50px] w-0.5", event.done && nextDone ? "bg-primary-500" : "bg-grey-300")} />}
            </span>
            <span className="flex flex-col">
              <span className={cn("text-sm leading-[1.4] font-medium tracking-[0.14px]", event.done ? "text-black" : "text-grey-600")}>
                {event.title}
              </span>
              <span className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{event.detail}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
