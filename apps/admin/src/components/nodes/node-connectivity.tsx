import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {NodeConnectivity} from "@/types/nodes-types";

const LABELS: Record<NodeConnectivity, () => string> = {
  "4g_lte": m["nodes.network_4g_lte"],
  "3g": m["nodes.network_3g"],
  unstable: m["nodes.network_unstable"],
  no_signal: m["nodes.network_no_signal"],
};

const DOT: Record<NodeConnectivity, string> = {
  "4g_lte": "bg-status-success",
  "3g": "bg-status-warning",
  unstable: "bg-status-delayed",
  no_signal: "bg-status-fail",
};

/** The Network column cell — a colored signal dot plus the connection label. */
export function NodeConnectivityCell({connectivity}: {connectivity: NodeConnectivity}) {
  return (
    <span className="flex items-center gap-2">
      <span className={cn("size-3 shrink-0 rounded-full", DOT[connectivity])} aria-hidden="true" />
      {LABELS[connectivity]()}
    </span>
  );
}
