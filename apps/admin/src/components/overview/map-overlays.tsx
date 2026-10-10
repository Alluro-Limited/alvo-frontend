import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {MapStatusCounts, OverviewMapNode} from "@/types/dashboard-types";

const OVERLAY_SHADOW = "drop-shadow-[0_0_3.5px_rgba(0,0,0,0.1)]";
const CHIP_TEXT = "rounded bg-white px-2 py-1 text-xs leading-[1.4] font-medium tracking-[0.12px]";

const LEGEND = [
  {dot: "bg-primary-500", label: m["overview.legend_online"]},
  {dot: "bg-status-fail", label: m["overview.legend_offline"]},
  {dot: "bg-status-warning", label: m["overview.legend_warning"]},
  {dot: "bg-accent", label: m["overview.legend_courier"]},
] as const;

function countStatuses(nodes: OverviewMapNode[]): MapStatusCounts {
  return {
    online: nodes.filter((node) => node.status === "online").length,
    offline: nodes.filter((node) => node.status === "offline").length,
    warning: nodes.filter((node) => node.status === "warning").length,
  };
}

/** Bottom-left chips reporting how many network nodes are online/offline/warning. */
export function MapStatusChips({nodes}: {nodes: OverviewMapNode[]}) {
  const status = countStatuses(nodes);
  const chips = [
    {label: m["overview.map_online"]({count: status.online}), tone: "text-status-success-dark"},
    {label: m["overview.map_offline"]({count: status.offline}), tone: "text-status-warning-dark"},
    {label: m["overview.map_warning"]({count: status.warning}), tone: "text-status-fail-dark"},
  ];

  return (
    <div className="absolute bottom-4 left-4 flex gap-2">
      {chips.map((chip) => (
        <span key={chip.label} className={cn(CHIP_TEXT, OVERLAY_SHADOW, chip.tone)}>
          {chip.label}
        </span>
      ))}
    </div>
  );
}

/** Bottom-right legend explaining the marker colors once nodes and couriers appear. */
export function MapLegend() {
  return (
    <div className={cn("absolute right-4 bottom-4 flex flex-col gap-2 rounded bg-white p-2", OVERLAY_SHADOW)}>
      {LEGEND.map((item) => (
        <div key={item.label()} className="flex items-center gap-2">
          <span className={cn("size-3 shrink-0 rounded-full", item.dot)} aria-hidden="true" />
          <span className="text-xs leading-[1.4] font-medium tracking-[0.12px] text-grey-600">{item.label()}</span>
        </div>
      ))}
    </div>
  );
}
