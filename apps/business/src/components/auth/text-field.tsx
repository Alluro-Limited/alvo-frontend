import {Input, type InputProps} from "@alvo/ui";
import {cn} from "cnfast";
import {authInputClassName} from "./auth-input-styles";
import {FormField} from "./form-field";

interface AuthTextFieldProps extends Omit<InputProps, "id" | "aria-invalid" | "aria-describedby"> {
  label: string;
  error?: string;
  hint?: string;
}

/** `FormField` + `Input` in the auth visual style; the field-level pieces stay wired for a11y. */
export function AuthTextField({label, error, hint, ...inputProps}: AuthTextFieldProps) {
  return (
    <FormField label={label} error={error} hint={hint}>
      {(control) => <Input {...control} {...inputProps} className={cn(authInputClassName, "text-sm")} />}
    </FormField>
  );
}
