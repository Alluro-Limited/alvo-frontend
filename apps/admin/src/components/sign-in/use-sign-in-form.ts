import {useState, type FormEvent} from "react";
import {useNavigate} from "@tanstack/react-router";
import * as v from "valibot";
import {useSignInMutation} from "@/queries/use-sign-in-mutation";
import {workEmailDomains} from "@/lib/work-email-domains";
import type {SignInCredentials} from "@/types/auth-types";
import {m} from "@/paraglide/messages";
import {createSignInSchema} from "./sign-in-schema";
import {getSignInErrorMessage} from "./sign-in-errors";

/** How long the success alert stays up before the redirect, so it can be read. */
export const SIGN_IN_REDIRECT_DELAY_MS = 1200;

type SignInField = keyof SignInCredentials;
type FieldErrors = Partial<Record<SignInField, string>>;
export type SignInAlert = {tone: "success" | "error"; message: string};

const signInSchema = createSignInSchema(workEmailDomains);

function validate(values: SignInCredentials) {
  const result = v.safeParse(signInSchema, values);
  if (result.success) return {credentials: result.output, errors: {}};
  const nested = v.flatten<typeof signInSchema>(result.issues).nested;
  return {credentials: null, errors: {email: nested?.email?.[0], password: nested?.password?.[0]}};
}

export function useSignInForm() {
  const navigate = useNavigate();
  const mutation = useSignInMutation();
  const [values, setValues] = useState<SignInCredentials>({email: "", password: ""});
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
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
    mutation.mutate(credentials, {
      onSuccess: () => setTimeout(() => void navigate({to: "/dashboard"}), SIGN_IN_REDIRECT_DELAY_MS),
    });
  }

  let alert: SignInAlert | null = null;
  if (mutation.isSuccess) alert = {tone: "success", message: m["sign_in.success"]()};
  else if (mutation.error) alert = {tone: "error", message: getSignInErrorMessage(mutation.error)};

  return {values, fieldErrors, alert, setField, handleSubmit, isPending: mutation.isPending, isLocked};
}
