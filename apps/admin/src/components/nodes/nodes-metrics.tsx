import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {NodeMetricKey, NodeMetrics} from "@/types/nodes-types";

const DOT_STYLES: Record<NodeMetricKey, string> = {
  total: "bg-primary-500",
  online: "bg-status-success",
  offline: "bg-status-fail",
  warning: "bg-status-warning",
  maintenance: "bg-warning-500",
  fullCapacity: "bg-accent-500",
};

const LABELS: Record<NodeMetricKey, () => string> = {
  total: m["nodes.metric_total"],
  online: m["nodes.metric_online"],
  offline: m["nodes.metric_offline"],
  warning: m["nodes.metric_warning"],
  maintenance: m["nodes.metric_maintenance"],
  fullCapacity: m["nodes.metric_full_capacity"],
};

/** Count cards above the list — renders whatever metric keys the response carries, in payload order. */
export function NodesMetrics({metrics}: {metrics: NodeMetrics}) {
  const keys = (Object.keys(metrics) as NodeMetricKey[]).filter((key) => key in DOT_STYLES);
  return (
    <div className="flex gap-2">
      {keys.map((metric) => (
        <div key={metric} className="flex min-w-0 flex-1 flex-col gap-6 overflow-clip rounded-lg border border-grey-300 bg-white p-4">
          <div
            className={cn(
              "size-6 shrink-0 rounded-full border-[1.5px] border-white shadow-[0_4px_8px_-2px_rgba(0,0,0,0.08),0_2px_4px_-2px_rgba(0,0,0,0.04)]",
              DOT_STYLES[metric]
            )}
          />
          <div className="flex flex-col gap-1">
            <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{LABELS[metric]()}</p>
            <p className="text-lg leading-[1.4] font-bold tracking-[0.18px] text-primary-800">{metrics[metric] ?? 0}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
