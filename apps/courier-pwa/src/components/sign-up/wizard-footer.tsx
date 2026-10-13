import {Button} from "@alvo/ui";
import type {useSignupWizard, WizardStep} from "./use-signup-wizard";
import {m} from "@/paraglide/messages";

interface WizardFooterProps {
  step: WizardStep;
  wizard: ReturnType<typeof useSignupWizard>;
}

export function WizardFooter({step, wizard}: WizardFooterProps) {
  const submitted = step === 5;
  const label = step === 0 ? m["su.start"]() : step === 4 ? m["su.submit"]() : submitted ? m["su.done"]() : m["su.continue"]();

  return (
    <footer className="px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <Button className="h-[50px] w-full text-[16px]" isLoading={wizard.submit.isPending} onClick={submitted ? wizard.done : wizard.next}>
        {wizard.submit.isPending ? m["su.submitting"]() : label}
      </Button>
      {wizard.submit.isError && <p className="mt-2 text-center text-[13px] text-danger-500">{m["su.err_submit"]()}</p>}
    </footer>
  );
}
