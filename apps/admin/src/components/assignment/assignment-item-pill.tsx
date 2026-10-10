import {cn} from "cnfast";
import type {AssignmentItemStatus} from "@/types/assignment-types";
import {ITEM_STATUS_LABELS} from "./assignment-labels";

export const ITEM_TONES: Record<AssignmentItemStatus, {dot: string; pill: string}> = {
  waiting: {dot: "bg-grey-400", pill: "border-grey-300 bg-white text-grey-600"},
  picked_up: {dot: "bg-accent-500", pill: "border-accent-500 bg-accent-50 text-accent-500"},
  en_route: {dot: "bg-primary-500", pill: "border-primary-500 bg-primary-50 text-primary-600"},
  at_super_node: {dot: "bg-status-warning-dark", pill: "border-status-warning-dark bg-status-warning-subtle text-status-warning-dark"},
  delivered: {dot: "bg-status-success-dark", pill: "border-status-success-dark bg-status-success-subtle text-status-success-dark"},
};

export function assignmentItemStatusLabel(status: AssignmentItemStatus): string {
  return ITEM_STATUS_LABELS[status]();
}

/** The dotted outline pill on item rows and the modal's count chips. */
export function AssignmentItemPill({status, children}: {status: AssignmentItemStatus; children?: React.ReactNode}) {
  const tone = ITEM_TONES[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs leading-[1.4] font-medium tracking-[0.12px] whitespace-nowrap",
        tone.pill
      )}
    >
      <span className={cn("size-1.5 rounded-full", tone.dot)} aria-hidden="true" />
      {children ?? ITEM_STATUS_LABELS[status]()}
    </span>
  );
}
