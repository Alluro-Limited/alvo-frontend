import {useState, type FormEvent} from "react";
import * as v from "valibot";
import type {AuthAlertState} from "@/components/auth/auth-alert";
import {getAuthErrorMessage} from "@/components/auth/auth-errors";
import {API_ERROR_CODES, getErrorCode, type ErrorContext} from "@/lib/api-errors";
import {useResetPasswordMutation} from "@/queries/use-reset-password-mutation";
import {m} from "@/paraglide/messages";
import {meetsPasswordRules} from "./password-rules";
import {resetPasswordSchema} from "./reset-password-schema";

/** How long "New password confirmed successfully." stays up before the "Password updated" screen. */
export const RESET_PASSWORD_CONFIRM_DELAY_MS = 1200;

type ResetPasswordValues = v.InferInput<typeof resetPasswordSchema>;

const rejectedPasswordContext: ErrorContext = {
  [API_ERROR_CODES.BAD_REQUEST]: m["reset_password.errors.rejected"],
};

interface UseResetPasswordFormOptions {
  token: string;
  onUpdated: () => void;
  /** The backend answers 410 Gone when the link has expired or was already used. */
  onExpired: () => void;
}

export function useResetPasswordForm({token, onUpdated, onExpired}: UseResetPasswordFormOptions) {
  const mutation = useResetPasswordMutation();
  const [values, setValues] = useState<ResetPasswordValues>({password: "", confirmPassword: ""});
  const [validationError, setValidationError] = useState<string | null>(null);
  const isLocked = mutation.isPending || mutation.isSuccess;
  const canSubmit = meetsPasswordRules(values.password) && values.confirmPassword !== "";

  function setField(field: keyof ResetPasswordValues, value: string) {
    setValues((current) => ({...current, [field]: value}));
    setValidationError(null);
    if (mutation.isError) mutation.reset();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || isLocked) return;
    const result = v.safeParse(resetPasswordSchema, values);
    if (!result.success) return setValidationError(result.issues[0].message);
    mutation.mutate(
      {token, password: result.output.password},
      {
        onSuccess: () => setTimeout(onUpdated, RESET_PASSWORD_CONFIRM_DELAY_MS),
        onError: (error) => {
          if (getErrorCode(error) === API_ERROR_CODES.GONE) onExpired();
        },
      }
    );
  }

  let alert: AuthAlertState | null = null;
  if (mutation.isSuccess) alert = {tone: "success", message: m["reset_password.success"]()};
  else if (validationError) alert = {tone: "error", message: validationError};
  else if (mutation.error) alert = {tone: "error", message: getAuthErrorMessage(mutation.error, rejectedPasswordContext)};

  return {values, alert, canSubmit, isLocked, setField, handleSubmit, isPending: mutation.isPending};
}
