import {useState, type FormEvent} from "react";
import * as v from "valibot";
import {useSignInMutation} from "@/queries/use-sign-in-mutation";
import {workEmailDomains} from "@/lib/work-email-domains";
import type {SignInChallenge, SignInCredentials} from "@/types/auth-types";
import type {AuthAlertState} from "@/components/auth/auth-alert";
import {createSignInSchema} from "./sign-in-schema";
import {getSignInErrorMessage} from "./sign-in-errors";

/** How long the success alert stays up before the redirect, so it can be read. */
export const SIGN_IN_REDIRECT_DELAY_MS = 1200;

type SignInField = keyof SignInCredentials;
type FieldErrors = Partial<Record<SignInField, string>>;

const signInSchema = createSignInSchema(workEmailDomains);

function validate(values: SignInCredentials) {
  const result = v.safeParse(signInSchema, values);
  if (result.success) return {credentials: result.output, errors: {}};
  const nested = v.flatten<typeof signInSchema>(result.issues).nested;
  return {credentials: null, errors: {email: nested?.email?.[0], password: nested?.password?.[0]}};
}

export function useSignInForm() {
  const mutation = useSignInMutation();
  const [values, setValues] = useState<SignInCredentials>({email: "", password: ""});
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [challenge, setChallenge] = useState<SignInChallenge | null>(null);
  const isLocked = mutation.isPending || mutation.isSuccess;

  function setField(field: SignInField, value: string) {
    setValues((current) => ({...current, [field]: value}));
    setFieldErrors((current) => ({...current, [field]: undefined}));
    if (mutation.isError) mutation.reset();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLocked) return;
    const {credentials, errors} = validate(values);
    setFieldErrors(errors);
    if (!credentials) return;
    // Sign-in always answers with a TOTP challenge — the form swaps to the code step.
    mutation.mutate(credentials, {onSuccess: setChallenge});
  }

  const alert: AuthAlertState | null = mutation.error ? {tone: "error", message: getSignInErrorMessage(mutation.error)} : null;

  return {values, fieldErrors, alert, challenge, setField, handleSubmit, isPending: mutation.isPending, isLocked};
}
