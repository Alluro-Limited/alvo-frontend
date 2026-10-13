import {WizardHeader} from "@/components/sign-up/wizard-header";
import {LoadingHome} from "@/components/sign-in/loading-home";
import {PhoneStep} from "@/components/sign-in/phone-step";
import {useSignInFlow} from "@/components/sign-in/use-sign-in-flow";
import {VerifyStep} from "@/components/sign-in/verify-step";

export function SignInPage() {
  const flow = useSignInFlow();

  if (flow.step === "loading") return <LoadingHome />;

  return (
    <main className="flex min-h-dvh flex-col bg-white px-6 pt-[calc(env(safe-area-inset-top)+18px)] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <WizardHeader step={0} onBack={flow.back} />
      <div className="mt-7 flex flex-1 flex-col">
        {flow.step === "phone" ? (
          <PhoneStep
            phone={flow.phone.value}
            error={flow.phone.error}
            pending={flow.phone.pending}
            onPhoneChange={flow.phone.change}
            onSubmit={flow.phone.submit}
          />
        ) : (
          <VerifyStep
            phone={flow.phone.value}
            code={flow.verify.code}
            error={flow.verify.error}
            rateLimited={flow.verify.rateLimited}
            pending={flow.verify.pending}
            resend={flow.verify.resend}
            resendPending={flow.verify.resendPending}
            onCodeChange={flow.verify.change}
          />
        )}
      </div>
    </main>
  );
}
