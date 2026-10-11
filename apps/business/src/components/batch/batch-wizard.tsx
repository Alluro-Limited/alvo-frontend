import {m} from "@/paraglide/messages";
import {formatNaira} from "@/lib/format-naira";
import {useDashboardOverview} from "@/queries/use-dashboard-queries";
import {GatewayDialog} from "@/components/new-shipment/gateway-dialog";
import {downloadBatchLabels, downloadBatchReceipt} from "@/components/new-shipment/shipment-downloads";
import {AddShipmentsStep} from "./add-shipments-step";
import {BatchDetailsStep} from "./batch-details-step";
import {BatchStepper} from "./batch-stepper";
import {BatchSuccess} from "./batch-success";
import {BatchSummary, OrderSummary} from "./batch-summary";
import {ConfirmStep} from "./confirm-step";
import {ProcessingModal} from "./processing-modal";
import {ReviewStep} from "./review-step";
import {StepList} from "./step-list";
import {useBatchWizard, type BatchStep} from "./use-batch-wizard";
import {WizardFooter} from "./wizard-footer";

type Wizard = ReturnType<typeof useBatchWizard>;

function nextLabelFor(step: BatchStep, wizard: Wizard): string {
  if (step === 1) return m["wiz.next_shipments"]();
  if (step === 2) return m["wiz.next_review"]();
  if (step === 3) return m["wiz.proceed"]({count: wizard.recipients.validRows.length});
  return m["wiz.submit"]({amount: formatNaira(wizard.recipients.cost.total)});
}

function StepBody({step, wizard}: {step: BatchStep; wizard: Wizard}) {
  if (step === 1) return <BatchDetailsStep wizard={wizard} />;
  if (step === 2) return <AddShipmentsStep wizard={wizard} />;
  if (step === 3) return <ReviewStep wizard={wizard} />;
  return <ConfirmStep wizard={wizard} />;
}

function SidePanel({step, wizard}: {step: BatchStep; wizard: Wizard}) {
  if (step === 1) return <StepList step={step} />;
  if (step === 4) return <OrderSummary wizard={wizard} />;
  return <BatchSummary wizard={wizard} />;
}

function footerConfig({step, wizard, walletShort, onExit}: {step: BatchStep; wizard: Wizard; walletShort: boolean; onExit: () => void}) {
  const nextDisabled = (step === 2 && !wizard.canReview) || (step === 4 && walletShort);
  return {
    nextLabel: nextLabelFor(step, wizard),
    nextDisabled,
    isPending: step === 4 && wizard.payment.isPaying,
    onBack: step === 1 ? onExit : wizard.back,
    onNext: step === 4 ? wizard.payment.submit : wizard.next,
  };
}

/** The bulk-shipment wizard: stepper header, step content + contextual side panel, footer nav. */
export function BatchWizard({onExit}: {onExit: () => void}) {
  const wizard = useBatchWizard();
  const {data: overview} = useDashboardOverview();
  const {recipients, payment} = wizard;
  const walletShort = payment.method === "wallet" && (overview?.walletBalance ?? 0) < recipients.cost.total;

  if (payment.result) {
    return (
      <BatchSuccess
        result={payment.result}
        onDownloadLabels={() => downloadBatchLabels(payment.result, recipients.validRows, wizard.lockers)}
        onDownloadReceipt={() => payment.result && downloadBatchReceipt(payment.result)}
      />
    );
  }

  return (
    <section className="flex w-[1100px] max-w-full flex-col rounded-2xl border border-grey-300 bg-white">
      <div className="border-b-[0.75px] border-grey-300">
        <BatchStepper step={wizard.step} />
      </div>
      <div className="flex w-full items-stretch">
        <div className="min-w-0 flex-1 border-r-[0.75px] border-grey-300">
          <StepBody step={wizard.step} wizard={wizard} />
        </div>
        <div className="w-[360px] shrink-0 p-6">
          <SidePanel step={wizard.step} wizard={wizard} />
        </div>
      </div>
      <WizardFooter {...footerConfig({step: wizard.step, wizard, walletShort, onExit})} />
      <GatewayDialog open={payment.gatewayOpen} onComplete={payment.completeGateway} />
      <ProcessingModal open={recipients.processing} />
    </section>
  );
}
