import {Info} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {AdminRole, RoleOption} from "@/types/admins-types";
import {SelectShell} from "@/components/workloads/select-shell";
import {adminRoleLabel} from "./admin-labels";

export const ADMIN_INPUT =
  "mt-2 h-10 w-full rounded-lg border-[0.75px] border-grey-300 bg-white px-4 text-sm leading-[1.4] tracking-[0.14px] text-grey-600 outline-none placeholder:text-grey-500 focus:border-primary-500";
export const ADMIN_LABEL = "block text-sm leading-[1.4] font-medium tracking-[0.14px] text-black";

export interface AdminFormValue {
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole | "";
}

interface AdminInfoFieldsProps {
  form: AdminFormValue;
  roles: RoleOption[];
  disabled?: boolean;
  onChange: (patch: Partial<AdminFormValue>) => void;
}

const TEXT_FIELDS: {key: "firstName" | "lastName" | "email"; id: string; label: () => string; placeholder: () => string}[] = [
  {key: "firstName", id: "admin-first-name", label: m["admins.first_name"], placeholder: m["admins.first_name_placeholder"]},
  {key: "lastName", id: "admin-last-name", label: m["admins.last_name"], placeholder: m["admins.last_name_placeholder"]},
  {key: "email", id: "admin-email", label: m["admins.email"], placeholder: m["admins.email_placeholder"]},
];

/** The shared Info column — name, email, role select, and the blue role-hint box. Used by the invite drawer and edit dialog. */
export function AdminInfoFields({form, roles, disabled = false, onChange}: AdminInfoFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      {TEXT_FIELDS.map(({key, id, label, placeholder}) => (
        <div key={key}>
          <label className={ADMIN_LABEL} htmlFor={id}>
            {label()}
          </label>
          <input
            id={id}
            value={form[key]}
            placeholder={placeholder()}
            disabled={disabled}
            onChange={(event) => onChange({[key]: event.target.value})}
            className={ADMIN_INPUT}
          />
        </div>
      ))}
      <RoleSelect form={form} roles={roles} disabled={disabled} onChange={onChange} />
    </div>
  );
}

function RoleSelect({form, roles, disabled = false, onChange}: AdminInfoFieldsProps) {
  const selected = roles.find((option) => option.id === form.role);
  return (
    <>
      <div>
        <label className={ADMIN_LABEL} htmlFor="admin-role">
          {m["admins.role_label"]()}
        </label>
        <SelectShell
          id="admin-role"
          value={form.role}
          disabled={disabled}
          onChange={(v) => onChange({role: v as AdminRole})}
          wrapperClassName="mt-2"
        >
          <option value="" disabled>
            {m["admins.role_placeholder"]()}
          </option>
          {roles.map((option) => (
            <option key={option.id} value={option.id}>
              {adminRoleLabel[option.id]?.() ?? option.label}
            </option>
          ))}
        </SelectShell>
      </div>
      {selected && (
        <div className="flex items-start gap-2.5 rounded-lg bg-secondary-50 p-3">
          <Info className="mt-0.5 size-4 shrink-0 text-secondary-500" aria-hidden="true" />
          <div>
            <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-secondary-500">{selected.label}</p>
            <p className="pt-0.5 text-xs leading-[1.4] tracking-[0.12px] text-secondary-500">{selected.hint}</p>
          </div>
        </div>
      )}
    </>
  );
}
