import {cn} from "cnfast";
import type {UserVerification} from "@/types/users-types";
import usersPartial from "@/assets/users-partial.svg";
import usersUnverified from "@/assets/users-unverified.svg";
import usersVerified from "@/assets/users-verified.svg";
import {USER_VERIFICATION_LABELS} from "./user-labels";

const STYLES: Record<UserVerification, {icon: string; className: string}> = {
  verified: {icon: usersVerified, className: "bg-status-success-subtle text-status-success-dark"},
  partial: {icon: usersPartial, className: "bg-status-warning-subtle text-status-warning-dark"},
  unverified: {icon: usersUnverified, className: "bg-grey-100 text-grey-600"},
};

/** The filled Verification pill — a check-circle glyph plus the level label. */
export function VerificationPill({verification}: {verification: UserVerification}) {
  const style = STYLES[verification];
  return (
    <span className={cn("inline-flex h-7 items-center gap-1 rounded-sm px-2 text-xs leading-[1.4]", style.className)}>
      <img src={style.icon} alt="" className="size-3" aria-hidden="true" />
      {USER_VERIFICATION_LABELS[verification]()}
    </span>
  );
}
