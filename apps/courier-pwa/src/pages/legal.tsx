import {useNavigate} from "@tanstack/react-router";
import {LegalLink} from "@/components/legal/legal-link";
import {WizardHeader} from "@/components/sign-up/wizard-header";
import {m} from "@/paraglide/messages";

/** Legal & Support — the four legal document links. */
export function LegalPage() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-white px-6 pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <WizardHeader step={0} onBack={() => void navigate({to: "/profile"})} />
      <h1 className="mt-9 text-[24px] leading-[30px] font-medium tracking-[-0.01em]">{m["legal.title"]()}</h1>
      <nav className="mt-6">
        <LegalLink doc="terms" />
        <LegalLink doc="privacy" />
        <LegalLink doc="conduct" />
        <LegalLink doc="liability" />
      </nav>
    </main>
  );
}
