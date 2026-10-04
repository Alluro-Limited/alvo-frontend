import {authInputClassName} from "@/components/auth/auth-input-styles";
import {FormField} from "@/components/auth/form-field";
import {PasswordInput} from "@/components/auth/password-input";
import {m} from "@/paraglide/messages";
import {PasswordRequirements} from "./password-requirements";

type ResetPasswordField = "password" | "confirmPassword";

interface ResetPasswordFieldsProps {
  values: Record<ResetPasswordField, string>;
  onChange: (field: ResetPasswordField, value: string) => void;
}

/** "New password" and "Confirm password", with the policy chips under the confirmation as in Figma. */
export function ResetPasswordFields({values, onChange}: ResetPasswordFieldsProps) {
  return (
    <div className="flex flex-col gap-6">
      <FormField label={m["reset_password.password_label"]()}>
        {(control) => (
          <PasswordInput
            {...control}
            name="new-password"
            autoComplete="new-password"
            placeholder={m["auth.password_placeholder"]()}
            value={values.password}
            onChange={(event) => onChange("password", event.target.value)}
            className={authInputClassName}
          />
        )}
      </FormField>
      <div className="flex flex-col gap-2">
        <FormField label={m["reset_password.confirm_label"]()}>
          {(control) => (
            <PasswordInput
              {...control}
              name="confirm-password"
              autoComplete="new-password"
              placeholder={m["auth.password_placeholder"]()}
              value={values.confirmPassword}
              onChange={(event) => onChange("confirmPassword", event.target.value)}
              className={authInputClassName}
            />
          )}
        </FormField>
        <PasswordRequirements password={values.password} />
      </div>
    </div>
  );
}
