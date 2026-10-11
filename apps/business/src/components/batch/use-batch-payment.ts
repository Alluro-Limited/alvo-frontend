import {useState} from "react";
import {useCreateBatchMutation} from "@/queries/use-shipment-queries";
import type {CreateBatchResult, PaymentMethod} from "@/types/shipment-types";
import type {BatchDetails} from "./use-batch-details";
import type {BatchRecipients} from "./use-batch-recipients";

interface BatchPaymentOptions {
  details: BatchDetails;
  recipients: BatchRecipients;
}

/** Step-4 submission: payment method, gateway handoff, and the create-batch mutation. */
export function useBatchPayment({details, recipients}: BatchPaymentOptions) {
  const createBatch = useCreateBatchMutation();
  const [method, setMethod] = useState<PaymentMethod>("wallet");
  const [gatewayOpen, setGatewayOpen] = useState(false);
  const [result, setResult] = useState<CreateBatchResult | null>(null);

  function pay(paymentMethod: PaymentMethod) {
    createBatch.mutate(
      {
        recipients: recipients.validRows.map(({id: _id, csvRow: _row, ...recipient}) => recipient),
        method: paymentMethod,
        name: details.name.trim(),
        notes: details.notes.trim() || undefined,
        originLockerId: details.origin,
      },
      {
        onSuccess: (batch) => {
          setGatewayOpen(false);
          setResult(batch);
        },
      }
    );
  }

  function submit() {
    if (method === "online") {
      setGatewayOpen(true);
      return;
    }
    pay("wallet");
  }

  return {
    method,
    gatewayOpen,
    isPaying: createBatch.isPending,
    payFailed: createBatch.isError,
    result,
    setMethod,
    submit,
    completeGateway: () => pay("online"),
  };
}
