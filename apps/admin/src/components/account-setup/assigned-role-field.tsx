import {m} from "@/paraglide/messages";

interface AssignedRoleFieldProps {
  roleLabel: string;
}

/** The role comes from the invitation, so it is shown as read-only text styled like the Figma field. */
export function AssignedRoleField({roleLabel}: AssignedRoleFieldProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-base leading-[1.4] tracking-[0.01em] text-primary-800">{m["account_setup.role_label"]()}</p>
      <div className="flex flex-col gap-1">
        <div className="flex h-[50px] w-full items-center rounded-lg border border-grey-400 bg-grey-200 px-4 text-sm leading-[1.4] tracking-[0.01em] text-grey-600 shadow-[0_2px_8px_0_rgba(74,133,228,0.15)]">
          {roleLabel}
        </div>
        <p className="text-xs leading-[1.4] tracking-[0.01em] text-grey-500">{m["account_setup.role_hint"]()}</p>
      </div>
    </div>
  );
}
