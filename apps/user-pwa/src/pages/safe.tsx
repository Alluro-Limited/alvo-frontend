import {AccessCodeScreen} from "@/components/send/access-code";
import {DropoffSheet} from "@/components/send/dropoff-sheet";
import {ReservedScreen} from "@/components/safe/reserved-screen";
import {SafeWizard} from "@/components/safe/safe-wizard";
import {useSafeFlow} from "@/components/safe/use-safe-flow";

/** Safe Storage: three-step wizard → reserved → access-code screens. */
export function SafePage() {
  const flow = useSafeFlow();

  if (flow.step === "reserved" && flow.reservation) {
    return (
      <>
        <ReservedScreen
          reservation={flow.reservation}
          onOpenSafe={() => flow.setStep("code")}
          onOpenGuide={() => flow.setGuideOpen(true)}
        />
        <DropoffSheet open={flow.guideOpen} nodeName={flow.node?.name ?? ""} onClose={() => flow.setGuideOpen(false)} />
      </>
    );
  }
  if (flow.step === "code" && flow.reservation) {
    return (
      <AccessCodeScreen
        code={flow.reservation.accessCode}
        validUntil={flow.reservation.validUntil}
        remaining={flow.reservation.remaining}
        onBack={flow.back}
      />
    );
  }
  return <SafeWizard flow={flow} />;
}
