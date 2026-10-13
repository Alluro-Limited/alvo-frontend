import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {maskEmail, maskPhone} from "./masking";
import {authService} from "@/services/auth-service";
import type {SignUpDetails, VerificationMethod} from "@/types/auth-types";

export type SignUpStep = "details" | "method" | "code" | "password" | "done";

const EMPTY_DETAILS: SignUpDetails = {fullName: "", preferredName: "", phone: "", email: "", referralCode: ""};

function useSignUpState() {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignUpStep>("details");
  const [details, setDetails] = useState<SignUpDetails>(EMPTY_DETAILS);
  const [method, setMethod] = useState<VerificationMethod | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);

  const back = () => {
    if (step === "details") void navigate({to: "/onboarding"});
    else if (step === "method") setStep("details");
    else if (step === "code") setStep("method");
    else if (step === "password") setStep("code");
  };

  return {
    step,
    details,
    method,
    emailDest: maskEmail(details.email),
    phoneDest: maskPhone(details.phone),
    confirmOpen,
    sheetOpen,
    codeError,
    password,
    agreed,
    busy,
    back,
    setStep,
    setMethod,
    setConfirmOpen,
    setSheetOpen,
    setCodeError,
    setPassword,
    setAgreed,
    setBusy,
    updateDetails: (patch: Partial<SignUpDetails>) => setDetails((d) => ({...d, ...patch})),
  };
}

type State = ReturnType<typeof useSignUpState>;

function useSignUpActions(s: State) {
  const run = (task: Promise<void>) => {
    s.setBusy(true);
    void task.finally(() => s.setBusy(false));
  };

  const confirmDetails = () =>
    run(
      authService.createAccount(s.details).then(() => {
        s.setConfirmOpen(false);
        s.setStep("method");
      })
    );

  const sendCode = (channel: VerificationMethod) =>
    run(
      authService.requestVerificationCode(channel).then(() => {
        s.setMethod(channel);
        s.setStep("code");
      })
    );

  const verify = (code: string) => {
    s.setCodeError(false);
    run(
      authService
        .verifyCode(code)
        .then(() => s.setStep("password"))
        .catch(() => s.setCodeError(true))
    );
  };

  const pickMethod = (channel: VerificationMethod) => {
    s.setSheetOpen(false);
    s.setCodeError(false);
    sendCode(channel);
  };

  const resend = () => {
    if (s.method) void authService.requestVerificationCode(s.method);
  };

  const complete = () => run(authService.completeRegistration(s.password).then(() => s.setStep("done")));

  return {confirmDetails, sendCode, verify, pickMethod, resend, complete};
}

/** State machine for the three-step sign-up wizard plus its confirm/method overlays. */
export function useSignUpFlow() {
  const state = useSignUpState();
  const actions = useSignUpActions(state);
  return {...state, ...actions};
}
