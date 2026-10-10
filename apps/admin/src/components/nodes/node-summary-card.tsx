import {Building2, MapPin} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {NodeDetail} from "@/types/nodes-types";
import {NodeStatusTag} from "./node-status-tag";
import {formatInstalled} from "./nodes-format";

const META = "flex items-center gap-1.5 text-sm leading-[1.4] tracking-[0.14px] text-grey-600";

/** The full-width node identity card — name, status pill, partner/address/installed meta, uptime tile. */
export function NodeSummaryCard({node}: {node: NodeDetail}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-grey-200 bg-white p-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl leading-[1.4] font-medium tracking-[0.2px] text-black">{node.name}</h1>
          <NodeStatusTag status={node.status} />
        </div>
        <div className="flex items-center gap-5">
          <span className={META}>
            <Building2 className="size-4 text-grey-500" aria-hidden="true" />
            {node.partner}
          </span>
          <span className={META}>
            <MapPin className="size-4 text-grey-500" aria-hidden="true" />
            {node.address}
          </span>
          <span className={META}>{m["nodes.installed"]({date: formatInstalled(node.installedAt)})}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{m["nodes.uptime_today"]()}</p>
        <p className="text-2xl leading-[1.3] font-bold text-primary-500">{node.uptimeToday}%</p>
      </div>
    </div>
  );
}
