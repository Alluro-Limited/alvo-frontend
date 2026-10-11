import {useState} from "react";
import type {CreateBatchResult, ShipmentMode} from "@/types/shipment-types";
import {downloadBatchLabels, downloadBatchReceipt} from "./shipment-downloads";
import {useBatchSubmission} from "./use-batch-submission";
import {useRecipientRows} from "./use-recipient-rows";

export type NewShipmentStage = "select" | "form" | "batch" | "success";

/** Composes row state, payment submission, and stage transitions for the new-shipment flow. */
export function useNewShipmentFlow() {
  const rows = useRecipientRows();
  const [stage, setStage] = useState<NewShipmentStage>("select");
  const [result, setResult] = useState<CreateBatchResult | null>(null);
  const submission = useBatchSubmission({
    rows,
    onSuccess: (batch) => {
      setResult(batch);
      setStage("success");
    },
  });

  function startForm(mode: ShipmentMode = "single") {
    if (mode === "bulk") {
      setStage("batch");
      return;
    }
    rows.startRows();
    setStage("form");
  }

  function resetFlow() {
    rows.clearRows();
    setResult(null);
    setStage("select");
  }

  return {
    stage,
    result,
    rows,
    submission,
    startForm,
    resetFlow,
    downloadLabels: () => downloadBatchLabels(result, rows.recipients, rows.lockers),
    downloadReceipt: () => result && downloadBatchReceipt(result),
  };
}
