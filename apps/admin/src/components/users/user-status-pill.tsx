import type {UserStatus} from "@/types/users-types";
import {AccountStatusPill} from "@/components/accounts/account-pills";
import {USER_STATUS_LABELS} from "./user-labels";

/** The bordered status pill in the users table and drawer header (Active / Flagged / Suspended). */
export function UserStatusPill({status}: {status: UserStatus}) {
  return <AccountStatusPill status={status} labels={USER_STATUS_LABELS} />;
}
