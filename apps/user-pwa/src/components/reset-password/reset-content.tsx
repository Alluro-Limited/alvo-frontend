import {AuthField} from "@/components/auth/auth-field";
import {CheckEmailStep} from "./check-email-step";
import {NewPasswordStep} from "./new-password-step";
import type {useResetFlow} from "./use-reset-flow";
import {m} from "@/paraglide/messages";

type Flow = ReturnType<typeof useResetFlow>;

/** The body area of each reset step (title + input). */
export function ResetContent({flow}: {flow: Flow}) {
  if (flow.step === "email") {
    return (
      <>
        <div className="flex w-full flex-col gap-2">
          <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-foreground">{m["rp.title"]()}</h1>
          <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-grey-500">{m["rp.desc"]()}</p>
        </div>
        <AuthField
          id="rp-email"
          label={m["su.email"]()}
          type="email"
          value={flow.email}
          onChange={flow.setEmail}
          placeholder={m["rp.email_ph"]()}
          autoComplete="email"
        />
      </>
    );
  }
  if (flow.step === "code") {
    return (
      <CheckEmailStep
        maskedEmail={flow.maskedEmail}
        error={flow.error}
        busy={flow.busy}
        code={flow.code}
        onCode={flow.setCode}
        onResend={flow.resend}
      />
    );
  }
  if (flow.step === "password") {
    return <NewPasswordStep password={flow.password} onPassword={flow.setPassword} />;
  }
  return null;
}
