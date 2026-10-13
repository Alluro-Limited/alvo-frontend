import {errorText} from "@/components/form/error-text";
import {FormField} from "@/components/form/form-field";
import {TextInput} from "@/components/form/text-input";
import type {FieldErrors} from "@/lib/signup-validation";
import {m} from "@/paraglide/messages";
import {NigeriaFlag} from "./nigeria-flag";

interface PhoneFieldProps {
  phone: string;
  errors: FieldErrors;
  onChange: (value: string) => void;
}

/** Phone input with the Nigerian-flag prefix chip from the design. */
export function PhoneField({phone, errors, onChange}: PhoneFieldProps) {
  return (
    <FormField label={m["su.phone"]()} error={errorText(errors.phone)}>
      {(c) => (
        <div className="relative">
          <span className="absolute top-1/2 left-4 -translate-y-1/2">
            <NigeriaFlag />
          </span>
          <TextInput
            {...c}
            inputMode="tel"
            value={phone}
            onChange={(e) => onChange(e.target.value)}
            placeholder={m["su.phone_ph"]()}
            className="pl-12"
          />
        </div>
      )}
    </FormField>
  );
}
