import {useState, type FormEvent} from "react";
import * as v from "valibot";
import {getAuthErrorMessage} from "@/components/auth/auth-errors";
import {API_ERROR_CODES, getErrorCode, type ErrorContext} from "@/lib/api-errors";
import {useResetPasswordMutation} from "@/queries/use-reset-password-mutation";
import {m} from "@/paraglide/messages";
import {resetPasswordSchema} from "./reset-password-schema";

type ResetPasswordValues = v.InferInput<typeof resetPasswordSchema>;
type ResetPasswordField = keyof ResetPasswordValues;

const rejectedPasswordContext: ErrorContext = {
  [API_ERROR_CODES.BAD_REQUEST]: m["reset_password.errors.rejected"],
};

interface UseResetPasswordFormOptions {
  token: string;
  onUpdated: () => void;
  /** The backend answers 410 Gone when the link has expired or was already used. */
  onExpired: () => void;
}

function validate(values: ResetPasswordValues) {
  const result = v.safeParse(resetPasswordSchema, values);
  if (result.success) return {password: result.output.password, errors: {}};
  const nested = v.flatten<typeof resetPasswordSchema>(result.issues).nested;
  return {password: null, errors: {password: nested?.password?.[0], confirmPassword: nested?.confirmPassword?.[0]}};
}

export function useResetPasswordForm({token, onUpdated, onExpired}: UseResetPasswordFormOptions) {
  const mutation = useResetPasswordMutation();
  const [values, setValues] = useState<ResetPasswordValues>({password: "", confirmPassword: ""});
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ResetPasswordField, string>>>({});

  function setField(field: ResetPasswordField, value: string) {
    setValues((current) => ({...current, [field]: value}));
    setFieldErrors((current) => ({...current, [field]: undefined}));
    if (mutation.isError) mutation.reset();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mutation.isPending) return;
    const {password, errors} = validate(values);
    setFieldErrors(errors);
    if (password === null) return;
    mutation.mutate(
      {token, password},
      {
        onSuccess: onUpdated,
        onError: (error) => {
          if (getErrorCode(error) === API_ERROR_CODES.GONE) onExpired();
        },
      }
    );
  }

  const errorMessage = mutation.error ? getAuthErrorMessage(mutation.error, rejectedPasswordContext) : null;

  return {values, fieldErrors, errorMessage, setField, handleSubmit, isPending: mutation.isPending};
}
