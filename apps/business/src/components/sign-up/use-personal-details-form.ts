import {useState, type FormEvent} from "react";
import * as v from "valibot";
import {useSignUpMutation} from "@/queries/use-sign-up-mutations";
import type {BusinessInfoInput, PersonalDetailsInput} from "@/types/auth-types";
import type {AuthAlertState} from "@/components/auth/auth-alert";
import {personalDetailsSchema} from "./sign-up-schema";
import {getSignUpErrorMessage} from "./sign-up-errors";

type FieldErrors = Partial<Record<keyof PersonalDetailsInput, string>>;

function validate(values: PersonalDetailsInput) {
  const result = v.safeParse(personalDetailsSchema, values);
  if (result.success) return {details: result.output, errors: {}};
  const nested = v.flatten<typeof personalDetailsSchema>(result.issues).nested ?? {};
  const errors: FieldErrors = {};
  for (const field of Object.keys(nested) as (keyof PersonalDetailsInput)[]) {
    errors[field] = nested[field]?.[0];
  }
  return {details: null, errors};
}

/**
 * Step 2 creates the account: both steps' answers are submitted together and the
 * backend sends the verification code, so success advances to the OTP step.
 */
export function usePersonalDetailsForm(
  businessInfo: BusinessInfoInput,
  initialValues: PersonalDetailsInput,
  onNext: (values: PersonalDetailsInput) => void
) {
  const mutation = useSignUpMutation();
  const [values, setValues] = useState<PersonalDetailsInput>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const isLocked = mutation.isPending;

  function setField(field: keyof PersonalDetailsInput, value: string) {
    setValues((current) => ({...current, [field]: value}));
    setFieldErrors((current) => ({...current, [field]: undefined}));
    if (mutation.isError) mutation.reset();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLocked) return;
    const {details, errors} = validate(values);
    setFieldErrors(errors);
    if (!details) return;
    mutation.mutate({...businessInfo, ...details}, {onSuccess: () => onNext(details)});
  }

  const alert: AuthAlertState | null = mutation.error ? {tone: "error", message: getSignUpErrorMessage(mutation.error)} : null;

  return {values, fieldErrors, alert, setField, handleSubmit, isPending: mutation.isPending, isLocked};
}
