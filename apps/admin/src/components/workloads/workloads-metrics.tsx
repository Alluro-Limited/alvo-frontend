import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {WorkloadMetrics} from "@/types/workloads-types";

const DOT_STYLES: Record<keyof WorkloadMetrics, string> = {
  ongoing: "bg-primary-500",
  pendingPickup: "bg-accent-500",
  expired: "bg-status-fail",
  slaAtRisk: "bg-warning-500",
  flagged: "bg-status-warning",
};

const LABELS: Record<keyof WorkloadMetrics, () => string> = {
  ongoing: m["workloads.metric_ongoing"],
  pendingPickup: m["workloads.metric_pending_pickup"],
  expired: m["workloads.metric_expired"],
  slaAtRisk: m["workloads.metric_sla_at_risk"],
  flagged: m["workloads.metric_flagged"],
};

function MetricCard({metric, value}: {metric: keyof WorkloadMetrics; value: number}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-clip rounded-lg border border-grey-300 bg-white p-4">
      <div
        className={cn(
          "size-6 shrink-0 rounded-full border-[1.5px] border-white shadow-[0_4px_8px_-2px_rgba(0,0,0,0.08),0_2px_4px_-2px_rgba(0,0,0,0.04)]",
          DOT_STYLES[metric]
        )}
      />
      <div className="flex flex-col gap-1">
        <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{LABELS[metric]()}</p>
        <p className="text-lg leading-[1.4] font-bold tracking-[0.18px] text-primary-800">{value}</p>
      </div>
    </div>
  );
}

/** The five count cards above the parcels table — driven entirely by the response payload. */
export function WorkloadsMetrics({metrics}: {metrics: WorkloadMetrics}) {
  return (
    <div className="flex gap-2">
      {(Object.keys(DOT_STYLES) as (keyof WorkloadMetrics)[]).map((metric) => (
        <MetricCard key={metric} metric={metric} value={metrics[metric]} />
      ))}
    </div>
  );
}
