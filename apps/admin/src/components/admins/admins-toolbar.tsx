import {CourierSearchField} from "@/components/couriers/courier-search-field";
import {SelectShell} from "@/components/workloads/select-shell";
import {m} from "@/paraglide/messages";
import type {AdminRole} from "@/types/admins-types";
import {adminRoleLabel, adminStatusLabel} from "./admin-labels";

const STATUS_OPTIONS = ["active", "suspended", "invited"] as const;
const ROLE_OPTIONS: AdminRole[] = ["super_admin", "operational_admin", "finance_admin", "support_admin", "viewer"];

interface AdminsToolbarProps {
  query: string;
  status: string;
  role: string;
  onQuery: (v: string) => void;
  onStatus: (v: string) => void;
  onRole: (v: string) => void;
}

/** Search + status + role filters above the admin table. */
export function AdminsToolbar({query, status, role, onQuery, onStatus, onRole}: AdminsToolbarProps) {
  return (
    <div className="flex items-center gap-3">
      <CourierSearchField value={query} placeholder={m["admins.search_placeholder"]()} onQuery={onQuery} className="w-[400px]" />
      <SelectShell
        id="admins-status"
        value={status}
        onChange={onStatus}
        aria-label={m["admins.filter_status"]()}
        wrapperClassName="w-[160px]"
      >
        <option value="">{`${m["admins.filter_status"]()}: ${m["admins.filter_all"]()}`}</option>
        {STATUS_OPTIONS.map((value) => (
          <option key={value} value={value}>
            {adminStatusLabel[value]()}
          </option>
        ))}
      </SelectShell>
      <SelectShell id="admins-role" value={role} onChange={onRole} aria-label={m["admins.filter_role"]()} wrapperClassName="w-[190px]">
        <option value="">{`${m["admins.filter_role"]()}: ${m["admins.filter_all"]()}`}</option>
        {ROLE_OPTIONS.map((value) => (
          <option key={value} value={value}>
            {adminRoleLabel[value]()}
          </option>
        ))}
      </SelectShell>
    </div>
  );
}
