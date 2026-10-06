import {m} from "@/paraglide/messages";
import type {AssignmentItemStatus, AssignmentStatus, DeliveryType} from "@/types/assignment-types";

export const ASSIGNMENT_STATUS_LABELS: Record<AssignmentStatus, () => string> = {
  created: m["assignment.status_created"],
  pending_pickup: m["assignment.status_pending_pickup"],
  active: m["assignment.status_active"],
  public_pool: m["assignment.status_public_pool"],
  failed: m["assignment.status_failed"],
  flagged: m["assignment.status_flagged"],
  completed: m["assignment.status_completed"],
};

export const ITEM_STATUS_LABELS: Record<AssignmentItemStatus, () => string> = {
  waiting: m["assignment.item_status_waiting"],
  picked_up: m["assignment.item_status_picked_up"],
  en_route: m["assignment.item_status_en_route"],
  at_super_node: m["assignment.item_status_at_super_node"],
  delivered: m["assignment.item_status_delivered"],
};

export const TYPE_LABELS: Record<DeliveryType, () => string> = {
  bulk: m["assignment.type_bulk"],
  node: m["assignment.type_node"],
  express: m["assignment.type_express"],
};

export const TYPE_SHORT_LABELS: Record<DeliveryType, () => string> = {
  bulk: m["assignment.type_bulk_short"],
  node: m["assignment.type_node_short"],
  express: m["assignment.type_express_short"],
};

/** Fallback-tolerant status label for backend filter options. */
export function assignmentStatusLabel(status: string): string {
  return status in ASSIGNMENT_STATUS_LABELS ? ASSIGNMENT_STATUS_LABELS[status as AssignmentStatus]() : status;
}

export function deliveryTypeLabel(type: string): string {
  return type in TYPE_LABELS ? TYPE_LABELS[type as DeliveryType]() : type;
}
