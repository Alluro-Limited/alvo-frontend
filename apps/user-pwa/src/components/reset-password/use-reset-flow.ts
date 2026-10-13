import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {maskEmail} from "@/components/sign-up/masking";
import {authService} from "@/services/auth-service";

export type ResetStep = "email" | "code" | "password" | "done";

function useResetState() {
  const navigate = useNavigate();
  const [step, setStep] = useState<ResetStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const back = () => {
    if (step === "email") void navigate({to: "/sign-in"});
    else if (step === "code") setStep("email");
    else if (step === "password") setStep("code");
  };

  return {
    step,
    email,
    maskedEmail: maskEmail(email),
    code,
    password,
    error,
    busy,
    back,
    setStep,
    setEmail,
    setCode,
    setPassword,
    setError,
    setBusy,
  };
}

type State = ReturnType<typeof useResetState>;

function useResetActions(s: State) {
  const run = (task: Promise<void>) => {
    s.setBusy(true);
    void task.finally(() => s.setBusy(false));
  };

  const sendCode = () => run(authService.requestPasswordReset(s.email).then(() => s.setStep("code")));

  const verify = () => {
    s.setError(false);
    run(
      authService
        .verifyResetCode(s.code)
        .then(() => s.setStep("password"))
        .catch(() => s.setError(true))
    );
  };

  const resend = () => void authService.requestPasswordReset(s.email);

  const update = () => run(authService.resetPassword(s.password).then(() => s.setStep("done")));

  return {sendCode, verify, resend, update};
}

/** State machine for the reset flow: email → code → new password → "Password Updated!". */
export function useResetFlow() {
  const state = useResetState();
  const actions = useResetActions(state);
  return {...state, ...actions};
}
