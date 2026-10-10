import {m} from "@/paraglide/messages";
import {formatCompactNaira, formatCount, formatUptime} from "@/lib/format-revenue";
import {useNodeRevenueQuery} from "@/queries/use-revenue-queries";
import type {NodeRevenueMetrics} from "@/types/revenue-types";
import revAvgIcon from "@/assets/rev-avg.svg";
import revLostIcon from "@/assets/rev-lost.svg";
import revTopIcon from "@/assets/rev-top.svg";
import revUptimeIcon from "@/assets/rev-uptime.svg";
import {RevenueErrorCard} from "./revenue-error-card";
import {RevenueKpiCard} from "./revenue-kpi-card";
import {NodesTableCard} from "./revenue-nodes-table";

const UPTIME_THRESHOLD = 96;

/** The four node KPI cards — top card shows "Nil" when nothing has processed revenue. */
function NodeKpis({metrics}: {metrics: NodeRevenueMetrics}) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4" data-testid="node-kpi-grid">
      <RevenueKpiCard
        title={m["revenue.node_total"]()}
        value={formatCompactNaira(metrics.totalRevenue)}
        sub={m["revenue.node_total_sub"]({count: formatCount(metrics.activeNodes)})}
        icon={revTopIcon}
      />
      <RevenueKpiCard
        title={m["revenue.node_top"]()}
        value={metrics.topNode?.name ?? m["revenue.node_nil"]()}
        money={false}
        sub={
          metrics.topNode === null
            ? "—"
            : m["revenue.node_top_sub"]({
                revenue: formatCompactNaira(metrics.topNode.revenue),
                parcels: formatCount(metrics.topNode.parcels),
              })
        }
        icon={revLostIcon}
      />
      <RevenueKpiCard
        title={m["revenue.node_avg"]()}
        value={formatCompactNaira(metrics.avgRevenue)}
        sub={m["revenue.node_avg_sub"]({count: formatCount(metrics.avgParcels)})}
        icon={revAvgIcon}
      />
      <RevenueKpiCard
        title={m["revenue.node_uptime"]()}
        value={formatUptime(metrics.avgUptime)}
        money={false}
        sub={m["revenue.node_uptime_sub"]({count: formatCount(metrics.belowUptime), threshold: UPTIME_THRESHOLD})}
        icon={revUptimeIcon}
      />
    </div>
  );
}

interface RevenueNodesTabProps {
  page: number;
  onPage: (page: number) => void;
}

/** Revenue by Node tab — four KPI cards over the ranked, paginated node table. */
export function RevenueNodesTab({page, onPage}: RevenueNodesTabProps) {
  const {data, isPending, isError, refetch} = useNodeRevenueQuery(page);
  if (isError) return <RevenueErrorCard onRetry={() => void refetch()} />;
  if (isPending || data === undefined) {
    return (
      <div className="flex flex-col gap-4" data-testid="nodes-skeleton">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {Array.from({length: 4}, (_, i) => (
            <div key={`kpi-${i}`} className="h-[118px] animate-pulse rounded-xl border border-grey-300 bg-white" />
          ))}
        </div>
        <div className="h-[420px] animate-pulse rounded-xl border border-grey-300 bg-white" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <NodeKpis metrics={data.metrics} />
      <NodesTableCard nodes={data.nodes} totals={data.totals} onPage={onPage} />
    </div>
  );
}
