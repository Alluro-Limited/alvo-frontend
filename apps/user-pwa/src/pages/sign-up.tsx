import {AuthHeader} from "@/components/auth/auth-header";
import {AllSet} from "@/components/sign-up/all-set";
import {ConfirmDetails} from "@/components/sign-up/confirm-details";
import {MethodSheet} from "@/components/sign-up/method-sheet";
import {StepAction} from "@/components/sign-up/step-action";
import {StepContent} from "@/components/sign-up/step-content";
import {useSignUpFlow} from "@/components/sign-up/use-sign-up-flow";

/** Three-step registration: details → verification method → code → password → "You're All Set!". */
export function SignUpPage() {
  const flow = useSignUpFlow();

  if (flow.step === "done") return <AllSet />;

  const stepNum = flow.step === "details" ? 1 : flow.step === "password" ? 3 : 2;

  return (
    <main className="flex h-dvh w-full flex-col bg-white px-6 pt-[65px]">
      <AuthHeader step={stepNum} onBack={flow.back} />
      <div className="mt-8 flex flex-1 flex-col gap-8 overflow-y-auto pb-4">
        <StepContent flow={flow} />
      </div>
      <div className="mb-6 pb-[max(0px,env(safe-area-inset-bottom))]">
        <StepAction flow={flow} />
      </div>
      <ConfirmDetails
        open={flow.confirmOpen}
        details={flow.details}
        busy={flow.busy}
        onEdit={() => flow.setConfirmOpen(false)}
        onConfirm={() => flow.confirmDetails()}
      />
      <MethodSheet
        open={flow.sheetOpen}
        onClose={() => flow.setSheetOpen(false)}
        onPick={flow.pickMethod}
        emailDest={flow.emailDest}
        phoneDest={flow.phoneDest}
      />
    </main>
  );
}
