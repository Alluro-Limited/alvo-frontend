import {useState} from "react";
import {API_ERROR_CODES, getErrorCode} from "@/lib/api-errors";
import type {SimpleMessage} from "@/lib/i18n";
import {useRequestLoginOtpMutation} from "@/queries/use-auth-mutations";

const MIN_PHONE_DIGITS = 7;

/** Phone entry: local digits, inline validation, and the request-OTP mutation (404 → "no account"). */
export function useLoginPhone(onVerified: () => void) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<SimpleMessage | null>(null);
  const requestOtp = useRequestLoginOtpMutation();

  const submit = () => {
    if (value.replace(/\D/g, "").length < MIN_PHONE_DIGITS) return setError("su.err_phone");
    requestOtp.mutate(value, {
      onSuccess: onVerified,
      onError: (e) => setError(getErrorCode(e) === API_ERROR_CODES.NOT_FOUND ? "auth.err_unknown_phone" : "auth.err_send"),
    });
  };

  return {
    value,
    error,
    pending: requestOtp.isPending,
    submit,
    change: (next: string) => {
      setError(null);
      setValue(next);
    },
  };
}
