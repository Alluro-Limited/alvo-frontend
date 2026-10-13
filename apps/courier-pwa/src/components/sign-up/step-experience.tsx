import {errorText} from "@/components/form/error-text";
import {FormField} from "@/components/form/form-field";
import {SelectInput} from "@/components/form/select-input";
import {TextInput} from "@/components/form/text-input";
import type {FieldErrors} from "@/lib/signup-validation";
import {m} from "@/paraglide/messages";
import type {ExperienceDetails} from "@/types/signup-types";
import {StepHeading} from "./step-heading";

interface StepExperienceProps {
  experience: ExperienceDetails;
  errors: FieldErrors;
  onChange: (field: keyof ExperienceDetails, value: string) => void;
}

export function StepExperience({experience, errors, onChange}: StepExperienceProps) {
  return (
    <div className="flex flex-col gap-6">
      <StepHeading title={m["su.exp_title"]()} description={m["su.exp_desc"]()} />
      <div className="flex flex-col gap-5">
        <FormField label={m["su.worked_before"]()} error={errorText(errors.workedBefore)}>
          {(c) => (
            <SelectInput
              {...c}
              value={experience.workedBefore}
              onChange={(e) => onChange("workedBefore", e.target.value as ExperienceDetails["workedBefore"])}
            >
              <option value="" disabled>
                {m["su.worked_before_ph"]()}
              </option>
              <option value="yes">{m["su.yes"]()}</option>
              <option value="no">{m["su.no"]()}</option>
            </SelectInput>
          )}
        </FormField>
        <FormField label={m["su.company"]()} error={errorText(errors.company)}>
          {(c) => (
            <TextInput
              {...c}
              value={experience.company}
              onChange={(e) => onChange("company", e.target.value)}
              placeholder={m["su.company_ph"]()}
            />
          )}
        </FormField>
        <FormField label={m["su.years"]()} error={errorText(errors.years)}>
          {(c) => (
            <SelectInput {...c} value={experience.years} onChange={(e) => onChange("years", e.target.value)}>
              <option value="" disabled>
                {m["su.years_ph"]()}
              </option>
              <option value="0-1">{m["su.years_0_1"]()}</option>
              <option value="1-3">{m["su.years_1_3"]()}</option>
              <option value="3-5">{m["su.years_3_5"]()}</option>
              <option value="5+">{m["su.years_5_plus"]()}</option>
            </SelectInput>
          )}
        </FormField>
      </div>
    </div>
  );
}
