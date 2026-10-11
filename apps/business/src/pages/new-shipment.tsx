import {m} from "@/paraglide/messages";
import {useDashboardOverview} from "@/queries/use-dashboard-queries";
import {GatewayDialog} from "@/components/new-shipment/gateway-dialog";
import {ModeSelect} from "@/components/new-shipment/mode-select";
import {OrderPanel} from "@/components/new-shipment/order-panel";
import {PaymentDialog} from "@/components/new-shipment/payment-dialog";
import {ShipmentForm} from "@/components/new-shipment/shipment-form";
import {ShipmentSuccess} from "@/components/new-shipment/shipment-success";
import {useNewShipmentFlow} from "@/components/new-shipment/use-new-shipment-flow";
import {BatchWizard} from "@/components/batch/batch-wizard";

function FormStage({flow}: {flow: ReturnType<typeof useNewShipmentFlow>}) {
  const {rows} = flow;
  return (
    <div className="flex w-full items-stretch">
      <ShipmentForm
        recipients={rows.recipients}
        lockers={rows.lockers}
        showErrors={rows.showErrors}
        onChange={rows.patchRecipient}
        onRemove={rows.removeRecipient}
        onAdd={rows.addRecipient}
      />
      <OrderPanel
        recipients={rows.recipients}
        lockers={rows.lockers}
        total={rows.total}
        canPay={rows.recipients.length > 0}
        onRemove={rows.removeRecipient}
        onPay={flow.submission.openPayment}
      />
    </div>
  );
}

export function NewShipmentPage() {
  const {data: overview} = useDashboardOverview();
  const flow = useNewShipmentFlow();
  const {submission, result} = flow;

  if (flow.stage === "batch") {
    return <BatchWizard onExit={flow.resetFlow} />;
  }

  if (flow.stage === "success" && result) {
    return (
      <ShipmentSuccess
        result={result}
        receiptEmail={result.receiptEmail}
        onDownloadLabels={flow.downloadLabels}
        onDownloadReceipt={flow.downloadReceipt}
        onCreateAnother={flow.resetFlow}
      />
    );
  }

  return (
    <section className="flex w-[1100px] max-w-full flex-col rounded-2xl border border-grey-300 bg-white">
      {flow.stage === "select" ? <ModeSelect onSelect={flow.startForm} /> : <FormStage flow={flow} />}
      <PaymentDialog
        open={submission.paymentOpen}
        total={flow.rows.total}
        walletBalance={overview?.walletBalance ?? 0}
        method={submission.method}
        isPaying={submission.isPaying}
        errorMessage={submission.payFailed ? m["pay.failed"]() : null}
        onMethodChange={submission.setMethod}
        onPay={submission.handleDialogPay}
        onClose={submission.closePayment}
      />
      <GatewayDialog open={submission.gatewayOpen} onComplete={submission.completeGateway} />
    </section>
  );
}
