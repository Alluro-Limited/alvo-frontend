import {StatusTag} from "@alvo/ui";
import type {UserStatus} from "@/types/users-types";
import {USER_STATUS_LABELS} from "./user-labels";

const VARIANTS: Record<UserStatus, "success" | "pending" | "fail"> = {
  active: "success",
  flagged: "pending",
  suspended: "fail",
};

/** The bordered status pill in the users table and drawer header (Active / Flagged / Suspended). */
export function UserStatusPill({status}: {status: UserStatus}) {
  return <StatusTag status={VARIANTS[status]}>{USER_STATUS_LABELS[status]()}</StatusTag>;
}
