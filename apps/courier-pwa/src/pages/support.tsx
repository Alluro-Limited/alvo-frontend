import {useNavigate} from "@tanstack/react-router";
import {WizardHeader} from "@/components/sign-up/wizard-header";
import {ContactCard} from "@/components/support/contact-card";
import {m} from "@/paraglide/messages";
import {useSupportContactQuery} from "@/queries/use-earnings-queries";

/** SOS & Support — the siren-icon target. One Courier Support card with call/email actions. */
export function SupportPage() {
  const navigate = useNavigate();
  const query = useSupportContactQuery();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-white px-6 pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <WizardHeader step={0} onBack={() => void navigate({to: "/home"})} />
      <h1 className="mt-9 text-[24px] leading-[30px] font-medium tracking-[-0.01em]">{m["support.title"]()}</h1>
      <p className="mt-2 text-[16px] leading-[22px] text-grey-500">{m["support.subtitle"]()}</p>
      <div className="mt-8">
        {query.isPending || !query.data ? (
          <div className="h-[191px] animate-pulse rounded-[16px] bg-grey-100" />
        ) : (
          <ContactCard contact={query.data} />
        )}
      </div>
    </main>
  );
}
