import {m} from "@/paraglide/messages";
import type {NodeStatus} from "@/types/nodes-types";

/** Node status → label shared by the table pills, the status filter, the detail header, and the status modal. */
export const NODE_STATUS_LABELS: Record<NodeStatus, () => string> = {
  online: m["nodes.status_online"],
  offline: m["nodes.status_offline"],
  warning: m["nodes.status_warning"],
  maintenance: m["nodes.status_maintenance"],
  full: m["nodes.status_full"],
  decommissioned: m["nodes.status_decommissioned"],
};
