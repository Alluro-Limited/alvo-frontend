import {cn} from "cnfast";
import nodeWifiIcon from "@/assets/node-wifi.svg";
import {formatRelativeTime} from "@/lib/format";
import {m} from "@/paraglide/messages";
import {useNodeDetailQuery} from "@/queries/use-node-detail-query";
import type {OverviewMapNode} from "@/types/dashboard-types";
import {DetailRow} from "./detail-row";
import {PopoverError} from "./popover-error";
import {PopoverHeader} from "./popover-header";
import {PopoverSkeleton} from "./popover-skeleton";
import {StatusPill} from "./status-pill";
import {UsageProgress} from "./usage-progress";

const DOT_TONE: Record<OverviewMapNode["status"], string> = {
  online: "bg-status-success",
  warning: "bg-status-warning",
  offline: "bg-grey-400",
};

/** Node detail card behind a marker click — teal header, capacity bar, health rows, network. */
export function NodePopover({id, onClose}: {id: string; onClose: () => void}) {
  const detail = useNodeDetailQuery(id);
  if (detail.isPending) return <PopoverSkeleton />;
  if (detail.isError || !detail.data) return <PopoverError onRetry={() => void detail.refetch()} />;
  const node = detail.data;

  return (
    <>
      <PopoverHeader className="bg-primary-500" onClose={onClose}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className={cn("size-3 rounded-full", DOT_TONE[node.status])} />
            <p className="text-base leading-[1.4] font-medium text-white">{node.id}</p>
            <StatusPill status={node.status} />
          </div>
          <p className="text-xs leading-[1.4] text-white">{node.location}</p>
        </div>
      </PopoverHeader>
      <div className="flex flex-col gap-3 p-4">
        <UsageProgress
          title={m["overview.node.capacity"]()}
          used={node.capacityUsed}
          total={node.capacityTotal}
          freeLabel={(count) => m["overview.node.slots_free"]({count})}
          pctLabel={(pct) => m["overview.node.pct_full"]({pct})}
        />
        <div className="flex flex-col gap-2 border-b-[0.5px] border-grey-300 pb-3">
          <DetailRow label={m["overview.node.partner_host"]()}>
            <span className="text-primary-800">{node.partnerHost}</span>
          </DetailRow>
          <DetailRow label={m["overview.node.last_heartbeat"]()}>
            <span className="text-status-success">{formatRelativeTime(node.lastHeartbeatAt)}</span>
          </DetailRow>
          <DetailRow label={m["overview.node.uptime_today"]()}>
            <span className="text-status-success">{node.uptimePct}%</span>
          </DetailRow>
          <DetailRow label={m["overview.node.parcels_processed"]()}>
            <span className="text-primary-800">{m["overview.node.parcels_today"]({count: node.parcelsToday})}</span>
          </DetailRow>
        </div>
        <div className="flex items-center gap-1.5">
          <img src={nodeWifiIcon} alt="" className="size-4" />
          <span className="text-xs leading-[1.4] font-medium tracking-[0.12px] text-status-success">{node.network}</span>
        </div>
      </div>
    </>
  );
}
