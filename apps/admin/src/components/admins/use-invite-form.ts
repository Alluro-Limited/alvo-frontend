import {useState} from "react";
import type {AdminRole, InviteAdminInput, PermissionCatalog} from "@/types/admins-types";
import type {AdminFormValue} from "./admin-info-fields";

/** Invite/edit form state — field patches plus the permission grant list; role picks apply the catalog preset. */
export function useAdminPermissionForm({
  initialForm,
  initialGranted,
  presets,
}: {
  initialForm: AdminFormValue;
  initialGranted: string[];
  presets: PermissionCatalog["presets"] | undefined;
}) {
  const [form, setForm] = useState<AdminFormValue>(initialForm);
  const [granted, setGranted] = useState<string[]>(initialGranted);
  const [attempted, setAttempted] = useState(false);

  const patchForm = (patch: Partial<AdminFormValue>) => {
    const next = {...form, ...patch};
    setForm(next);
    if (patch.role && patch.role !== form.role) setGranted([...(presets?.[patch.role] ?? [])]);
  };

  const complete = form.firstName.trim() !== "" && form.lastName.trim() !== "" && form.email.trim() !== "" && form.role !== "";

  const submit = (onSubmit: (input: InviteAdminInput) => void) => {
    setAttempted(true);
    if (!complete) return;
    onSubmit({firstName: form.firstName, lastName: form.lastName, email: form.email, role: form.role as AdminRole, permissions: granted});
  };

  return {form, granted, attempted, complete, patchForm, setGranted, submit};
}
