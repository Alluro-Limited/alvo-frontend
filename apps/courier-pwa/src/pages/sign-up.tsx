import {useSignupWizard} from "@/components/sign-up/use-signup-wizard";
import {WizardContent} from "@/components/sign-up/wizard-content";
import {WizardFooter} from "@/components/sign-up/wizard-footer";
import {WizardHeader} from "@/components/sign-up/wizard-header";

export function SignUpPage() {
  const wizard = useSignupWizard();

  return (
    <main className="flex h-dvh w-full flex-col bg-white">
      <div className="px-6 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
        {wizard.step === 5 ? (
          <p className="flex h-8 items-center justify-center text-[18px] font-semibold text-primary-500">AlvoGo</p>
        ) : (
          <WizardHeader step={wizard.step} onBack={wizard.back} />
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-8 pb-6">
        <WizardContent step={wizard.step} wizard={wizard} />
      </div>
      <WizardFooter step={wizard.step} wizard={wizard} />
    </main>
  );
}
