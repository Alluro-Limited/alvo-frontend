import {m} from "@/paraglide/messages";
import {TimelineStepItem} from "@/components/workloads/timeline-step-item";
import {formatTimelineAt} from "@/components/workloads/workloads-format";
import type {AssignmentTimelineStep} from "@/types/assignment-types";

/** The assignment lifecycle timeline — backend supplies ordered steps with done flags. */
export function AssignmentTimeline({steps}: {steps: AssignmentTimelineStep[]}) {
  return (
    <section className="rounded-lg bg-white p-4">
      <h2 className="pb-3 text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["assignment.timeline_title"]()}</h2>
      <ol>
        {steps.map((step, index) => (
          <TimelineStepItem
            key={step.label}
            label={step.label}
            detail={step.detail ?? (step.at ? formatTimelineAt(step.at) : "-")}
            done={step.done}
            last={index === steps.length - 1}
          />
        ))}
      </ol>
    </section>
  );
}
