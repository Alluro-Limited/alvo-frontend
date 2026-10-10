import {m} from "@/paraglide/messages";
import type {AssignmentMetrics as Metrics} from "@/types/assignment-types";

const CARDS: {key: keyof Metrics; dot: string; label: () => string}[] = [
  {key: "active", dot: "bg-primary-500", label: m["assignment.metric_active"]},
  {key: "pendingPickup", dot: "bg-accent-500", label: m["assignment.metric_pending_pickup"]},
  {key: "completed", dot: "bg-status-success", label: m["assignment.metric_completed"]},
  {key: "publicPool", dot: "bg-status-delayed", label: m["assignment.metric_public_pool"]},
  {key: "failed", dot: "bg-status-fail", label: m["assignment.metric_failed"]},
  {key: "flagged", dot: "bg-status-warning", label: m["assignment.metric_flagged"]},
];

/** The six status-dot metric cards above the assignments table. */
export function AssignmentMetrics({metrics}: {metrics: Metrics}) {
  return (
    <div className="grid grid-cols-6 gap-3">
      {CARDS.map((card) => (
        <div key={card.key} className="flex flex-col gap-2 rounded-lg bg-white p-4">
          <span className={`size-4 rounded-full ${card.dot}`} aria-hidden="true" />
          <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{card.label()}</p>
          <p className="text-xl leading-[1.3] font-semibold text-black">{metrics[card.key]}</p>
        </div>
      ))}
    </div>
  );
}
