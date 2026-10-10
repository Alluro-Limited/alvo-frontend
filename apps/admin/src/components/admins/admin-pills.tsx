import {StatusTag} from "@alvo/ui";
import {cn} from "cnfast";
import type {AdminRole, AdminStatus} from "@/types/admins-types";
import {adminRoleLabel, adminRolePillClass, adminStatusLabel, adminStatusVariant} from "./admin-labels";

/** The colored role chip from the table/drawer — color-coded per Figma's Verification instances. */
export function AdminRolePill({role}: {role: AdminRole}) {
  return (
    <span
      className={cn("inline-flex rounded-full px-2.5 py-1 text-xs leading-[1.4] font-medium whitespace-nowrap", adminRolePillClass[role])}
    >
      {adminRoleLabel[role]()}
    </span>
  );
}

/** Active / Suspended / Invited pill. */
export function AdminStatusPill({status}: {status: AdminStatus}) {
  return <StatusTag status={adminStatusVariant[status]}>{adminStatusLabel[status]()}</StatusTag>;
}
