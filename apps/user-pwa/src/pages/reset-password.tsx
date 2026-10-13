import {useNavigate} from "@tanstack/react-router";
import {Button} from "@alvo/ui";
import {AuthHeader} from "@/components/auth/auth-header";
import {SuccessScreen} from "@/components/auth/success-screen";
import {ResetAction} from "@/components/reset-password/reset-action";
import {ResetContent} from "@/components/reset-password/reset-content";
import {useResetFlow} from "@/components/reset-password/use-reset-flow";
import {m} from "@/paraglide/messages";

/** Reset flow: email → "Check Your Email" code → "Create New Password" → "Password Updated!". */
export function ResetPasswordPage() {
  const navigate = useNavigate();
  const flow = useResetFlow();

  if (flow.step === "done") {
    return (
      <SuccessScreen title={m["rp.done"]()} description={m["rp.done_desc"]()}>
        <Button className="w-full text-[16px] font-medium" onClick={() => void navigate({to: "/sign-in"})}>
          {m["rp.back_signin"]()}
        </Button>
      </SuccessScreen>
    );
  }

  return (
    <main className="flex h-dvh w-full flex-col bg-white px-6 pt-[65px]">
      <AuthHeader onBack={flow.back} />
      <div className="mt-[26px] flex flex-1 flex-col gap-8 overflow-y-auto pb-4">
        <ResetContent flow={flow} />
      </div>
      <div className="mb-6 pb-[max(0px,env(safe-area-inset-bottom))]">
        <ResetAction flow={flow} />
      </div>
    </main>
  );
}
