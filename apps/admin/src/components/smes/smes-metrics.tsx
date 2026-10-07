import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {SmeMetrics} from "@/types/smes-types";

const DOT_STYLES = {
  total: "bg-primary-500",
  verified: "bg-success-500",
  suspended: "bg-status-fail",
  flagged: "bg-status-warning",
  newToday: "bg-secondary-500",
} as const;

const LABELS = {
  total: m["smes.metric_total"],
  verified: m["smes.metric_verified"],
  suspended: m["smes.metric_suspended"],
  flagged: m["smes.metric_flagged"],
  newToday: m["smes.metric_new_today"],
} as const;

type SmeMetricKey = keyof typeof DOT_STYLES;

function MetricCard({metric, value}: {metric: SmeMetricKey; value: number}) {
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
export function SmesMetrics({metrics}: {metrics: SmeMetrics}) {
  const keys = (Object.keys(metrics) as SmeMetricKey[]).filter((key) => key in DOT_STYLES);
  return (
    <div className="flex gap-2">
      {keys.map((metric) => (
        <MetricCard key={metric} metric={metric} value={metrics[metric] ?? 0} />
      ))}
    </div>
  );
}
