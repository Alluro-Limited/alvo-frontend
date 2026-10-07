import {StatusTag} from "@alvo/ui";
import {cn} from "cnfast";
import usersPartial from "@/assets/users-partial.svg";
import usersUnverified from "@/assets/users-unverified.svg";
import usersVerified from "@/assets/users-verified.svg";

type AccountStatus = "active" | "flagged" | "suspended";
type AccountVerification = "verified" | "partial" | "unverified";

const STATUS_VARIANTS: Record<AccountStatus, "success" | "pending" | "fail"> = {
  active: "success",
  flagged: "pending",
  suspended: "fail",
};

const VERIFICATION_STYLES: Record<AccountVerification, {icon: string; className: string}> = {
  verified: {icon: usersVerified, className: "bg-status-success-subtle text-status-success-dark"},
  partial: {icon: usersPartial, className: "bg-status-warning-subtle text-status-warning-dark"},
  unverified: {icon: usersUnverified, className: "bg-grey-100 text-grey-600"},
};

/** The bordered account-status pill (Active / Flagged / Suspended) shared by Users and SMEs. */
export function AccountStatusPill({status, labels}: {status: AccountStatus; labels: Record<AccountStatus, () => string>}) {
  return <StatusTag status={STATUS_VARIANTS[status]}>{labels[status]()}</StatusTag>;
}

/** The filled Verification pill — a check-circle glyph plus the level label. */
export function AccountVerificationPill({
  verification,
  labels,
}: {
  verification: AccountVerification;
  labels: Record<AccountVerification, () => string>;
}) {
  const style = VERIFICATION_STYLES[verification];
  return (
    <span className={cn("inline-flex h-7 items-center gap-1 rounded-sm px-2 text-xs leading-[1.4]", style.className)}>
      <img src={style.icon} alt="" className="size-3" aria-hidden="true" />
      {labels[verification]()}
    </span>
  );
}
