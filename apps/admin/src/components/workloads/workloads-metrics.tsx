import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {WorkloadMetricKey, WorkloadMetrics} from "@/types/workloads-types";

const DOT_STYLES: Record<WorkloadMetricKey, string> = {
  ongoing: "bg-primary-500",
  active: "bg-primary-500",
  pendingPickup: "bg-accent-500",
  queued: "bg-warning-500",
  total: "bg-grey-600",
  delivered: "bg-success-500",
  inTransit: "bg-secondary-500",
  expired: "bg-status-fail",
  expiredParcel: "bg-status-fail",
  slaAtRisk: "bg-warning-500",
  slaBreaches: "bg-warning-500",
  flagged: "bg-status-warning",
};

const LABELS: Record<WorkloadMetricKey, () => string> = {
  ongoing: m["workloads.metric_ongoing"],
  active: m["workloads.metric_active"],
  pendingPickup: m["workloads.metric_pending_pickup"],
  queued: m["workloads.metric_queued"],
  total: m["workloads.metric_total"],
  delivered: m["workloads.metric_delivered"],
  inTransit: m["workloads.metric_in_transit"],
  expired: m["workloads.metric_expired"],
  expiredParcel: m["workloads.metric_expired_parcel"],
  slaAtRisk: m["workloads.metric_sla_at_risk"],
  slaBreaches: m["workloads.metric_sla_breaches"],
  flagged: m["workloads.metric_flagged"],
};

function MetricCard({metric, value}: {metric: WorkloadMetricKey; value: number}) {
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

/** Count cards above the list — renders whatever metric keys the response carries, in payload order. */
export function WorkloadsMetrics({metrics}: {metrics: WorkloadMetrics}) {
  const keys = (Object.keys(metrics) as WorkloadMetricKey[]).filter((key) => key in DOT_STYLES);
  return (
    <div className="flex gap-2">
      {keys.map((metric) => (
        <MetricCard key={metric} metric={metric} value={metrics[metric] ?? 0} />
      ))}
    </div>
  );
}
