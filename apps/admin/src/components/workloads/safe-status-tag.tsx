import {StatusTag} from "@alvo/ui";
import {cn} from "cnfast";
import type {SafeItemStatus} from "@/types/workloads-types";
import {SAFE_STATUS_LABELS} from "./safe-status-labels";

const VARIANTS: Record<SafeItemStatus, {status: "pickup" | "success" | "fail" | "pending" | "default"; className?: string}> = {
  active: {status: "pickup"},
  pending_pickup: {status: "default", className: "border-accent-500 bg-accent-50 text-accent-500"},
  expiring_soon: {status: "pending"},
  expired: {status: "fail"},
  retrieved: {status: "success"},
};

/** The bordered status pill in the Safe table ("Active", "Expiring soon", ...). */
export function SafeStatusTag({status}: {status: SafeItemStatus}) {
  const variant = VARIANTS[status];
  return (
    <StatusTag status={variant.status} className={cn("py-1", variant.className)}>
      {SAFE_STATUS_LABELS[status]()}
    </StatusTag>
  );
}
