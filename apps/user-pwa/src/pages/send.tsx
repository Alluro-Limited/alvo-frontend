import {AccessCodeScreen} from "@/components/send/access-code";
import {ConfirmedScreen} from "@/components/send/confirmed-screen";
import {DropoffSheet} from "@/components/send/dropoff-sheet";
import {SendWizard} from "@/components/send/send-wizard";
import {ServiceScreen} from "@/components/send/service-screen";
import {useSendFlow} from "@/components/send/use-send-flow";

/** Send Securely: service picker → four-step wizard → confirmed → access-code screens. */
export function SendPage() {
  const flow = useSendFlow();

  if (flow.step === "service") return <ServiceScreen onBack={flow.back} onNext={() => flow.setStep("package")} />;
  if (flow.step === "confirmed" && flow.booking) {
    return (
      <>
        <ConfirmedScreen booking={flow.booking} onShowCode={() => flow.setStep("code")} onOpenGuide={() => flow.setGuideOpen(true)} />
        <DropoffSheet open={flow.guideOpen} nodeName={flow.origin?.name ?? ""} onClose={() => flow.setGuideOpen(false)} />
      </>
    );
  }
  if (flow.step === "code" && flow.booking) {
    return (
      <AccessCodeScreen
        code={flow.booking.dropOffCode}
        validUntil={flow.booking.validUntil}
        remaining={flow.booking.remaining}
        onBack={flow.back}
      />
    );
  }
  return <SendWizard flow={flow} />;
}
