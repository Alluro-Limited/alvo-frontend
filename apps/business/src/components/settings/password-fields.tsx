import type {ChangeEvent} from "react";
import {FormField} from "@/components/auth/form-field";
import {PasswordInput} from "@/components/auth/password-input";
import {m} from "@/paraglide/messages";

export interface PasswordValues {
  current: string;
  next: string;
  confirm: string;
}

export type PasswordErrors = Partial<Record<keyof PasswordValues, string>>;

interface PasswordFieldsProps {
  values: PasswordValues;
  errors: PasswordErrors;
  onChange: (key: keyof PasswordValues, value: string) => void;
}

/** The three password inputs inside the security card. */
export function PasswordFields({values, errors, onChange}: PasswordFieldsProps) {
  const handler = (key: keyof PasswordValues) => (event: ChangeEvent<HTMLInputElement>) => onChange(key, event.target.value);
  return (
    <div className="flex flex-col gap-6">
      <FormField label={m["settings.current_password"]()} error={errors.current}>
        {(control) => <PasswordInput {...control} value={values.current} onChange={handler("current")} />}
      </FormField>
      <FormField label={m["settings.new_password"]()} error={errors.next}>
        {(control) => <PasswordInput {...control} value={values.next} onChange={handler("next")} />}
      </FormField>
      <FormField label={m["settings.confirm_password"]()} error={errors.confirm}>
        {(control) => <PasswordInput {...control} value={values.confirm} onChange={handler("confirm")} />}
      </FormField>
    </div>
  );
}
