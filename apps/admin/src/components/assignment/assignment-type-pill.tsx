import {Boxes, Car, LayoutGrid, type LucideIcon} from "lucide-react";
import {cn} from "cnfast";
import type {DeliveryType} from "@/types/assignment-types";
import {TYPE_SHORT_LABELS} from "./assignment-labels";

export const TYPE_TONES: Record<DeliveryType, {icon: LucideIcon; classes: string}> = {
  bulk: {icon: Boxes, classes: "bg-secondary-50 text-secondary-500"},
  node: {icon: LayoutGrid, classes: "bg-accent-50 text-accent-500"},
  express: {icon: Car, classes: "bg-status-delayed-subtle text-status-delayed"},
};

/** The small delivery-type pill in the table Type column and info cards. */
export function AssignmentTypePill({type}: {type: DeliveryType}) {
  const tone = TYPE_TONES[type];
  const Icon = tone.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs leading-[1.4] font-medium tracking-[0.12px]",
        tone.classes
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {TYPE_SHORT_LABELS[type]()}
    </span>
  );
}
