import {Button} from "@alvo/ui";
import type {useResetFlow} from "./use-reset-flow";
import {m} from "@/paraglide/messages";
import {OTP_LENGTH} from "@/types/auth-types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 8;

type Flow = ReturnType<typeof useResetFlow>;

export function isResetEmailValid(email: string): boolean {
  return EMAIL_RE.test(email);
}

export function isResetPasswordValid(password: string): boolean {
  return password.length >= PASSWORD_MIN;
}

/** The bottom-pinned primary button for each reset step. */
export function ResetAction({flow}: {flow: Flow}) {
  if (flow.step === "email") {
    return (
      <Button
        className="w-full text-[16px] font-medium"
        variant={isResetEmailValid(flow.email) ? "default" : "disabled"}
        isLoading={flow.busy}
        onClick={() => flow.sendCode()}
      >
        {flow.busy ? m["rp.sending"]() : m["rp.send"]()}
      </Button>
    );
  }
  if (flow.step === "code") {
    return (
      <Button
        className="w-full text-[16px] font-medium"
        variant={flow.code.length === OTP_LENGTH ? "default" : "disabled"}
        isLoading={flow.busy}
        onClick={() => flow.verify()}
      >
        {flow.busy ? m["rp.verifying"]() : m["rp.verify"]()}
      </Button>
    );
  }
  if (flow.step === "password") {
    return (
      <Button
        className="w-full text-[16px] font-medium"
        variant={isResetPasswordValid(flow.password) ? "default" : "disabled"}
        isLoading={flow.busy}
        onClick={() => flow.update()}
      >
        {flow.busy ? m["rp.updating"]() : m["rp.update"]()}
      </Button>
    );
  }
  return null;
}
