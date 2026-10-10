import {Input} from "@alvo/ui";
import {cn} from "cnfast";
import {FormField} from "@/components/auth/form-field";
import {PasswordInput} from "@/components/auth/password-input";
import {authInputClassName} from "@/components/auth/auth-input-styles";
import type {CompleteAccountSetupInput} from "@/types/auth-types";
import {m} from "@/paraglide/messages";
import {AssignedRoleField} from "./assigned-role-field";

type SetupField = keyof CompleteAccountSetupInput;

interface AccountSetupFieldsProps {
  values: CompleteAccountSetupInput;
  errors: Partial<Record<SetupField, string>>;
  roleLabel: string;
  onFieldChange: (field: SetupField, value: string) => void;
}

const nameFields = [
  {
    field: "firstName",
    autoComplete: "given-name",
    label: m["account_setup.first_name_label"],
    placeholder: m["account_setup.first_name_placeholder"],
  },
  {
    field: "lastName",
    autoComplete: "family-name",
    label: m["account_setup.last_name_label"],
    placeholder: m["account_setup.last_name_placeholder"],
  },
] as const;

/** Name row, password, and the read-only assigned-role display from the Figma frames. */
export function AccountSetupFields({values, errors, roleLabel, onFieldChange}: AccountSetupFieldsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4">
        {nameFields.map(({field, autoComplete, label, placeholder}) => (
          <FormField key={field} label={label()} error={errors[field]}>
            {(control) => (
              <Input
                {...control}
                name={field}
                autoComplete={autoComplete}
                placeholder={placeholder()}
                value={values[field]}
                onChange={(event) => onFieldChange(field, event.target.value)}
                className={cn(authInputClassName, "text-sm")}
              />
            )}
          </FormField>
        ))}
      </div>
      <FormField label={m["account_setup.password_label"]()} error={errors.password}>
        {(control) => (
          <PasswordInput
            {...control}
            name="password"
            autoComplete="new-password"
            placeholder={m["auth.password_placeholder"]()}
            value={values.password}
            onChange={(event) => onFieldChange("password", event.target.value)}
            className={authInputClassName}
          />
        )}
      </FormField>
      <AssignedRoleField roleLabel={roleLabel} />
    </div>
  );
}
