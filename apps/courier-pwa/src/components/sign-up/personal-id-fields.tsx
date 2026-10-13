import {errorText} from "@/components/form/error-text";
import {FormField} from "@/components/form/form-field";
import {SelectInput} from "@/components/form/select-input";
import {TextInput} from "@/components/form/text-input";
import type {FieldErrors} from "@/lib/signup-validation";
import {m} from "@/paraglide/messages";
import type {PersonalDetails} from "@/types/signup-types";

const MONTHS = Array.from({length: 12}, (_, i) => String(i + 1).padStart(2, "0"));
const DAYS = Array.from({length: 31}, (_, i) => String(i + 1).padStart(2, "0"));

type DobField = "birthYear" | "birthMonth" | "birthDay";

function dateParts(): Array<[DobField, "su.dob_year" | "su.dob_month" | "su.dob_day", string[]]> {
  const years = Array.from({length: 53}, (_, i) => String(new Date().getFullYear() - 18 - i));
  return [
    ["birthYear", "su.dob_year", years],
    ["birthMonth", "su.dob_month", MONTHS],
    ["birthDay", "su.dob_day", DAYS],
  ];
}

interface PersonalIdFieldsProps {
  personal: PersonalDetails;
  errors: FieldErrors;
  onChange: (field: keyof PersonalDetails, value: string) => void;
}

/** Gender select, the three-part date-of-birth selects, and NIN. */
export function PersonalIdFields({personal, errors, onChange}: PersonalIdFieldsProps) {
  return (
    <>
      <FormField label={m["su.gender"]()} error={errorText(errors.gender)}>
        {(c) => (
          <SelectInput {...c} value={personal.gender} onChange={(e) => onChange("gender", e.target.value)}>
            <option value="" disabled>
              {m["su.gender_ph"]()}
            </option>
            <option value="male">{m["su.gender_male"]()}</option>
            <option value="female">{m["su.gender_female"]()}</option>
          </SelectInput>
        )}
      </FormField>
      <FormField label={m["su.dob"]()} error={errorText(errors.dob)}>
        {(c) => (
          <div className="grid grid-cols-3 gap-2">
            {dateParts().map(([field, labelKey, options]) => (
              <SelectInput key={field} {...c} value={personal[field]} onChange={(e) => onChange(field, e.target.value)}>
                <option value="" disabled>
                  {m[labelKey]()}
                </option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </SelectInput>
            ))}
          </div>
        )}
      </FormField>
      <FormField label={m["su.nin"]()} error={errorText(errors.nin)}>
        {(c) => (
          <TextInput
            {...c}
            inputMode="numeric"
            value={personal.nin}
            onChange={(e) => onChange("nin", e.target.value)}
            placeholder={m["su.nin_ph"]()}
          />
        )}
      </FormField>
    </>
  );
}
