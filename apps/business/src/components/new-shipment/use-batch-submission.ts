import {useState} from "react";
import {useCreateBatchMutation} from "@/queries/use-shipment-queries";
import type {CreateBatchResult, PaymentMethod} from "@/types/shipment-types";
import type {RecipientRows} from "./use-recipient-rows";

interface BatchSubmissionOptions {
  rows: RecipientRows;
  onSuccess: (batch: CreateBatchResult) => void;
}

/** Payment-dialog and gateway state plus the create-batch mutation. */
export function useBatchSubmission({rows, onSuccess}: BatchSubmissionOptions) {
  const createBatch = useCreateBatchMutation();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [gatewayOpen, setGatewayOpen] = useState(false);
  const [method, setMethod] = useState<PaymentMethod | null>(null);

  function openPayment() {
    if (!rows.allValid) {
      rows.markErrors();
      return;
    }
    setMethod("wallet");
    setPaymentOpen(true);
  }

  function submitBatch(paymentMethod: PaymentMethod) {
    createBatch.mutate(
      {recipients: rows.recipients.map(({id: _id, ...recipient}) => recipient), method: paymentMethod},
      {
        onSuccess: (batch) => {
          setPaymentOpen(false);
          setGatewayOpen(false);
          onSuccess(batch);
        },
      }
    );
  }

  function handleDialogPay() {
    if (method === "online") {
      setPaymentOpen(false);
      setGatewayOpen(true);
      return;
    }
    submitBatch("wallet");
  }

  return {
    paymentOpen,
    gatewayOpen,
    method,
    isPaying: createBatch.isPending,
    payFailed: createBatch.isError && paymentOpen,
    openPayment,
    closePayment: () => setPaymentOpen(false),
    setMethod,
    handleDialogPay,
    completeGateway: () => submitBatch("online"),
  };
}
