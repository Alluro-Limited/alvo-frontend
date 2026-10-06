import {m} from "@/paraglide/messages";
import type {SafeStepKey, SafeTimelineStep} from "@/types/workloads-types";
import {TimelineStepItem} from "./timeline-step-item";

const STEP_LABELS: Record<SafeStepKey, () => string> = {
  book_safe: m["workloads.safe_timeline_book_safe"],
  item_stored: m["workloads.safe_timeline_item_stored"],
  storage_active: m["workloads.safe_timeline_storage_active"],
  expired: m["workloads.safe_timeline_expired"],
  period_extended: m["workloads.safe_timeline_period_extended"],
  expires: m["workloads.safe_timeline_expires"],
  retrieved: m["workloads.safe_timeline_retrieved"],
};

/** The Safe storage lifecycle card — steps come from the backend payload, extensions included. */
export function SafeTimeline({steps}: {steps: SafeTimelineStep[]}) {
  return (
    <section className="rounded-lg bg-white p-4">
      <p className="mb-2 text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["workloads.timeline_title"]()}</p>
      <ol>
        {steps.map((step, index) => (
          <TimelineStepItem
            key={step.key}
            label={STEP_LABELS[step.key]()}
            detail={step.detail}
            done={step.done}
            last={index === steps.length - 1}
          />
        ))}
      </ol>
    </section>
  );
}
