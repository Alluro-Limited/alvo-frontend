import {useState} from "react";
import {API_ERROR_CODES, getErrorCode} from "@/lib/api-errors";
import type {SimpleMessage} from "@/lib/i18n";
import {useResendLoginOtpMutation, useVerifyLoginOtpMutation} from "@/queries/use-auth-mutations";
import {OTP_LENGTH} from "@/types/auth-types";

/** Code entry: digit state, verify mutation (400 → wrong code, 429 → lockout), and resend. */
export function useLoginVerify(phone: string, onVerified: () => void) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<SimpleMessage | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const verify = useVerifyLoginOtpMutation();
  const resend = useResendLoginOtpMutation();

  const change = (next: string) => {
    setError(null);
    setCode(next);
    if (next.length !== OTP_LENGTH) return;
    verify.mutate(
      {phone, code: next},
      {
        onSuccess: onVerified,
        onError: (e) => (getErrorCode(e) === API_ERROR_CODES.RATE_LIMIT ? setRateLimited(true) : setError("auth.err_code")),
      }
    );
  };

  const reset = () => {
    setCode("");
    setError(null);
    setRateLimited(false);
  };

  return {
    code,
    error,
    rateLimited,
    pending: verify.isPending,
    resendPending: resend.isPending,
    change,
    reset,
    resend: () => resend.mutateAsync(phone),
  };
}
