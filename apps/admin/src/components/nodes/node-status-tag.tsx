import {StatusTag} from "@alvo/ui";
import {cn} from "cnfast";
import type {NodeStatus} from "@/types/nodes-types";
import {NODE_STATUS_LABELS} from "./node-status-labels";

const VARIANTS: Record<NodeStatus, {status: "success" | "fail" | "pending" | "delayed" | "default"; className?: string}> = {
  online: {status: "success"},
  offline: {status: "fail"},
  warning: {status: "pending"},
  maintenance: {status: "delayed"},
  full: {status: "default", className: "border-accent-500 bg-accent-50 text-accent-500"},
  decommissioned: {status: "default", className: "border-grey-500 bg-grey-100 text-grey-600"},
};

/** The bordered status pill used in the Nodes table, detail header, and the status modal. */
export function NodeStatusTag({status}: {status: NodeStatus}) {
  const variant = VARIANTS[status];
  return (
    <StatusTag status={variant.status} className={cn("py-1", variant.className)}>
      {NODE_STATUS_LABELS[status]()}
    </StatusTag>
  );
}
