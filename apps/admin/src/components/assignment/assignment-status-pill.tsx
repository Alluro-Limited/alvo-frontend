import {StatusTag} from "@alvo/ui";
import {cn} from "cnfast";
import type {AssignmentStatus} from "@/types/assignment-types";
import {ASSIGNMENT_STATUS_LABELS} from "./assignment-labels";

const VARIANTS: Record<AssignmentStatus, {status: "pickup" | "success" | "fail" | "pending" | "delayed" | "default"; className?: string}> =
  {
    created: {status: "default"},
    pending_pickup: {status: "default", className: "border-accent-500 bg-accent-50 text-accent-500"},
    active: {status: "pickup"},
    public_pool: {status: "delayed"},
    failed: {status: "fail"},
    flagged: {status: "pending"},
    completed: {status: "success"},
  };

/** The dotted status pill in the assignments table and drawer header. */
export function AssignmentStatusPill({status}: {status: AssignmentStatus}) {
  const variant = VARIANTS[status];
  return (
    <StatusTag status={variant.status} className={cn("py-1", variant.className)}>
      {ASSIGNMENT_STATUS_LABELS[status]()}
    </StatusTag>
  );
}
