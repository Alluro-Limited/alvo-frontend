import {m} from "@/paraglide/messages";
import type {ParcelStatus} from "@/types/workloads-types";

/** Status → label shared by the table pills and the status filter dropdown. */
export const STATUS_LABELS: Record<ParcelStatus, () => string> = {
  pending_pickup: m["workloads.status_pending_pickup"],
  in_transit: m["workloads.status_in_transit"],
  delivered: m["workloads.status_delivered"],
  failed: m["workloads.status_failed"],
  expired: m["workloads.status_expired"],
};
