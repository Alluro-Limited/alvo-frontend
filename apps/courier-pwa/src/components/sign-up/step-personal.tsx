import type {FieldErrors} from "@/lib/signup-validation";
import {m} from "@/paraglide/messages";
import type {PersonalDetails} from "@/types/signup-types";
import {PersonalContactFields} from "./personal-contact-fields";
import {PersonalIdFields} from "./personal-id-fields";
import {StepHeading} from "./step-heading";

interface StepPersonalProps {
  personal: PersonalDetails;
  errors: FieldErrors;
  onChange: (field: keyof PersonalDetails, value: string) => void;
}

export function StepPersonal({personal, errors, onChange}: StepPersonalProps) {
  return (
    <div className="flex flex-col gap-6">
      <StepHeading title={m["su.personal_title"]()} description={m["su.personal_desc"]()} />
      <div className="flex flex-col gap-5">
        <PersonalContactFields personal={personal} errors={errors} onChange={onChange} />
        <PersonalIdFields personal={personal} errors={errors} onChange={onChange} />
      </div>
    </div>
  );
}
