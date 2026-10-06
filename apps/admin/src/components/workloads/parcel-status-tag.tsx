import {StatusTag} from "@alvo/ui";
import {cn} from "cnfast";
import type {ParcelStatus} from "@/types/workloads-types";
import {STATUS_LABELS} from "./status-labels";

const VARIANTS: Record<ParcelStatus, {status: "pickup" | "success" | "fail" | "pending" | "default"; className?: string}> = {
  pending_pickup: {status: "default", className: "border-accent-500 bg-accent-50 text-accent-500"},
  in_transit: {status: "pickup"},
  delivered: {status: "success"},
  failed: {status: "fail"},
  expired: {status: "pending"},
};

/** The bordered status pill in the parcels table ("In Transit", "Pending Pickup", ...). */
export function ParcelStatusTag({status}: {status: ParcelStatus}) {
  const variant = VARIANTS[status];
  return (
    <StatusTag status={variant.status} className={cn("py-1", variant.className)}>
      {STATUS_LABELS[status]()}
    </StatusTag>
  );
}
