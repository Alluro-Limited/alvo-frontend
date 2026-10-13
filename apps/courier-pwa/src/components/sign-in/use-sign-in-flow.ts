import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {useLoginPhone} from "./use-login-phone";
import {useLoginVerify} from "./use-login-verify";

export type SignInStep = "phone" | "verify" | "loading";

/** State machine behind /sign-in: phone → SMS code → short loading screen → /home. */
export function useSignInFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignInStep>("phone");
  const phone = useLoginPhone(() => setStep("verify"));
  const verify = useLoginVerify(phone.value, () => setStep("loading"));

  const back = () => {
    if (step !== "verify") return void navigate({to: "/onboarding"});
    verify.reset();
    setStep("phone");
  };

  return {step, phone, verify, back};
}
