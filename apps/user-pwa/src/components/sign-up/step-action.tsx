import {Button} from "@alvo/ui";
import {isDetailsValid} from "./details-step";
import type {useSignUpFlow} from "./use-sign-up-flow";
import {m} from "@/paraglide/messages";

const PASSWORD_MIN = 8;

type Flow = ReturnType<typeof useSignUpFlow>;

/** The bottom-pinned primary button for each wizard step (the code step has none). */
export function StepAction({flow}: {flow: Flow}) {
  if (flow.step === "details") {
    return (
      <Button
        className="w-full text-[16px] font-medium"
        variant={isDetailsValid(flow.details) ? "default" : "disabled"}
        onClick={() => flow.setConfirmOpen(true)}
      >
        {m["su.next"]()}
      </Button>
    );
  }
  if (flow.step === "method") {
    return (
      <Button
        className="w-full text-[16px] font-medium"
        variant={flow.method ? "default" : "disabled"}
        isLoading={flow.busy}
        onClick={() => flow.method && flow.sendCode(flow.method)}
      >
        {flow.busy ? m["su.sending"]() : m["su.continue"]()}
      </Button>
    );
  }
  if (flow.step === "password") {
    return (
      <Button
        className="w-full text-[16px] font-medium"
        variant={flow.password.length >= PASSWORD_MIN && flow.agreed ? "default" : "disabled"}
        isLoading={flow.busy}
        onClick={() => flow.complete()}
      >
        {flow.busy ? m["su.completing"]() : m["su.complete"]()}
      </Button>
    );
  }
  return null;
}
