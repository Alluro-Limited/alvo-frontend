import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {CourierMetrics} from "@/types/couriers-types";

const DOT_STYLES = {
  total: "bg-primary-500",
  active: "bg-success-500",
  onAssignment: "bg-accent-500",
  pendingVerify: "bg-warning-500",
  flagged: "bg-status-warning",
  suspended: "bg-status-fail",
} as const;

const LABELS = {
  total: m["couriers.metric_total"],
  active: m["couriers.metric_active"],
  onAssignment: m["couriers.metric_on_assignment"],
  pendingVerify: m["couriers.metric_pending_verify"],
  flagged: m["couriers.metric_flagged"],
  suspended: m["couriers.metric_suspended"],
} as const;

type CourierMetricKey = keyof typeof DOT_STYLES;

function MetricCard({metric, value}: {metric: CourierMetricKey; value: number}) {
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
export function CouriersMetrics({metrics}: {metrics: CourierMetrics}) {
  const keys = (Object.keys(metrics) as CourierMetricKey[]).filter((key) => key in DOT_STYLES);
  return (
    <div className="flex gap-2">
      {keys.map((metric) => (
        <MetricCard key={metric} metric={metric} value={metrics[metric] ?? 0} />
      ))}
    </div>
  );
}
