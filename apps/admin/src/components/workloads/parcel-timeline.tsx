import {m} from "@/paraglide/messages";
import type {ParcelRoute, ParcelTimelineStep, TimelineStepKey} from "@/types/workloads-types";
import timelineCheck from "@/assets/timeline-check.svg";
import timelinePending from "@/assets/timeline-pending.svg";
import {formatOrdinal, formatTimelineAt} from "./workloads-format";

const STEP_LABELS: Record<TimelineStepKey, () => string> = {
  created: m["workloads.timeline_created"],
  dropped_at_node: m["workloads.timeline_dropped_at_node"],
  picked_up: m["workloads.timeline_picked_up"],
  delivered: m["workloads.timeline_delivered"],
  collected: m["workloads.timeline_collected"],
};

function TimelineStep({step, last}: {step: ParcelTimelineStep; last: boolean}) {
  const done = Boolean(step.at);
  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center">
        <img src={done ? timelineCheck : timelinePending} alt="" className="size-4 shrink-0" aria-hidden="true" />
        {!last && <span className="w-0.5 flex-1 bg-grey-200" aria-hidden="true" />}
      </div>
      <div className="pb-4">
        <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{STEP_LABELS[step.key]()}</p>
        <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">
          {step.at ? [step.actor, formatTimelineAt(step.at)].filter(Boolean).join(" · ") : m["workloads.timeline_pending"]()}
        </p>
      </div>
    </li>
  );
}

function routeTitle(route: ParcelRoute, index: number, count: number) {
  if (route.label) return route.label;
  if (count === 1) return m["workloads.timeline_title"]();
  return m["workloads.route_timeline_numbered"]({ordinal: formatOrdinal(index + 1)});
}

/** Vertical lifecycle timelines inside the parcel drawer — one section per route leg. */
export function ParcelTimeline({routes}: {routes: ParcelRoute[]}) {
  return (
    <>
      {routes.map((route, index) => {
        const title = routeTitle(route, index, routes.length);
        return (
          <section key={title} className="rounded-lg bg-white p-4" aria-label={title}>
            <h3 className="pb-3 text-sm leading-[1.4] font-semibold tracking-[0.14px] text-black">{title}</h3>
            <ol>
              {route.steps.map((step, stepIndex) => (
                <TimelineStep key={step.key} step={step} last={stepIndex === route.steps.length - 1} />
              ))}
            </ol>
          </section>
        );
      })}
    </>
  );
}
