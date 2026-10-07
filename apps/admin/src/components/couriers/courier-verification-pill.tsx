import {CircleCheck, Clock3} from "lucide-react";
import {cn} from "cnfast";
import type {CourierVerification} from "@/types/couriers-types";
import {COURIER_VERIFICATION_LABELS} from "./courier-labels";

const STYLES: Record<CourierVerification, {icon: typeof CircleCheck; className: string}> = {
  verified: {icon: CircleCheck, className: "bg-status-success-subtle text-status-success-dark"},
  pending: {icon: Clock3, className: "bg-status-warning-subtle text-status-warning-dark"},
};

/** The filled Verification pill — a glyph plus the level label (Verified / Pending). */
export function CourierVerificationPill({verification}: {verification: CourierVerification}) {
  const style = STYLES[verification];
  const Icon = style.icon;
  return (
    <span className={cn("inline-flex h-7 items-center gap-1 rounded-sm px-2 text-xs leading-[1.4]", style.className)}>
      <Icon className="size-3" aria-hidden="true" />
      {COURIER_VERIFICATION_LABELS[verification]()}
    </span>
  );
}
