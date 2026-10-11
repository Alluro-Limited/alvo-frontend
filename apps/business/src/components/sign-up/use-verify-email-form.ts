import {useState, type FormEvent} from "react";
import {useNavigate} from "@tanstack/react-router";
import {useResendCodeMutation, useVerifyEmailMutation} from "@/queries/use-sign-up-mutations";
import type {AuthAlertState} from "@/components/auth/auth-alert";
import {markOnboardingPending} from "@/lib/onboarding-flag";
import {m} from "@/paraglide/messages";
import {OTP_LENGTH} from "./sign-up-schema";
import {getVerificationError, type VerificationError} from "./sign-up-errors";

const SIGN_IN_REDIRECT_DELAY_MS = 1200;

/**
 * Final step: the 5-digit code is verified against the backend, then the user lands
 * on the dashboard where the welcome modal + tour pick up the pending-onboarding flag.
 */
export function useVerifyEmailForm() {
  const navigate = useNavigate();
  const verify = useVerifyEmailMutation();
  const resend = useResendCodeMutation();
  const [code, setCode] = useState("");
  const isLocked = verify.isPending || verify.isSuccess;

  function handleCodeChange(value: string) {
    setCode(value);
    if (verify.isError) verify.reset();
    if (resend.isSuccess) resend.reset();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code.length !== OTP_LENGTH || isLocked) return;
    verify.mutate(code, {
      onSuccess: () => {
        markOnboardingPending();
        setTimeout(() => void navigate({to: "/dashboard"}), SIGN_IN_REDIRECT_DELAY_MS);
      },
    });
  }

  function handleResend() {
    if (resend.isPending || resend.isSuccess) return;
    resend.mutate();
  }

  let banner: VerificationError | null = null;
  let alert: AuthAlertState | null = null;
  if (verify.isSuccess) alert = {tone: "success", message: m["sign_up.verify_success"]()};
  else if (verify.error) banner = getVerificationError(verify.error);

  return {
    code,
    banner,
    alert,
    handleCodeChange,
    handleSubmit,
    handleResend,
    isComplete: code.length === OTP_LENGTH,
    isPending: verify.isPending,
    isLocked,
    isResending: resend.isPending,
    isResent: resend.isSuccess,
  };
}
