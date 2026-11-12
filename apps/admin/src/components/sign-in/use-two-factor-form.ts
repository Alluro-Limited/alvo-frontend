import {useState, type FormEvent} from "react";
import {useNavigate} from "@tanstack/react-router";
import {useSecondFactorMutation} from "@/queries/use-second-factor-mutation";
import type {AuthAlertState} from "@/components/auth/auth-alert";
import type {SignInChallenge} from "@/types/auth-types";
import {m} from "@/paraglide/messages";
import {getTwoFactorErrorMessage} from "./two-factor-errors";
import {SIGN_IN_REDIRECT_DELAY_MS} from "./use-sign-in-form";

const CODE_LENGTH = 6;

export function useTwoFactorForm(challenge: SignInChallenge) {
  const navigate = useNavigate();
  const mutation = useSecondFactorMutation();
  const [code, setCode] = useState("");
  const isLocked = mutation.isPending || mutation.isSuccess;

  function handleCodeChange(value: string) {
    setCode(value);
    if (mutation.isError) mutation.reset();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLocked || code.length !== CODE_LENGTH) return;
    mutation.mutate(
      {challengeId: challenge.challengeId, code, enrolling: Boolean(challenge.enrollment)},
      {
        onSuccess: ({accountStatus}) => {
          if (accountStatus === "setup_required") return void navigate({to: "/account-setup"});
          setTimeout(() => void navigate({to: "/dashboard"}), SIGN_IN_REDIRECT_DELAY_MS);
        },
      }
    );
  }

  let alert: AuthAlertState | null = null;
  if (mutation.isSuccess) alert = {tone: "success", message: m["sign_in.success"]()};
  else if (mutation.error) alert = {tone: "error", message: getTwoFactorErrorMessage(mutation.error)};

  return {
    code,
    alert,
    handleCodeChange,
    handleSubmit,
    isComplete: code.length === CODE_LENGTH,
    isPending: mutation.isPending,
    isLocked,
  };
}
