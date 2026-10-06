import {m} from "@/paraglide/messages";
import type {SafeItemStatus} from "@/types/workloads-types";

/** Safe status → label shared by the table pills, the status filter, and the drawer banner. */
export const SAFE_STATUS_LABELS: Record<SafeItemStatus, () => string> = {
  active: m["workloads.status_active"],
  pending_pickup: m["workloads.status_pending_pickup"],
  expiring_soon: m["workloads.status_expiring_soon"],
  expired: m["workloads.status_expired"],
  retrieved: m["workloads.status_retrieved"],
};
