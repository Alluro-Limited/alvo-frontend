import {errorText} from "@/components/form/error-text";
import {FormField} from "@/components/form/form-field";
import {TextInput} from "@/components/form/text-input";
import type {FieldErrors} from "@/lib/signup-validation";
import {m} from "@/paraglide/messages";
import type {PersonalDetails} from "@/types/signup-types";
import {PhoneField} from "@/components/form/phone-field";

interface PersonalContactFieldsProps {
  personal: PersonalDetails;
  errors: FieldErrors;
  onChange: (field: keyof PersonalDetails, value: string) => void;
}

/** First name, last name, phone (with the +234 flag chip) and email. */
export function PersonalContactFields({personal, errors, onChange}: PersonalContactFieldsProps) {
  return (
    <>
      <FormField label={m["su.first_name"]()} error={errorText(errors.firstName)}>
        {(c) => (
          <TextInput
            {...c}
            value={personal.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder={m["su.first_name_ph"]()}
          />
        )}
      </FormField>
      <FormField label={m["su.last_name"]()} error={errorText(errors.lastName)}>
        {(c) => (
          <TextInput
            {...c}
            value={personal.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder={m["su.last_name_ph"]()}
          />
        )}
      </FormField>
      <PhoneField phone={personal.phone} errors={errors} onChange={(value) => onChange("phone", value)} />
      <FormField label={m["su.email"]()} error={errorText(errors.email)}>
        {(c) => (
          <TextInput
            {...c}
            type="email"
            inputMode="email"
            value={personal.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder={m["su.email_ph"]()}
          />
        )}
      </FormField>
    </>
  );
}
