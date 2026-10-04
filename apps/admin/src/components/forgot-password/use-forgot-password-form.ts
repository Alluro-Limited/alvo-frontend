import {useState, type FormEvent} from "react";
import * as v from "valibot";
import {getAuthErrorMessage} from "@/components/auth/auth-errors";
import {createWorkEmailSchema} from "@/components/auth/work-email-schema";
import type {AuthAlertState} from "@/components/auth/auth-alert";
import {workEmailDomains} from "@/lib/work-email-domains";
import {useRequestPasswordResetMutation} from "@/queries/use-request-password-reset-mutation";
import {m} from "@/paraglide/messages";

const emailSchema = createWorkEmailSchema(workEmailDomains, () => m["forgot_password.errors.email_required"]());

export function useForgotPasswordForm() {
  const mutation = useRequestPasswordResetMutation();
  const [email, setEmailValue] = useState("");
  const [emailError, setEmailError] = useState<string>();

  function setEmail(value: string) {
    setEmailValue(value);
    setEmailError(undefined);
    if (!mutation.isIdle) mutation.reset();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mutation.isPending) return;
    const result = v.safeParse(emailSchema, email);
    setEmailError(result.success ? undefined : result.issues[0].message);
    if (result.success) mutation.mutate(result.output);
  }

  let alert: AuthAlertState | null = null;
  if (mutation.isSuccess) alert = {tone: "success", message: m["forgot_password.success"]()};
  else if (mutation.error) alert = {tone: "error", message: getAuthErrorMessage(mutation.error)};

  return {email, emailError, alert, setEmail, handleSubmit, isPending: mutation.isPending};
}
