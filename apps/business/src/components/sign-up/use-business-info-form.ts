import {useState, type FormEvent} from "react";
import * as v from "valibot";
import type {BusinessInfoInput} from "@/types/auth-types";
import {businessInfoSchema} from "./sign-up-schema";

type FieldErrors = Partial<Record<keyof BusinessInfoInput, string>>;

function validate(values: BusinessInfoInput) {
  const result = v.safeParse(businessInfoSchema, values);
  if (result.success) return {businessInfo: result.output, errors: {}};
  const nested = v.flatten<typeof businessInfoSchema>(result.issues).nested ?? {};
  const errors: FieldErrors = {};
  for (const field of Object.keys(nested) as (keyof BusinessInfoInput)[]) {
    errors[field] = nested[field]?.[0];
  }
  return {businessInfo: null, errors};
}

/** Step 1 fields are validated locally only; nothing is sent to the backend yet. */
export function useBusinessInfoForm(initialValues: BusinessInfoInput, onNext: (values: BusinessInfoInput) => void) {
  const [values, setValues] = useState<BusinessInfoInput>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function setField(field: keyof BusinessInfoInput, value: string) {
    setValues((current) => ({...current, [field]: value}));
    setFieldErrors((current) => ({...current, [field]: undefined}));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const {businessInfo, errors} = validate(values);
    setFieldErrors(errors);
    if (businessInfo) onNext(businessInfo);
  }

  return {values, fieldErrors, setField, handleSubmit};
}
