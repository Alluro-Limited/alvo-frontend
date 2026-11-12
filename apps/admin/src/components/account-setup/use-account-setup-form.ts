import {useState, type FormEvent} from "react";
import * as v from "valibot";
import {API_ERROR_CODES} from "@/lib/api-errors";
import {getAuthErrorMessage} from "@/components/auth/auth-errors";
import type {AuthAlertState} from "@/components/auth/auth-alert";
import type {CompleteAccountSetupInput, SignInChallenge} from "@/types/auth-types";
import {useCompleteAccountSetupMutation} from "@/queries/use-complete-account-setup-mutation";
import {m} from "@/paraglide/messages";
import {accountSetupSchema} from "./account-setup-schema";

type SetupField = keyof CompleteAccountSetupInput;
type FieldErrors = Partial<Record<SetupField, string>>;

const errorContext = {[API_ERROR_CODES.GONE]: m["account_setup.errors.invitation_expired"]};

function validate(values: CompleteAccountSetupInput) {
  const result = v.safeParse(accountSetupSchema, values);
  if (result.success) return {input: result.output, errors: {}};
  const nested = v.flatten<typeof accountSetupSchema>(result.issues).nested;
  return {
    input: null,
    errors: {
      firstName: nested?.firstName?.[0],
      lastName: nested?.lastName?.[0],
      password: nested?.password?.[0],
    },
  };
}

export function useAccountSetupForm() {
  const mutation = useCompleteAccountSetupMutation();
  const [values, setValues] = useState<CompleteAccountSetupInput>({firstName: "", lastName: "", password: ""});
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [challenge, setChallenge] = useState<SignInChallenge | null>(null);

  function setField(field: SetupField, value: string) {
    setValues((current) => ({...current, [field]: value}));
    setFieldErrors((current) => ({...current, [field]: undefined}));
    if (mutation.isError) mutation.reset();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mutation.isPending) return;
    const {input, errors} = validate(values);
    setFieldErrors(errors);
    if (!input) return;
    // Accepting the invitation returns the sign-in challenge — TOTP enrollment follows.
    mutation.mutate(input, {onSuccess: setChallenge});
  }

  const alert: AuthAlertState | null = mutation.error ? {tone: "error", message: getAuthErrorMessage(mutation.error, errorContext)} : null;

  return {values, fieldErrors, alert, challenge, setField, handleSubmit, isPending: mutation.isPending};
}
