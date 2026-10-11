import {useState, type FormEvent} from "react";
import {useNavigate} from "@tanstack/react-router";
import * as v from "valibot";
import {useLoginMutation} from "@/queries/use-login-mutation";
import type {SignInCredentials} from "@/types/auth-types";
import type {AuthAlertState} from "@/components/auth/auth-alert";
import {m} from "@/paraglide/messages";
import {loginSchema} from "./login-schema";
import {getLoginError} from "./login-errors";

type LoginField = keyof SignInCredentials;
type FieldErrors = Partial<Record<LoginField, string>>;

function validate(values: SignInCredentials) {
  const result = v.safeParse(loginSchema, values);
  if (result.success) return {credentials: result.output, errors: {}};
  const nested = v.flatten<typeof loginSchema>(result.issues).nested;
  return {credentials: null, errors: {email: nested?.email?.[0], password: nested?.password?.[0]}};
}

export function useLoginForm() {
  const mutation = useLoginMutation();
  const navigate = useNavigate();
  const [values, setValues] = useState<SignInCredentials>({email: "", password: ""});
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const isLocked = mutation.isPending || mutation.isSuccess;

  function setField(field: LoginField, value: string) {
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
      onSuccess: () => void navigate({to: "/dashboard"}),
      onError: (error) => {
        const {passwordError} = getLoginError(error);
        if (passwordError) setFieldErrors((current) => ({...current, password: passwordError}));
      },
    });
  }

  let alert: AuthAlertState | null = null;
  if (mutation.isSuccess) alert = {tone: "success", message: m["login.success"]()};
  else if (mutation.error) {
    const {alertMessage} = getLoginError(mutation.error);
    if (alertMessage) alert = {tone: "error", message: alertMessage};
  }

  return {values, fieldErrors, alert, setField, handleSubmit, isPending: mutation.isPending, isLocked};
}
