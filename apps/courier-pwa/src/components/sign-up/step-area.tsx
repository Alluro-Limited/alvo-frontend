import {errorText} from "@/components/form/error-text";
import {FormField} from "@/components/form/form-field";
import {SelectInput} from "@/components/form/select-input";
import type {FieldErrors} from "@/lib/signup-validation";
import {m} from "@/paraglide/messages";
import {StepHeading} from "./step-heading";

const DELIVERY_AREAS = ["Surulere", "Yaba", "Ikeja", "Lekki", "Victoria Island", "Ikoyi", "Ajah", "Oshodi", "Mushin", "Gbagada"];

interface StepAreaProps {
  deliveryArea: string;
  errors: FieldErrors;
  onChange: (value: string) => void;
}

export function StepArea({deliveryArea, errors, onChange}: StepAreaProps) {
  return (
    <div className="flex flex-col gap-6">
      <StepHeading title={m["su.area_title"]()} description={m["su.area_desc"]()} />
      <FormField label={m["su.area"]()} error={errorText(errors.deliveryArea)}>
        {(c) => (
          <SelectInput {...c} value={deliveryArea} onChange={(e) => onChange(e.target.value)}>
            <option value="" disabled>
              {m["su.area_ph"]()}
            </option>
            {DELIVERY_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </SelectInput>
        )}
      </FormField>
    </div>
  );
}
