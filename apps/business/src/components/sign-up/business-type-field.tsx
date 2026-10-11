import type {ChangeEvent} from "react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import {FormField} from "@/components/auth/form-field";
import {SelectInput} from "@/components/auth/select-input";
import {businessTypeOptions} from "./business-type-options";

interface BusinessTypeFieldProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

/** The business-type dropdown: a native select styled like the other inputs, grey until chosen. */
export function BusinessTypeField({value, error, onChange}: BusinessTypeFieldProps) {
  return (
    <FormField label={m["sign_up.business_type_label"]()} error={error}>
      {(control) => (
        <SelectInput
          {...control}
          name="businessType"
          value={value}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value)}
          className={cn("text-sm", !value && "text-grey-500")}
        >
          <option value="" disabled>
            {m["sign_up.business_type_placeholder"]()}
          </option>
          {businessTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label()}
            </option>
          ))}
        </SelectInput>
      )}
    </FormField>
  );
}
