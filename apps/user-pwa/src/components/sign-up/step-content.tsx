import {CodeStep} from "./code-step";
import {DetailsStep} from "./details-step";
import {MethodStep} from "./method-step";
import {PasswordStep} from "./password-step";
import type {useSignUpFlow} from "./use-sign-up-flow";
import {m} from "@/paraglide/messages";

type Flow = ReturnType<typeof useSignUpFlow>;

/** The body area of each wizard step (title + fields); the "done" state renders outside this. */
export function StepContent({flow}: {flow: Flow}) {
  if (flow.step === "details") {
    return (
      <>
        <div className="flex w-full flex-col gap-2">
          <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-foreground">{m["su.title"]()}</h1>
          <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-grey-500">{m["su.desc"]()}</p>
        </div>
        <DetailsStep details={flow.details} onChange={flow.updateDetails} />
      </>
    );
  }
  if (flow.step === "method") {
    return (
      <>
        <div className="flex w-full flex-col gap-2">
          <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-foreground">{m["su.verify_title"]()}</h1>
          <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-grey-500">{m["su.verify_desc"]()}</p>
        </div>
        <MethodStep value={flow.method} onChange={flow.setMethod} />
      </>
    );
  }
  if (flow.step === "code" && flow.method) {
    return (
      <CodeStep
        method={flow.method}
        destination={flow.method === "email" ? flow.emailDest : flow.phoneDest}
        error={flow.codeError}
        busy={flow.busy}
        onVerify={flow.verify}
        onResend={flow.resend}
        onChangeMethod={() => flow.setSheetOpen(true)}
      />
    );
  }
  if (flow.step === "password") {
    return <PasswordStep password={flow.password} agreed={flow.agreed} onPassword={flow.setPassword} onAgree={flow.setAgreed} />;
  }
  return null;
}
