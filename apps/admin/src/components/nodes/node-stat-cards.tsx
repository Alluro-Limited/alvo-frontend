import {Activity, Boxes, MapPin, Wifi} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {NodeConnectivity, NodeDetail} from "@/types/nodes-types";
import {formatHeartbeat} from "./nodes-format";

const CONNECTIVITY_LABEL: Record<NodeConnectivity, () => string> = {
  "4g_lte": m["nodes.network_4g_lte"],
  "3g": m["nodes.network_3g"],
  unstable: m["nodes.network_unstable"],
  no_signal: m["nodes.network_no_signal"],
};

function StatCard({icon, label, value, accent}: {icon: React.ReactNode; label: string; value: string; accent?: boolean}) {
  return (
    <div className="flex flex-1 flex-col gap-3 rounded-lg border border-grey-200 bg-white p-4">
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-lg",
          accent ? "bg-primary-50 text-primary-500" : "bg-grey-100 text-grey-600"
        )}
      >
        {icon}
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{label}</p>
        <p className="text-base leading-[1.4] font-semibold tracking-[0.16px] text-black">{value}</p>
      </div>
    </div>
  );
}

/** The four stat cards under the summary — heartbeat, network, pickup occupancy, region. */
export function NodeStatCards({node, now}: {node: NodeDetail; now?: number}) {
  return (
    <div className="flex gap-2">
      <StatCard
        icon={<Activity className="size-4" aria-hidden="true" />}
        label={m["nodes.stat_last_heartbeat"]()}
        value={formatHeartbeat(node.lastHeartbeatAt, now)}
        accent
      />
      <StatCard
        icon={<Wifi className="size-4" aria-hidden="true" />}
        label={m["nodes.stat_network"]()}
        value={CONNECTIVITY_LABEL[node.connectivity]()}
      />
      <StatCard
        icon={<Boxes className="size-4" aria-hidden="true" />}
        label={m["nodes.stat_pickup_occupancy"]()}
        value={m["nodes.occupancy_slots"]({used: node.pickupOccupancy.used, total: node.pickupOccupancy.total})}
      />
      <StatCard icon={<MapPin className="size-4" aria-hidden="true" />} label={m["nodes.stat_region"]()} value={node.region} />
    </div>
  );
}
